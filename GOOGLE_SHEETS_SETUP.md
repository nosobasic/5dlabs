# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration to automatically capture leads from your beat pack landing page.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Beat Pack Leads" or similar
4. Set up columns in row 1:
   - A1: `Timestamp`
   - B1: `First Name`
   - C1: `Last Name`
   - D1: `Email`
   - E1: `Phone`
   - F1: `Source`

## Step 2: Create Google Apps Script

1. In your Google Sheet, go to `Extensions` > `Apps Script`
2. Replace the default code with the following:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSheet();
    
    // Parse the request data
    var data = JSON.parse(e.postData.contents);
    
    // Append the data to the sheet
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.phone || '',
      data.source || 'Beat Pack Landing Page'
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests (for testing)
  return ContentService
    .createTextOutput("Google Sheets API is working!")
    .setMimeType(ContentService.MimeType.TEXT);
}
```

3. Save the script with a name like "Beat Pack Lead Capture"

## Step 3: Deploy the Script

1. Click `Deploy` > `New deployment`
2. Choose type: `Web app`
3. Description: "Beat Pack Lead Capture API"
4. Execute as: `Me`
5. Who has access: `Anyone`
6. Click `Deploy`
7. Copy the Web app URL (you'll need this for your React app)

## Step 4: Update Your React App

1. Open `/src/utils/googleSheets.js`
2. Find the line with `const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'`
3. Replace `YOUR_SCRIPT_ID` with your actual Web app URL

**✅ COMPLETED**: Your deployment ID is: `AKfycbxGUUe2rJZgjGeSJ8QdJbIRV3SG16Ut1vAr0TPGbaL9pcwcSq0Kd-g0q06NdRjS8QRC`
**✅ COMPLETED**: Full Web App URL: `https://script.google.com/macros/s/AKfycbxGUUe2rJZgjGeSJ8QdJbIRV3SG16Ut1vAr0TPGbaL9pcwcSq0Kd-g0q06NdRjS8QRC/exec`

## Step 5: Test the Integration

1. Visit your beat pack landing page at `/beat-pack`
2. Fill out and submit the form
3. Check your Google Sheet to see if the data appears

## Optional Enhancements

### Email Notifications
Add this to your Apps Script to get email notifications for new leads:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.phone || '',
      data.source || 'Beat Pack Landing Page'
    ]);
    
    // Send email notification
    MailApp.sendEmail({
      to: 'your-email@example.com',
      subject: 'New Beat Pack Lead: ' + data.firstName + ' ' + data.lastName,
      body: `New lead captured!
      
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Time: ${new Date().toLocaleString()}

View all leads: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}`
    });
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Auto-responder Email
To send a welcome email to new leads, add this function:

```javascript
function sendWelcomeEmail(email, firstName) {
  try {
    MailApp.sendEmail({
      to: email,
      subject: '🎵 Your Free Beat Pack is Here!',
      htmlBody: `
        <h2>Welcome to 5D Labs, ${firstName}!</h2>
        <p>Thanks for downloading our premium beat pack. Here are some tips to get started:</p>
        <ul>
          <li>All beats are royalty-free for your projects</li>
          <li>Credit "5D Labs" when you release your music</li>
          <li>Tag us @5dlabs on social media</li>
        </ul>
        <p>Need more beats? Check out our premium collections!</p>
        <p>Happy creating!<br>The 5D Labs Team</p>
      `
    });
  } catch (error) {
    console.log('Failed to send welcome email:', error);
  }
}
```

Then call it in your `doPost` function:
```javascript
// After appending to sheet
sendWelcomeEmail(data.email, data.firstName);
```

## Security Notes

- The script URL will be public, but it only accepts POST requests with specific data
- Consider adding validation to prevent spam submissions
- Monitor your Google Sheets for any unusual activity

## Troubleshooting

1. **CORS Issues**: The script uses `mode: 'no-cors'` which means you won't get response data, but the request will still work
2. **Permission Errors**: Make sure the script has permission to access your Google Sheet
3. **Data Not Appearing**: Check the Apps Script logs for any errors

Your Google Sheets integration is now ready to capture leads from your beat pack landing page!
