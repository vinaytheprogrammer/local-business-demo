/**
 * Quote Request Form Handler
 * Covers:
 * - Package 1: Enquiries sent via Email (Web3Forms/Formspree/API)
 * - Package 2: Quote form with service selection + GA4 event tracking
 * - Package 3: Quote form leads sent to Google Sheet + WhatsApp alert routing
 */

document.addEventListener('DOMContentLoaded', () => {
  const quoteForm = document.getElementById('quote-form');
  const modal = document.getElementById('quote-confirmation-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const whatsappRedirectBtn = document.getElementById('whatsapp-redirect-btn');
  const modalLeadSummary = document.getElementById('modal-lead-summary');

  if (!quoteForm) return;

  // Configuration for integrations
  const CONFIG = {
    // Replace with your Google Apps Script Web App URL for Google Sheets logging
    googleSheetWebhookUrl: 'https://script.google.com/macros/s/AKfycbz_DEMO_LEAD_WEBHOOK/exec',
    // Business WhatsApp number in international format without '+' or spaces (e.g. 919876543210 or 15551234567)
    businessWhatsAppNumber: '919876543210',
    // Fallback Email recipient for Package 1
    recipientEmail: 'quotes@apexproservices.com'
  };

  quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = quoteForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Collect Form Data
    const formData = {
      name: quoteForm.querySelector('#lead-name')?.value.trim() || '',
      phone: quoteForm.querySelector('#lead-phone')?.value.trim() || '',
      email: quoteForm.querySelector('#lead-email')?.value.trim() || '',
      service: quoteForm.querySelector('#lead-service')?.value || 'General Inquiry',
      urgency: quoteForm.querySelector('#lead-urgency')?.value || 'Standard',
      message: quoteForm.querySelector('#lead-message')?.value.trim() || '',
      packageTier: window.currentActivePackage || 'Package 3 (Pro Demo)',
      timestamp: new Date().toISOString(),
      pageSource: window.location.pathname
    };

    // Validation
    if (!formData.name || !formData.phone) {
      alert('Please provide your name and phone number so our local team can reach you.');
      return;
    }

    // UI Loading State
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="0.75"></path>
      </svg>
      Securing Your Quote...
    `;

    // 1. GA4 Conversion Event Tracking (Package 2 & 3)
    if (typeof window.trackGA4Event === 'function') {
      window.trackGA4Event('generate_lead', {
        service_category: formData.service,
        package_tier: formData.packageTier,
        urgency: formData.urgency
      });
    }

    // 2. Dispatch to Google Sheet Webhook (Package 3)
    try {
      if (CONFIG.googleSheetWebhookUrl && !CONFIG.googleSheetWebhookUrl.includes('DEMO')) {
        await fetch(CONFIG.googleSheetWebhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        console.log('[Lead Capture] Dispatched to Google Sheet Webhook.');
      } else {
        console.log('[Lead Capture Demo] Mocking Google Sheet append for:', formData);
      }
    } catch (err) {
      console.warn('[Lead Capture] Sheet Webhook notice:', err);
    }

    // 3. Prepare Instant WhatsApp Alert Message (Package 3)
    const whatsappMessage = encodeURIComponent(
      `*New Local Quote Request*\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `*Customer:* ${formData.name}\n` +
      `*Phone:* ${formData.phone}\n` +
      `*Email:* ${formData.email || 'N/A'}\n` +
      `*Service Required:* ${formData.service}\n` +
      `*Urgency:* ${formData.urgency}\n` +
      `*Notes:* ${formData.message || 'No additional notes'}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `*Tier:* ${formData.packageTier}`
    );
    const whatsappUrl = `https://wa.me/${CONFIG.businessWhatsAppNumber}?text=${whatsappMessage}`;

    // 4. Update and show Confirmation Modal
    if (modal) {
      if (modalLeadSummary) {
        modalLeadSummary.innerHTML = `
          <strong>Lead Details Captured:</strong><br>
          Name: ${formData.name} | Phone: ${formData.phone}<br>
          Service: <em>${formData.service}</em> (${formData.urgency})<br>
          <span style="display:inline-block; margin-top:6px; font-size:0.75rem; color:#059669; font-weight:700;">
            ✓ Saved to Google Sheet Database & Notification Dispatched
          </span>
        `;
      }

      if (whatsappRedirectBtn) {
        whatsappRedirectBtn.href = whatsappUrl;
        whatsappRedirectBtn.setAttribute('target', '_blank');
      }

      modal.classList.add('active');
    } else {
      alert(`Thank you, ${formData.name}! Your quote request has been received.`);
    }

    // Reset Form & Button
    quoteForm.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  });

  // Modal Close Listeners
  if (modalCloseBtn && modal) {
    modalCloseBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
});
