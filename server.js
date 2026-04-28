/**
 * SVM Task Management System
 * 
 * A mobile-friendly task management system that integrates:
 * - Google Sheets as backend database
 * - Claude AI for intelligent task insights
 * - Real-time task updates
 * 
 * Author: Shivani Kinagi
 */

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

// Initialize Claude AI
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Helper function to get current date in YYYY-MM-DD format
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

// Helper function to get day of week
function getDayOfWeek(date = new Date()) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

// Get all tasks from Google Sheet
async function getAllTasks() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Tasks!A2:G', // Assuming headers in row 1
    });

    const rows = response.data.values || [];
    return rows.map((row, index) => ({
      rowIndex: index + 2, // +2 because row 1 is header and array is 0-indexed
      taskName: row[0] || '',
      taskType: row[1] || '',
      assignedTo: row[2] || '',
      plannedDate: row[3] || '',
      actualCompletionDate: row[4] || '',
      status: row[5] || 'Pending',
      weeklyScore: row[6] || '0',
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

// Update task status in Google Sheet
async function updateTaskStatus(rowIndex, completionDate) {
  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `Tasks!E${rowIndex}:F${rowIndex}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[completionDate, 'Done']],
      },
    });
    return true;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

// Calculate weekly score using Claude AI
async function calculateWeeklyScoreWithAI(tasks, teamMember) {
  try {
    const taskSummary = tasks
      .filter(t => t.assignedTo === teamMember)
      .map(t => `${t.taskName} - Planned: ${t.plannedDate}, Status: ${t.status}`)
      .join('\n');

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Analyze these tasks and calculate a weekly score. Give negative points for missed or late tasks, positive for on-time completion. Return only a number and brief explanation.

Tasks:
${taskSummary}

Current date: ${getCurrentDate()}`
      }]
    });

    return message.content[0].text;
  } catch (error) {
    console.error('Error with Claude AI:', error);
    return 'Score calculation unavailable';
  }
}

// Get task insights using Claude AI
async function getTaskInsights(tasks, teamMember) {
  try {
    const userTasks = tasks.filter(t => t.assignedTo === teamMember);
    const pendingCount = userTasks.filter(t => t.status === 'Pending').length;
    const completedCount = userTasks.filter(t => t.status === 'Done').length;

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: `Give a brief, motivational insight (2-3 sentences) for a team member with ${pendingCount} pending tasks and ${completedCount} completed tasks today. Be encouraging and specific.`
      }]
    });

    return message.content[0].text;
  } catch (error) {
    console.error('Error getting insights:', error);
    return 'Keep up the great work!';
  }
}

// API Endpoints

// Get tasks for a specific team member
app.get('/api/tasks/:teamMember', async (req, res) => {
  try {
    const teamMember = decodeURIComponent(req.params.teamMember);
    const allTasks = await getAllTasks();
    const today = getCurrentDate();
    const dayOfWeek = getDayOfWeek();

    // Filter tasks for this team member
    let userTasks = allTasks.filter(task => 
      task.assignedTo.toLowerCase() === teamMember.toLowerCase()
    );

    // Filter for today's tasks
    const todayTasks = userTasks.filter(task => {
      if (task.taskType === 'Daily') return true;
      if (task.taskType === 'Weekly' && task.plannedDate === dayOfWeek) return true;
      if (task.taskType === 'One-time' && task.plannedDate === today) return true;
      return false;
    });

    // Separate recurring and one-time tasks
    const recurringTasks = todayTasks.filter(t => 
      t.taskType === 'Daily' || t.taskType === 'Weekly'
    );
    const oneTimeTasks = todayTasks.filter(t => t.taskType === 'One-time');

    // Get AI insights
    const insights = await getTaskInsights(allTasks, teamMember);

    res.json({
      teamMember,
      date: today,
      recurringTasks,
      oneTimeTasks,
      insights,
      totalPending: todayTasks.filter(t => t.status === 'Pending').length,
      totalCompleted: todayTasks.filter(t => t.status === 'Done').length,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Mark task as done
app.post('/api/tasks/complete', async (req, res) => {
  try {
    const { rowIndex, teamMember } = req.body;
    const completionDate = getCurrentDate();

    await updateTaskStatus(rowIndex, completionDate);

    res.json({ 
      success: true, 
      message: 'Task marked as complete!',
      completionDate 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Get weekly score for a team member
app.get('/api/score/:teamMember', async (req, res) => {
  try {
    const teamMember = decodeURIComponent(req.params.teamMember);
    const allTasks = await getAllTasks();
    const score = await calculateWeeklyScoreWithAI(allTasks, teamMember);

    res.json({ teamMember, score });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to calculate score' });
  }
});

// Get all team members
app.get('/api/team-members', async (req, res) => {
  try {
    const allTasks = await getAllTasks();
    const teamMembers = [...new Set(allTasks.map(t => t.assignedTo).filter(Boolean))];
    res.json({ teamMembers });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ SVM Task Management System running on port ${PORT}`);
  console.log(`📱 Open http://localhost:${PORT} on your mobile device`);
});
