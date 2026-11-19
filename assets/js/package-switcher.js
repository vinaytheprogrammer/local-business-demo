/**
 * Interactive Package Tier Switcher for Client Review & Demos
 * Lets prospective clients toggle between Starter, Growth, and Pro tiers
 */

window.currentActivePackage = 'Package 3: Pro';

document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.demo-tab-btn');
  const demoBannerDesc = document.getElementById('demo-tier-description');

  const TIER_INFO = {
    'pkg-1': {
      name: 'Package 1: Starter (₹ / $ Demo)',
      tagline: '1–3 Page Mobile Website + Basic GBP Setup + GSC + Email Quote Form (5 Days)',
      badgeClass: 'pkg-1',
      allowedBadges: ['.pkg-1']
    },
    'pkg-2': {
      name: 'Package 2: Growth',
      tagline: '4–5 Static Pages + Full GBP (Q&A, Posts) + GA4 Analytics + On-Page SEO (7 Days)',
      badgeClass: 'pkg-2',
      allowedBadges: ['.pkg-1', '.pkg-2']
    },
    'pkg-3': {
      name: 'Package 3: Pro (Recommended)',
      tagline: 'All in Growth + 2 Landing Pages + Google Review QR + 3 Citations + Sheets/WhatsApp Leads (10 Days)',
      badgeClass: 'pkg-3',
      allowedBadges: ['.pkg-1', '.pkg-2', '.pkg-3']
    },
    'all': {
      name: 'Full Showcase (All Packages Active)',
      tagline: 'Exploring all components across Starter, Growth, and Pro packages',
      badgeClass: 'all',
      allowedBadges: ['.pkg-1', '.pkg-2', '.pkg-3']
    }
  };

  function applyTier(tierKey) {
    const tier = TIER_INFO[tierKey] || TIER_INFO['pkg-3'];
    window.currentActivePackage = tier.name;

    // Update active tab styles
    tabButtons.forEach(btn => {
      if (btn.getAttribute('data-tier') === tierKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update description in demo bar if present
    if (demoBannerDesc) {
      demoBannerDesc.innerHTML = `<strong>Active Preview:</strong> ${tier.tagline}`;
    }

    // Toggle opacity or badges on elements across the page
    document.querySelectorAll('[data-pkg]').forEach(el => {
      const elPkg = el.getAttribute('data-pkg');
      if (tierKey === 'all') {
        el.style.opacity = '1';
        el.style.filter = 'none';
      } else if (tierKey === 'pkg-1') {
        if (elPkg === 'pkg-1') {
          el.style.opacity = '1';
          el.style.filter = 'none';
        } else {
          el.style.opacity = '0.35';
          el.style.filter = 'grayscale(0.6)';
        }
      } else if (tierKey === 'pkg-2') {
        if (elPkg === 'pkg-1' || elPkg === 'pkg-2') {
          el.style.opacity = '1';
          el.style.filter = 'none';
        } else {
          el.style.opacity = '0.35';
          el.style.filter = 'grayscale(0.6)';
        }
      } else {
        // pkg-3 includes all
        el.style.opacity = '1';
        el.style.filter = 'none';
      }
    });

    console.log(`[Package Switcher] Active view set to: ${tier.name}`);
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedTier = btn.getAttribute('data-tier');
      applyTier(selectedTier);
    });
  });

  // Mobile menu toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isVisible = window.getComputedStyle(navMenu).display !== 'none';
      navMenu.style.display = isVisible ? 'none' : 'flex';
      navMenu.style.flexDirection = 'column';
      navMenu.style.position = 'absolute';
      navMenu.style.top = '100%';
      navMenu.style.left = '0';
      navMenu.style.right = '0';
      navMenu.style.background = '#ffffff';
      navMenu.style.padding = '20px';
      navMenu.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
    });
  }

  // Set default to Pro Showcase
  applyTier('pkg-3');
});
