/**
 * Google Review Collection & Dynamic QR Code Engine (Package 3 Feature)
 * Includes Sentiment Filter (4-5★ -> Google Reviews; 1-3★ -> Private Feedback)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const qrContainer = document.getElementById('qr-code-display');
  const reviewUrlInput = document.getElementById('google-review-url-input');
  const updateQrBtn = document.getElementById('update-qr-btn');
  const printQrBtn = document.getElementById('print-qr-btn');
  const starButtons = document.querySelectorAll('.star-rating-btn');
  const ratingFeedbackArea = document.getElementById('rating-sentiment-feedback');

  // Default demo Google Review Place URL
  const defaultReviewUrl = 'https://g.page/r/demo-apex-local/review';

  /**
   * Generates a fast, zero-dependency SVG QR Code using QRCode API or SVG generator
   */
  function renderQrCode(url) {
    if (!qrContainer) return;

    // Use reliable Google Chart or QuickChart SVG for high-resolution print ready QR
    const encodedUrl = encodeURIComponent(url);
    const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}&format=svg`;

    qrContainer.innerHTML = `
      <img src="${qrImageSrc}" alt="Scan to Leave a 5-Star Google Review" width="180" height="180" style="display:block; margin:0 auto; border-radius:8px;">
    `;
  }

  // Initial QR render
  renderQrCode(defaultReviewUrl);

  // Allow custom URL in demo
  if (updateQrBtn && reviewUrlInput) {
    updateQrBtn.addEventListener('click', () => {
      const customUrl = reviewUrlInput.value.trim() || defaultReviewUrl;
      renderQrCode(customUrl);
      alert('QR Code updated for: ' + customUrl);
    });
  }

  // Print flyer action
  if (printQrBtn) {
    printQrBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Sentiment Filter logic (Review Gate)
  if (starButtons && ratingFeedbackArea) {
    starButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const rating = parseInt(btn.getAttribute('data-rating') || '5', 10);
        
        // Highlight active stars
        starButtons.forEach((b, idx) => {
          if (idx < rating) {
            b.style.color = '#f59e0b';
          } else {
            b.style.color = '#cbd5e1';
          }
        });

        if (rating >= 4) {
          // Positive Review: Direct to Google Maps Review
          ratingFeedbackArea.innerHTML = `
            <div style="background:#ecfdf5; border:1px solid #a7f3d0; padding:16px; border-radius:8px; margin-top:16px; text-align:center;">
              <h4 style="color:#065f46; font-size:1.1rem; margin-bottom:6px;">Thank You for the ${rating}-Star Rating! 🎉</h4>
              <p style="color:#047857; font-size:0.9rem; margin-bottom:12px;">
                As a local family-owned business, your Google review makes a massive difference to our reputation.
              </p>
              <a href="${defaultReviewUrl}" target="_blank" rel="noopener noreferrer" 
                 style="background:#1a73e8; color:#fff; text-decoration:none; padding:10px 20px; border-radius:6px; font-weight:700; display:inline-flex; align-items:center; gap:8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
                Post Review on Google Maps
              </a>
            </div>
          `;
        } else {
          // Sub-optimal review: Intercept privately to protect public rating
          ratingFeedbackArea.innerHTML = `
            <div style="background:#fffbeb; border:1px solid #fde68a; padding:16px; border-radius:8px; margin-top:16px; text-align:left;">
              <h4 style="color:#92400e; font-size:1rem; margin-bottom:6px;">We Strive for 100% Satisfaction</h4>
              <p style="color:#b45309; font-size:0.85rem; margin-bottom:12px;">
                We're truly sorry we fell short. Please let the owner know directly so we can make this right immediately:
              </p>
              <textarea placeholder="Tell our owner what happened..." style="width:100%; border:1px solid #fcd34d; border-radius:6px; padding:8px; font-size:0.85rem; min-height:70px;"></textarea>
              <button type="button" onclick="alert('Thank you. The owner has been notified privately.')" style="margin-top:8px; background:#d97706; color:#fff; border:none; padding:8px 16px; border-radius:6px; font-weight:700; cursor:pointer;">
                Send Direct to Owner
              </button>
            </div>
          `;
        }
      });
    });
  }
});
