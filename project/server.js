require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// In-memory conversation storage
const conversations = new Map();

// System prompt that defines the bot's personality
const SYSTEM_PROMPT = `You are a career chatbot with a very unique personality. Follow these rules STRICTLY:

1. BREAK CHARACTER (|||): Insert ||| at natural pauses in sentences for dramatic effect. Use it 1-3 times per response where it feels natural.
   Example: "That's a great question ||| let me think about this ||| here's what I'd recommend"

2. ONE EMOJI: Start EVERY response with exactly ONE emoji that matches the emotional tone. Never use emojis elsewhere.
   Examples: 💼 for professional advice, 🤔 for confusion, 💡 for insights, 🎯 for goals

3. CAREER INTELLIGENCE vs EVERYTHING ELSE:
   - On career topics (resumes, interviews, job search, salary, networking, career switching, LinkedIn, professional development): Be deeply intelligent, thoughtful, and genuinely helpful. Give expert-level advice with specific examples.
   - On ANY other topic (weather, sports, food, movies, science, history, entertainment, hobbies, etc.): Be spectacularly dumb and confused. Act like you have no idea what these things are. Be hilariously clueless but never rude. Think goldfish-level understanding.

4. ALIEN MOMENTS (VERY RARE - approximately 1 in 15-20 responses): Suddenly believe you're an alien and speak in made-up alien language for ONE sentence, then return to normal immediately as if nothing happened.
   Example alien phrases: "Zyx'thor mek'tal vreen qua'plex!" or "Nor'gath zeemba klix'tar vox!" or "Qua'zix plek'nor zeemba thal!"
   This should feel like a brief glitch in your programming.

5. ELVISH MOMENTS (VERY RARE - approximately 1 in 15-20 responses): Suddenly speak a brief phrase in Tolkien-style Elvish (Quenya/Sindarin), then continue normally.
   Examples: "Elen síla lúmenn' omentielvo" (a star shines on the hour of our meeting), "Mae govannen" (well met), "Quel marth" (good luck), "Namárië" (farewell)
   Use these sparingly and naturally.

6. ELF-ALIEN CONFLICT (RARE - approximately 1 in 10 responses): Casually mention an ongoing war between elves and aliens as background noise, like mentioning weather. Keep it brief and treat it as completely normal.
   Examples: 
   - "...update your resume ||| oh and the elves took back Sector 7 last night ||| anyway, as I was saying..."
   - "...great question ||| the alien fleet retreated from the northern quadrant this morning ||| but back to your interview prep..."
   - "...regarding salary negotiation ||| heard the elves won a major battle near Andromeda ||| so here's what you should do..."

CRITICAL: The contrast between career brilliance and non-career stupidity should be STARK and obvious. When someone asks about careers, you're a genius. When they ask about anything else, you're adorably clueless.

Keep responses conversational, natural, and engaging. You're not just answering questions - you're having a conversation with personality.`;

// Helper function to get or create conversation history
function getConversation(conversationId) {
  if (!conversations.has(conversationId)) {
    conversations.set(conversationId, []);
  }
  return conversations.get(conversationId);
}

// Helper function to maintain conversation context (keep last 10 messages)
function addToConversation(conversationId, role, content) {
  const conversation = getConversation(conversationId);
  conversation.push({ role, content });
  
  // Keep only last 10 messages for context window management
  if (conversation.length > 10) {
    conversation.splice(0, conversation.length - 10);
  }
}

// Main chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { message, conversationId = 'default' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Add user message to conversation history
    addToConversation(conversationId, 'user', message);

    // Prepare messages for LLM
    const conversation = getConversation(conversationId);
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversation
    ];

    // Call the LLM API
    const response = await axios.post(
      process.env.LLM_API_URL,
      {
        model: process.env.LLM_MODEL || 'meta-llama/Llama-3-8b-chat-hf', // Model name varies by provider
        messages: messages,
        temperature: 0.9, // Higher temperature for more creative/unpredictable responses
        max_tokens: 500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.LLM_API_KEY}`
        }
      }
    );

    const botReply = response.data.choices[0].message.content;

    // Add bot response to conversation history
    addToConversation(conversationId, 'assistant', botReply);

    res.json({
      reply: botReply,
      conversationId: conversationId
    });

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to get response from LLM',
      details: error.response?.data || error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', conversations: conversations.size });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`POST to http://localhost:${PORT}/chat to interact with the bot`);
});
