/**
 * Long-term Memory System for Career Chatbot
 * 
 * This module implements pattern-based memory extraction and storage:
 * - Extracts key facts from user messages (name, role, goals, experience)
 * - Stores memories per conversation with deduplication
 * - Provides memory context for system prompt injection
 * - Manages memory lifecycle (cleanup, retrieval)
 * 
 * Design Philosophy:
 * - Simple: Uses regex patterns instead of complex NLP
 * - Effective: Captures career-relevant information reliably
 * - Transparent: Easy to debug and understand what's stored
 * - Scalable: Fast pattern matching, could be extended with DB storage
 * 
 * Author: Shivani Kinagi
 */

class MemorySystem {
  constructor() {
    // Store memories per conversation ID
    this.memories = new Map();
  }

  /**
   * Extract potential memory-worthy information from a conversation turn
   */
  extractMemories(userMessage, botResponse) {
    const memories = [];

    // Career-related patterns to remember
    const patterns = [
      { regex: /my (?:current )?(?:job|role|position) is (?:a |an )?(.+?)(?:\.|$|,)/i, type: 'current_role' },
      { regex: /i(?:'m| am) (?:a |an )?(.+?)(?:\.|$|,)/i, type: 'identity' },
      { regex: /i want to (?:become|be) (?:a |an )?(.+?)(?:\.|$|,)/i, type: 'career_goal' },
      { regex: /i(?:'m| am) looking for (.+?)(?:\.|$|,)/i, type: 'job_search' },
      { regex: /my (?:background|experience) is in (.+?)(?:\.|$|,)/i, type: 'background' },
      { regex: /i have (\d+) years? of experience/i, type: 'experience_years' },
      { regex: /my name is (.+?)(?:\.|$|,)/i, type: 'name' },
      { regex: /i(?:'m| am) interested in (.+?)(?:\.|$|,)/i, type: 'interest' }
    ];

    for (const pattern of patterns) {
      const match = userMessage.match(pattern.regex);
      if (match) {
        memories.push({
          type: pattern.type,
          value: match[1].trim(),
          timestamp: Date.now()
        });
      }
    }

    return memories;
  }

  /**
   * Add memories for a conversation
   */
  addMemories(conversationId, userMessage, botResponse) {
    if (!this.memories.has(conversationId)) {
      this.memories.set(conversationId, []);
    }

    const newMemories = this.extractMemories(userMessage, botResponse);
    const existingMemories = this.memories.get(conversationId);

    // Add new memories, avoiding duplicates
    for (const newMem of newMemories) {
      const isDuplicate = existingMemories.some(
        existing => existing.type === newMem.type && existing.value === newMem.value
      );
      if (!isDuplicate) {
        existingMemories.push(newMem);
      }
    }

    // Keep only last 20 memories to avoid context bloat
    if (existingMemories.length > 20) {
      existingMemories.splice(0, existingMemories.length - 20);
    }
  }

  /**
   * Get formatted memory context for system prompt
   */
  getMemoryContext(conversationId) {
    const memories = this.memories.get(conversationId);
    if (!memories || memories.length === 0) {
      return '';
    }

    const memoryLines = memories.map(mem => {
      switch (mem.type) {
        case 'name':
          return `- User's name: ${mem.value}`;
        case 'current_role':
          return `- Current role: ${mem.value}`;
        case 'career_goal':
          return `- Career goal: ${mem.value}`;
        case 'background':
          return `- Background: ${mem.value}`;
        case 'experience_years':
          return `- Experience: ${mem.value} years`;
        case 'job_search':
          return `- Looking for: ${mem.value}`;
        case 'interest':
          return `- Interested in: ${mem.value}`;
        case 'identity':
          return `- Identity: ${mem.value}`;
        default:
          return `- ${mem.type}: ${mem.value}`;
      }
    });

    return `\n\nREMEMBERED CONTEXT ABOUT THIS USER:\n${memoryLines.join('\n')}`;
  }

  /**
   * Get all memories for a conversation (for debugging)
   */
  getMemories(conversationId) {
    return this.memories.get(conversationId) || [];
  }

  /**
   * Clear memories for a conversation
   */
  clearMemories(conversationId) {
    this.memories.delete(conversationId);
  }
}

module.exports = new MemorySystem();
