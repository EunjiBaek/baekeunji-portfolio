/* ============================================
   BAEK EUNJI PORTFOLIO - MAIN JAVASCRIPT
   ============================================ */

'use strict';

// ---- TYPING EFFECT ----
const typingTexts = [
  'Frontend Engineer',
  'Next.js Fullstack Developer',
  'CI/CD 자동화 설계자',
  'AI Search 구축자',
  '구조·배포·운영까지 책임지는 개발자',
];

let typingIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingEl = document.getElementById('typingText');

function typeText() {
  if (!typingEl) return;

  const currentText = typingTexts[typingIndex];

  if (!isDeleting) {
    typingEl.textContent = currentText.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentText.length) {
      isDeleting = true;
      setTimeout(typeText, 2000);
      return;
    }
  } else {
    typingEl.textContent = currentText.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      typingIndex = (typingIndex + 1) % typingTexts.length;
      setTimeout(typeText, 400);
      return;
    }
  }

  const speed = isDeleting ? 55 : 90;
  setTimeout(typeText, speed);
}

// ---- NAVBAR: scroll effect & active link ----
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

function handleNavScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

function setActiveNavLink() {
  const scrollY = window.scrollY;
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener(
  'scroll',
  () => {
    handleNavScroll();
    setActiveNavLink();
    revealOnScroll();
  },
  { passive: true },
);

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
  // Prevent body scroll when menu open
  document.body.style.overflow = navLinksEl.classList.contains('open') ? 'hidden' : '';
});

// Close nav on link click (mobile)
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close nav on outside click (mobile)
document.addEventListener('click', (e) => {
  if (
    navLinksEl.classList.contains('open') &&
    !navLinksEl.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ---- REVEAL ON SCROLL (Intersection Observer) ----
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger delay based on siblings
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const index = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${Math.min(index * 80, 400)}ms`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px',
  },
);

function revealOnScroll() {
  // Legacy fallback (if IntersectionObserver didn't catch)
}

revealElements.forEach((el) => revealObserver.observe(el));

// ---- SMOOTH SCROLL for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ---- SKILL TAG hover glow ----
document.querySelectorAll('.skill-tag').forEach((tag) => {
  tag.addEventListener('mouseenter', () => {
    tag.style.transform = 'translateY(-2px) scale(1.05)';
  });
  tag.addEventListener('mouseleave', () => {
    tag.style.transform = '';
  });
});

// ---- HERO PARALLAX on mouse move ----
const heroSection = document.querySelector('.hero');
const particles = document.querySelectorAll('.particle');

if (heroSection) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;

    particles.forEach((p, i) => {
      const depth = (i + 1) * 0.3;
      const moveX = xRatio * depth * 40;
      const moveY = yRatio * depth * 40;
      p.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
    });
  });

  heroSection.addEventListener('mouseleave', () => {
    particles.forEach((p) => {
      p.style.transform = 'translate(-50%, -50%)';
    });
  });
}

// ---- COUNTER ANIMATION for stats ----
function animateCounter(el, target, suffix = '') {
  const duration = 1500;
  const start = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
    const current = Math.floor(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target + suffix;
    }
  }

  requestAnimationFrame(update);
}

// Observe stats section for counter animation
const statsSection = document.querySelector('.hero-stats');
let statsAnimated = false;

if (statsSection) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !statsAnimated) {
        statsAnimated = true;

        const statNums = document.querySelectorAll('.stat-num');
        const targets = [6, 10, 3];
        const suffixes = ['+', '+', ''];

        statNums.forEach((el, i) => {
          if (i < 3) {
            const span = el.querySelector('span');
            const spanText = span ? span.textContent : '';
            const clone = el.cloneNode(false);
            el.parentNode.replaceChild(clone, el);
            clone.textContent = '0';
            if (span) clone.appendChild(span.cloneNode(true));

            // Animate the text node
            const targetVal = targets[i];
            const duration = 1200;
            const startTime = performance.now();

            function update(now) {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(eased * targetVal);
              clone.childNodes[0].textContent = current;
              if (progress < 1) requestAnimationFrame(update);
              else clone.childNodes[0].textContent = targetVal;
            }
            requestAnimationFrame(update);
          }
        });

        statsObserver.disconnect();
      }
    },
    { threshold: 0.5 },
  );

  statsObserver.observe(statsSection);
}

// ---- NAV OVERLAY backdrop for mobile ----
const navOverlay = document.createElement('div');
navOverlay.style.cssText = `
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 998;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(4px);
`;
document.body.appendChild(navOverlay);

function updateOverlay() {
  if (navLinksEl.classList.contains('open')) {
    navOverlay.style.opacity = '1';
    navOverlay.style.pointerEvents = 'auto';
  } else {
    navOverlay.style.opacity = '0';
    navOverlay.style.pointerEvents = 'none';
  }
}

navOverlay.addEventListener('click', () => {
  hamburger.classList.remove('open');
  navLinksEl.classList.remove('open');
  document.body.style.overflow = '';
  updateOverlay();
});

const origHamburgerHandler = hamburger.onclick;
hamburger.addEventListener('click', updateOverlay);
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    setTimeout(updateOverlay, 10);
  });
});

// ---- ADD STAGGER TO SKILL CATEGORIES ----
document.querySelectorAll('.skill-category').forEach((el, i) => {
  el.style.animationDelay = `${i * 0.1}s`;
});

// ---- ACTIVE SECTION HIGHLIGHT for timeline ----
function highlightActiveSection() {
  const scrollY = window.scrollY + window.innerHeight * 0.4;
  document.querySelectorAll('.timeline-item').forEach((item) => {
    const top = item.getBoundingClientRect().top + window.scrollY;
    if (scrollY > top) {
      item.querySelector('.timeline-dot').style.boxShadow =
        '0 0 0 6px rgba(37,99,235,0.3), 0 0 20px rgba(37,99,235,0.5)';
    }
  });
}

window.addEventListener('scroll', highlightActiveSection, { passive: true });

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  // Start typing effect after brief delay
  setTimeout(typeText, 800);

  // Initial scroll state
  handleNavScroll();
  setActiveNavLink();

  // Add entrance animation to hero content elements
  const heroElements = document.querySelectorAll(
    '.hero-badge, .hero-name, .hero-title, .hero-desc, .hero-stats, .hero-cta',
  );
  heroElements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.7s ease ${0.2 + i * 0.12}s, transform 0.7s ease ${0.2 + i * 0.12}s`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });

  // Highlight active initially
  highlightActiveSection();
});
