/**
 * Apex Pro UI & Interactive Animation Engine
 * Includes:
 * 1. Scroll-triggered Animated Counters
 * 2. Instant Problem Diagnostic & Repair Cost Calculator
 * 3. Google Business Profile Interactive Tab Switcher
 * 4. Smooth FAQ Accordion
 * 5. Scroll-Reveal Observer for Smooth Transitions
 * 6. Floating Action Bar & Toast Notifications
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. SCROLL-TRIGGERED ANIMATED COUNTERS
     ========================================================================== */
  const counterElements = document.querySelectorAll('.animate-counter');

  if (counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target') || '0');
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
          const duration = 1600; // ms
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = target * easeOut;

            el.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
            }
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  /* ==========================================================================
     2. INTERACTIVE DIAGNOSTIC & REPAIR COST ESTIMATOR
     ========================================================================== */
  const diagnosticData = {
    'ac-hot': {
      serviceKey: 'HVAC Heating & AC Repair',
      title: 'Air Conditioner Blowing Warm / Room Temp Air',
      badge: 'High Priority (Summer Hazard)',
      estTime: '45 – 90 Minutes',
      estCost: '$89 – $185',
      commonFix: 'Capacitor failure, contactor burnt, or low refrigerant pressure.',
      actionText: 'Book AC Diagnostic ($89 Waived on Repair)'
    },
    'pipe-leak': {
      serviceKey: 'Emergency Plumbing Service',
      title: 'Active Pipe Leak / Under-Sink Flooding',
      badge: 'Emergency Dispatch',
      estTime: '30 – 60 Minutes',
      estCost: '$120 – $220',
      commonFix: 'Failed PEX/copper joint, cracked trap, or loose supply valve.',
      actionText: 'Dispatch Plumber Immediately'
    },
    'breaker-trip': {
      serviceKey: 'Electrical Panel & Wiring',
      title: 'Breaker Tripping Repeatedly or Buzzing Sounds',
      badge: 'Fire Safety Concern',
      estTime: '45 – 75 Minutes',
      estCost: '$140 – $260',
      commonFix: 'Overloaded circuit, faulty breaker bus bar, or ground fault.',
      actionText: 'Book Master Electrician'
    },
    'furnace-cold': {
      serviceKey: 'HVAC Heating & AC Repair',
      title: 'Furnace Blowing Cold Air / Igniter Clicking',
      badge: 'Winter Priority',
      estTime: '60 – 90 Minutes',
      estCost: '$99 – $240',
      commonFix: 'Dirty flame sensor, cracked hot-surface igniter, or safety switch lockout.',
      actionText: 'Book Heating Specialist'
    },
    'ev-charger': {
      serviceKey: 'Complete System Installation',
      title: 'Level 2 EV Charger / 240V Circuit Installation',
      badge: 'Home Energy Upgrade',
      estTime: '2 – 3 Hours',
      estCost: '$499 – $799',
      commonFix: 'Dedicated 50A breaker, heavy-gauge copper run, and NEMA 14-50 outlet.',
      actionText: 'Schedule EV Installation'
    }
  };

  const diagnosticButtons = document.querySelectorAll('.diagnostic-btn');
  const diagTitle = document.getElementById('diag-title');
  const diagBadge = document.getElementById('diag-badge');
  const diagTime = document.getElementById('diag-time');
  const diagCost = document.getElementById('diag-cost');
  const diagFix = document.getElementById('diag-fix');
  const diagApplyBtn = document.getElementById('diag-apply-btn');

  if (diagnosticButtons.length > 0 && diagTitle) {
    diagnosticButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        diagnosticButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const key = btn.getAttribute('data-diag-key');
        const data = diagnosticData[key];
        if (!data) return;

        // Animate card content switch
        const cardBox = document.getElementById('diag-result-card');
        if (cardBox) {
          cardBox.classList.remove('fade-in');
          void cardBox.offsetWidth; // Trigger reflow
          cardBox.classList.add('fade-in');
        }

        diagTitle.textContent = data.title;
        if (diagBadge) diagBadge.textContent = data.badge;
        if (diagTime) diagTime.textContent = data.estTime;
        if (diagCost) diagCost.textContent = data.estCost;
        if (diagFix) diagFix.textContent = data.commonFix;
        if (diagApplyBtn) {
          diagApplyBtn.textContent = data.actionText + ' →';
          diagApplyBtn.setAttribute('data-target-service', data.serviceKey);
        }
      });
    });

    if (diagApplyBtn) {
      diagApplyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetService = diagApplyBtn.getAttribute('data-target-service');
        const quoteSelect = document.getElementById('lead-service');
        const quoteSection = document.getElementById('quote-section');

        if (quoteSelect && targetService) {
          quoteSelect.value = targetService;
        }

        if (quoteSection) {
          quoteSection.scrollIntoView({ behavior: 'smooth' });
          quoteSection.classList.add('highlight-pulse');
          setTimeout(() => quoteSection.classList.remove('highlight-pulse'), 1800);
        }

        showToast(`Selected "${targetService}". Details loaded into quote form!`);
      });
    }
  }

  /* ==========================================================================
     3. GOOGLE BUSINESS PROFILE (GBP) INTERACTIVE TABS
     ========================================================================== */
  const gbpTabs = document.querySelectorAll('.gbp-nav-tab');
  const gbpPanels = document.querySelectorAll('.gbp-tab-panel');

  if (gbpTabs.length > 0) {
    gbpTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        gbpTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const targetPanelId = tab.getAttribute('data-panel');
        gbpPanels.forEach(panel => {
          if (panel.id === targetPanelId) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });
  }

  /* ==========================================================================
     4. FAQ ACCORDION WITH ANIMATED CHEVRON
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const questionBtn = item.querySelector('.faq-question');
      if (questionBtn) {
        questionBtn.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');

          // Close all others
          faqItems.forEach(other => {
            other.classList.remove('open');
            const otherAnswer = other.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          });

          // Toggle current
          if (!isOpen) {
            item.classList.add('open');
            const answer = item.querySelector('.faq-answer');
            if (answer) {
              answer.style.maxHeight = answer.scrollHeight + 'px';
            }
          }
        });
      }
    });
  }

  /* ==========================================================================
     5. SCROLL REVEAL OBSERVER
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ==========================================================================
     6. TOAST NOTIFICATION UTILITY
     ========================================================================== */
  window.showToast = function(message) {
    let toast = document.getElementById('apex-global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'apex-global-toast';
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  };

  /* ==========================================================================
     7. FLOATING QUICK ACTION BAR (MOBILE CONVERSIONS)
     ========================================================================== */
  const floatingBar = document.querySelector('.floating-mobile-bar');
  if (floatingBar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        floatingBar.classList.add('visible');
      } else {
        floatingBar.classList.remove('visible');
      }
    });
  }
});
