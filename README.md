# SVM Task Management System

A mobile-friendly task management system with Google Sheets backend and Claude AI integration.

## 🎯 Features

- **Google Sheets Backend**: All tasks stored in Google Sheets for easy management
- **Mobile-First Design**: Optimized for mobile devices with touch-friendly interface
- **Real-time Updates**: Tasks update instantly in Google Sheets when marked complete
- **Claude AI Integration**: AI-powered task insights and weekly score calculations
- **Task Types**: Support for Daily, Weekly, and One-time tasks
- **Team Management**: Each team member sees only their assigned tasks

## 📋 System Components

### Part 1: Google Sheet (Backend)
The Google Sheet contains the following columns:
1. **Task Name** - Description of the task
2. **Task Type** - Daily / Weekly / One-time
3. **Assigned To** - Team member name
4. **Planned Date** - For Daily: any date, Weekly: day of week, One-time: specific date
5. **Actual Completion Date** - Auto-filled when marked done
6. **Status** - Pending / Done
7. **Weekly Score** - Calculated based on task completion (negative for missed/late)

### Part 2: Mobile Web App (Frontend)
- Team member selection screen
- Today's tasks view with two sections:
  - Recurring Tasks (Daily/Weekly)
  - One-time Tasks
- One-tap "Mark as Done" functionality
- AI-powered insights and motivation
- Real-time statistics

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- Google Cloud Project with Sheets API enabled
- Anthropic API key (Claude AI)

### Setup Steps

1. **Clone and Install**
```bash
npm install
```

2. **Google Sheets Setup**
   - Create a new Google Sheet with columns: Task Name, Task Type, Assigned To, Planned Date, Actual Completion Date, Status, Weekly Score
   - Name the sheet tab "Tasks"
   - Go to Google Cloud Console
   - Enable Google Sheets API
   - Create a Service Account
   - Download the JSON key file
   - Share your Google Sheet with the service account email (Editor access)

3. **Get Claude AI API Key**
   - Sign up at https://console.anthropic.com/
   - Create an API key

4. **Configure Environment**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
PORT=3000
GOOGLE_SHEET_ID=your_sheet_id_from_url
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
ANTHROPIC_API_KEY=your_anthropic_api_key
```

5. **Run the Server**
```bash
npm start
```

6. **Access on Mobile**
   - Open `http://localhost:3000` on your mobile device
   - Or use ngrok for external access: `ngrok http 3000`

## 📱 How to Use

1. **Select Your Name** - Choose your name from the team member list
2. **View Today's Tasks** - See all tasks assigned to you for today
3. **Mark as Done** - Tap the "Mark as Done" button to complete a task
4. **Get AI Insights** - View personalized insights powered by Claude AI
5. **Refresh** - Pull down or tap refresh to update tasks

## 🤖 Claude AI Integration

Claude AI is integrated in two key areas:

1. **Task Insights**: Provides personalized, motivational insights based on your task completion status
2. **Weekly Score Calculation**: Analyzes task completion patterns and calculates scores with explanations

The AI helps team members stay motivated and provides intelligent feedback on their performance.

## 🏗️ Architecture

```
┌─────────────────┐
│  Mobile Browser │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────────────┐
│   Express Server        │
│  ┌──────────────────┐  │
│  │  API Endpoints   │  │
│  └──────────────────┘  │
│  ┌──────────────────┐  │
│  │  Claude AI SDK   │  │
│  └──────────────────┘  │
└────────┬────────────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼────────┐
│Claude│  │  Google   │
│  AI  │  │  Sheets   │
└──────┘  └───────────┘
```

## 📂 Project Structure

```
.
├── server.js              # Express server with API endpoints
├── public/
│   ├── index.html        # Mobile-friendly UI
│   ├── styles.css        # Responsive styling
│   └── app.js            # Frontend JavaScript
├── package.json          # Dependencies
├── .env.example          # Environment template
└── README.md            # This file
```

## 🔧 API Endpoints

- `GET /api/tasks/:teamMember` - Get tasks for a team member
- `POST /api/tasks/complete` - Mark a task as complete
- `GET /api/score/:teamMember` - Get weekly score with AI analysis
- `GET /api/team-members` - Get list of all team members
- `GET /health` - Health check

## 🎨 Design Approach

**My Approach (4-5 lines):**

I built a mobile-first task management system using Google Sheets as a real-time database and Claude AI for intelligent insights. The frontend is a progressive web app with touch-optimized UI that filters tasks by type and date. Claude AI analyzes task patterns to provide motivational insights and calculate performance scores. The system uses Google Sheets API for instant updates and maintains a clean separation between data (Sheets), logic (Express), and presentation (mobile UI).

## 🔐 Security Notes

- Never commit `.env` file
- Keep API keys secure
- Use HTTPS in production
- Implement authentication for production use

## 📊 Sample Google Sheet Structure

| Task Name | Task Type | Assigned To | Planned Date | Actual Completion Date | Status | Weekly Score |
|-----------|-----------|-------------|--------------|----------------------|--------|--------------|
| Daily standup | Daily | John | 2024-04-28 | | Pending | 0 |
| Code review | Weekly | Sarah | Monday | | Pending | 0 |
| Deploy feature | One-time | John | 2024-04-28 | | Pending | 0 |

## 🚀 Deployment

For production deployment:
1. Use a service like Render, Heroku, or Railway
2. Set environment variables in the platform
3. Use a custom domain
4. Enable HTTPS
5. Add authentication

## 📝 License

ISC

## 👤 Author

Shivani Kinagi
