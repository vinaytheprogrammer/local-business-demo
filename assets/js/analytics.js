/**
 * Google Analytics 4 (GA4) Custom Event Engine
 * Required for Package 2 & Package 3 Deliverables
 */

// Replace with client's real GA4 Measurement ID (e.g. 'G-XXXXXXXXXX')
window.GA4_MEASUREMENT_ID = 'G-DEMOLOCALBIZ';

// Helper function to dispatch Google Analytics events safely
window.trackGA4Event = function(eventName, eventParams = {}) {
  const payload = {
    ...eventParams,
    timestamp: new Date().toISOString(),
    url: window.location.href
  };

  // If gtag is initialized on page
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, payload);
    console.log(`[GA4 Event Dispatched] ${eventName}:`, payload);
  } else {
    console.log(`[GA4 Demo Tracking Mode] Event: "${eventName}"`, payload);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Track all click-to-call phone links
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      window.trackGA4Event('click_to_call', {
        phone_number: link.getAttribute('href'),
        link_location: link.closest('.top-bar') ? 'top_emergency_bar' : 'page_body'
      });
    });
  });

  // Track WhatsApp button clicks
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      window.trackGA4Event('click_whatsapp', {
        destination: link.getAttribute('href')
      });
    });
  });

  // Track Review Links
  document.querySelectorAll('a[href*="review"]').forEach(link => {
    link.addEventListener('click', () => {
      window.trackGA4Event('click_review_link', {
        source: 'review_prompt'
      });
    });
  });
});
