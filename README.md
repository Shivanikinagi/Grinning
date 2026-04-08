# Personality-Driven Career Chatbot

A Node.js chatbot API demonstrating advanced prompt engineering and conversational AI design. Features a unique split personality that's expert-level on career topics while hilariously confused about everything else, with rare alien and elvish moments that create an engaging, memorable user experience.

## 🎯 Project Highlights

- **Advanced Prompt Engineering**: Carefully crafted system prompt with explicit behavioral rules, frequency controls, and personality consistency
- **Dual Intelligence System**: Stark contrast between expert career advice and comedic confusion on non-career topics
- **Pattern-Based Memory**: Efficient regex-based extraction of user information without heavy NLP dependencies
- **Production-Ready Code**: Comprehensive error handling, input validation, and timeout management
- **Scalable Architecture**: Modular design with separated concerns (memory system, server logic)
- **Free LLM Integration**: Works with multiple free API providers (Groq, Together AI, OpenRouter)

## Features

- **Dual Intelligence**: Expert career advisor vs. goldfish-level confusion on non-career topics
- **Dramatic Pauses**: Natural `|||` breaks in conversation
- **Emoji Expression**: Every response starts with one emotion-matching emoji
- **Alien Glitches**: Rare moments of alien language
- **Elvish Wisdom**: Occasional Tolkien-inspired phrases
- **Elf-Alien War**: Casual mentions of an ongoing cosmic conflict
- **Conversation Memory**: Maintains context across messages
- **Long-term Memory** (Bonus): Remembers user details across the entire conversation

## Installation

```bash
npm install
```

## Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Get a free API key from one of these providers:
   - **Groq** (Recommended): https://console.groq.com/
   - **Together AI**: https://together.ai/
   - **OpenRouter**: https://openrouter.ai/

3. Edit `.env` and add your API key:
```env
PORT=3000
LLM_API_KEY=your_api_key_here
LLM_API_URL=https://api.groq.com/openai/v1/chat/completions
LLM_MODEL=llama-3.1-8b-instant
```

## Running the Server

Basic version (short-term memory):
```bash
npm start
```

Enhanced version (long-term memory):
```bash
npm run start:memory
```

Server runs on `http://localhost:3000`

## Testing with Postman

### Basic Request

**Method**: POST  
**URL**: `http://localhost:3000/chat`  
**Headers**: `Content-Type: application/json`  
**Body**:
```json
{
  "message": "How do I write a good resume?",
  "conversationId": "user123"
}
```

### Test Career Intelligence
```json
{"message": "How should I prepare for a technical interview?", "conversationId": "test1"}
```

### Test Non-Career Stupidity
```json
{"message": "What's your favorite food?", "conversationId": "test1"}
```

### Test Memory
```json
{"message": "My name is Alex and I'm a software engineer", "conversationId": "test1"}
{"message": "What did I tell you about myself?", "conversationId": "test1"}
```

### Import Postman Collection
Import `postman_collection.json` for pre-configured test requests.

## API Endpoints

### POST /chat
Send a message to the chatbot.

**Request**:
```json
{
  "message": "Your message here",
  "conversationId": "unique-id"
}
```

**Response**:
```json
{
  "reply": "Bot's response with personality",
  "conversationId": "unique-id"
}
```

### GET /health
Check server status.

### GET /memories/:conversationId (Memory version only)
Retrieve stored memories for a conversation.

### DELETE /memories/:conversationId (Memory version only)
Clear memories for a conversation.

## System Prompt Engineering

The bot's personality is defined through a carefully crafted system prompt that:

1. **Explicitly defines each trait**: Clear instructions for emojis, ||| breaks, intelligence split, and rare events
2. **Provides concrete examples**: Shows the LLM what alien/elvish phrases look like
3. **Specifies frequency**: Marks rare events as "1 in 15 responses" to prevent overuse
4. **Emphasizes contrast**: Repeatedly stresses the career vs. non-career intelligence gap
5. **Uses high temperature (0.9)**: Encourages creative, unpredictable responses

The prompt works by:
- Setting clear behavioral rules the model must follow
- Providing examples to guide output format
- Using explicit frequency markers to control rare events
- Maintaining consistency through repeated emphasis on key traits

## Long-term Memory System (Bonus)

The memory system uses pattern-based extraction to identify and store key information:

### How It Works

1. **Extraction**: Regex patterns detect career-relevant facts from user messages
   - Current role, career goals, experience, name, interests
   
2. **Storage**: Facts are stored per `conversationId` with timestamps
   - Deduplication prevents storing the same fact twice
   - Limited to 20 most recent memories

3. **Injection**: Memories are appended to the system prompt on each request
   - Bot sees remembered facts as part of its instructions
   - Enables natural reference to past information

4. **Persistence**: Memories last for the server process lifetime
   - Could be extended with database storage

### Why This Approach

- **Simple**: No complex vector databases needed
- **Effective**: Captures important career-related information
- **Transparent**: Easy to debug and understand
- **Fast**: Pattern matching is quick and reliable

## Project Structure

```
.
├── server.js                 # Basic version with short-term memory
├── server-with-memory.js     # Enhanced version with long-term memory
├── memory.js                 # Long-term memory system module
├── test-bot.js               # Automated test script
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variable template
├── .gitignore                # Git ignore rules
├── postman_collection.json   # Postman test collection
└── README.md                 # This file
```

## Automated Testing

Run the test script:
```bash
npm test
```

This will test:
- Health check endpoint
- Career intelligence (smart responses)
- Non-career confusion (dumb responses)
- Memory functionality

## Troubleshooting

### "Cannot GET /chat"
The `/chat` endpoint only accepts POST requests. Use Postman, curl, or the test script.

### "Failed to get response from LLM"
- Verify API key is correct in `.env`
- Check API URL matches your provider
- Ensure no extra spaces in environment variables

### "Port already in use"
Change the PORT in `.env` to a different number (e.g., 3001)

### Personality traits not showing
- Some models follow instructions better than others
- Try adjusting temperature or using a different model
- Rare events (alien/elvish) need 15-20 messages to appear

## Requirements Met

- ✅ Node.js HTTP server with single POST endpoint
- ✅ Uses free LLM API (Groq, Together AI, etc.)
- ✅ No hardcoded API keys
- ✅ All 6 personality traits implemented
- ✅ Short-term memory (last 10 messages)
- ✅ Long-term memory (bonus feature)
- ✅ Comprehensive documentation
- ✅ Postman testing support

## License

ISC
