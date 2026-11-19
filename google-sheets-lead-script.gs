/**
 * Google Apps Script: Lead Capture Webhook for Google Sheets (Package 3)
 * 
 * Instructions to Setup in 2 Minutes:
 * 1. Open Google Sheets (create a new sheet e.g. "Apex Pro Website Leads").
 * 2. In Row 1, add these headers:
 *    [A] Timestamp | [B] Name | [C] Phone | [D] Email | [E] Service | [F] Urgency | [G] Message | [H] Package Tier | [I] Page Source
 * 3. In Google Sheets menu, click: Extensions -> Apps Script.
 * 4. Replace any existing code with this entire script.
 * 5. Click "Deploy" (top right) -> "New deployment".
 * 6. Select type: "Web app".
 * 7. Set:
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (crucial so the website can post leads).
 * 8. Click "Deploy", copy the Web App URL, and paste it into CONFIG.googleSheetWebhookUrl in assets/js/quote-form.js!
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data;

    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'No payload received' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var row = [
      data.timestamp || new Date().toLocaleString(),
      data.name || 'Anonymous',
      data.phone || 'N/A',
      data.email || 'N/A',
      data.service || 'General Inquiry',
      data.urgency || 'Standard',
      data.message || '',
      data.packageTier || 'Package 3 (Pro)',
      data.pageSource || '/'
    ];

    sheet.appendRow(row);

    // Optional: Send instant email notification to business owner
    var ownerEmail = "owner@apexproservices.com"; // Replace with client's email
    if (ownerEmail && ownerEmail.indexOf("apexpro") === -1) {
      var subject = "🚨 New Website Lead: " + data.name + " (" + data.service + ")";
      var body = "You have a new quote request!\n\n" +
                 "Customer: " + data.name + "\n" +
                 "Phone: " + data.phone + "\n" +
                 "Email: " + data.email + "\n" +
                 "Service: " + data.service + "\n" +
                 "Urgency: " + data.urgency + "\n" +
                 "Notes: " + data.message + "\n\n" +
                 "View your Google Sheet for full history.";
      MailApp.sendEmail(ownerEmail, subject, body);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'success', rowAdded: row }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Google Sheets Webhook is ACTIVE and waiting for POST requests.")
    .setMimeType(ContentService.MimeType.TEXT);
}
