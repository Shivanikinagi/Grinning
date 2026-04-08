/**
 * Simple test script to verify the bot is working
 * Run with: node test-bot.js
 */

require('dotenv').config();
const axios = require('axios');

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

async function testBot() {
  console.log('🤖 Testing Career Chatbot...\n');

  const tests = [
    {
      name: 'Health Check',
      type: 'GET',
      url: '/health',
      expected: 'Should return status ok'
    },
    {
      name: 'Career Question (Smart)',
      type: 'POST',
      url: '/chat',
      body: {
        message: 'How do I write a good resume?',
        conversationId: 'test-script'
      },
      expected: 'Should give intelligent career advice with ||| breaks and emoji'
    },
    {
      name: 'Non-Career Question (Dumb)',
      type: 'POST',
      url: '/chat',
      body: {
        message: 'What is pizza?',
        conversationId: 'test-script'
      },
      expected: 'Should be hilariously confused'
    },
    {
      name: 'Memory Test',
      type: 'POST',
      url: '/chat',
      body: {
        message: 'What did we just talk about?',
        conversationId: 'test-script'
      },
      expected: 'Should remember previous messages'
    }
  ];

  for (const test of tests) {
    try {
      console.log(`\n📝 Test: ${test.name}`);
      console.log(`Expected: ${test.expected}`);
      console.log('---');

      let response;
      if (test.type === 'GET') {
        response = await axios.get(`${BASE_URL}${test.url}`);
      } else {
        response = await axios.post(`${BASE_URL}${test.url}`, test.body);
      }

      console.log('✅ Success!');
      if (response.data.reply) {
        console.log(`\nBot Reply:\n${response.data.reply}\n`);
      } else {
        console.log(`Response: ${JSON.stringify(response.data, null, 2)}\n`);
      }

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.log('❌ Failed!');
      if (error.code === 'ECONNREFUSED') {
        console.log(`Error: Cannot connect to server at ${BASE_URL}`);
        console.log('Make sure the server is running with: npm start\n');
        break;
      } else {
        console.log(`Error: ${error.response?.data?.error || error.message}\n`);
      }
    }
  }

  console.log('\n🎉 Testing complete!');
  console.log('\nNext steps:');
  console.log('1. Check that responses have emojis at the start');
  console.log('2. Look for ||| breaks in the text');
  console.log('3. Verify career advice is intelligent');
  console.log('4. Verify non-career responses are confused/dumb');
  console.log('5. Keep chatting to see rare alien/elvish moments!\n');
}

// Check if server is likely running
console.log(`Checking server at ${BASE_URL}...`);
console.log('Make sure you started the server first!\n');

testBot().catch(error => {
  console.error('Test script error:', error.message);
  process.exit(1);
});
