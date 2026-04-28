# Google Sheets Setup Guide

## Step 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "SVM Task Management"
4. Rename the first sheet tab to "Tasks"

## Step 2: Set Up Columns

Add these headers in Row 1:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Task Name | Task Type | Assigned To | Planned Date | Actual Completion Date | Status | Weekly Score |

## Step 3: Add Sample Data

Add some sample tasks (Row 2 onwards):

```
Daily standup          | Daily    | John  | 2024-04-28 |  | Pending | 0
Weekly team meeting    | Weekly   | Sarah | Monday     |  | Pending | 0
Deploy new feature     | One-time | John  | 2024-04-28 |  | Pending | 0
Code review            | Daily    | Sarah | 2024-04-28 |  | Pending | 0
Client presentation    | One-time | Mike  | 2024-04-29 |  | Pending | 0
```

## Step 4: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Name it "SVM Task Manager"

## Step 5: Enable Google Sheets API

1. In Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

## Step 6: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Name: "svm-task-manager"
4. Click "Create and Continue"
5. Skip optional steps, click "Done"

## Step 7: Create Service Account Key

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Click "Create" - a JSON file will download

## Step 8: Share Google Sheet

1. Open your Google Sheet
2. Click "Share" button (top right)
3. Copy the service account email from the JSON file (looks like: `svm-task-manager@project-id.iam.gserviceaccount.com`)
4. Paste it in the share dialog
5. Give "Editor" access
6. Uncheck "Notify people"
7. Click "Share"

## Step 9: Get Sheet ID

From your Google Sheet URL:
```
https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
```

Copy the `SHEET_ID_HERE` part.

## Step 10: Configure .env File

Open the downloaded JSON file and extract:
- `client_email` → GOOGLE_SERVICE_ACCOUNT_EMAIL
- `private_key` → GOOGLE_PRIVATE_KEY

Your `.env` should look like:

```env
PORT=3000

GOOGLE_SHEET_ID=1abc123def456ghi789jkl
GOOGLE_SERVICE_ACCOUNT_EMAIL=svm-task-manager@project-123.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

ANTHROPIC_API_KEY=sk-ant-api03-...
```

**Important**: Keep the quotes around the private key and preserve the `\n` characters.

## Step 11: Test Connection

Run your server:
```bash
npm start
```

Visit `http://localhost:3000` and check if team members load.

## Troubleshooting

### "Error: No access to sheet"
- Make sure you shared the sheet with the service account email
- Check that you gave "Editor" access

### "Error: Invalid credentials"
- Verify the private key is correctly formatted in .env
- Make sure there are no extra spaces
- Keep the `\n` characters in the private key

### "Error: Sheet not found"
- Check the GOOGLE_SHEET_ID is correct
- Make sure the sheet tab is named "Tasks"

### "Error: Permission denied"
- Ensure Google Sheets API is enabled in Google Cloud Console
- Check service account has proper permissions

## Sheet Structure Notes

- **Task Type**: Must be exactly "Daily", "Weekly", or "One-time"
- **Planned Date**: 
  - Daily: Any date (YYYY-MM-DD)
  - Weekly: Day name (Monday, Tuesday, etc.)
  - One-time: Specific date (YYYY-MM-DD)
- **Status**: "Pending" or "Done"
- **Actual Completion Date**: Auto-filled by the app
- **Weekly Score**: Can be calculated by Claude AI

## Making Your Sheet Public (Optional)

If you want to share the sheet link:
1. Click "Share" > "Change to anyone with the link"
2. Set to "Viewer" (not Editor)
3. Copy the link

This allows others to view but not edit directly.
