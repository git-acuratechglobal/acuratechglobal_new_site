/**
 * AcuraTech Global — main.js
 * Production-quality vanilla JS (ES6+)
 * No jQuery, no frameworks.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
   * 1. STICKY NAVBAR
   * Adds `.scrolled` to #navbar after 80px scroll
   * (CSS handles the glass-blur effect via the class)
   * ========================================================= */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleNavbarScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 80);
    };
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll(); // run on load in case page is already scrolled
  }


  /* =========================================================
   * 2. MOBILE MENU TOGGLE
   * Toggles `.open` on #mobile-menu when #menu-btn is clicked.
   * Closes menu on outside click.
   * ========================================================= */
  const menuBtn    = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileMenu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        mobileMenu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close mobile menu when a nav link inside it is clicked
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* =========================================================
   * 3. SMOOTH SCROLLING
   * Intercepts all anchor links starting with `#` and scrolls
   * smoothly to the target element.
   * ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return; // skip bare # links

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* =========================================================
   * 4. ANIMATED COUNTERS
   * Watches `.stat-number` elements; on first viewport entry
   * animates from 0 → data-target over 2 seconds with easing.
   * Formats: adds `+` suffix; uses `K` for thousands.
   * ========================================================= */
  const formatCount = (value) => {
    if (value >= 1000) return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K+`;
    return `${value}+`;
  };

  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 2000; // ms
    let   startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutQuart(progress);
      const current  = Math.round(eased * target);

      el.textContent = formatCount(current);

      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = formatCount(target);
    };

    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number[data-target]').forEach((el) => {
    el.textContent = '0+';
    counterObserver.observe(el);
  });


  /* =========================================================
   * 5. SCROLL ANIMATIONS
   * IntersectionObserver adds `.animated` to `.animate-on-scroll`
   * elements as they enter the viewport.
   * Parents with `.stagger-children` get staggered delay on kids.
   * ========================================================= */
  const scrollAnimObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('animated');

        // Stagger direct children if parent has .stagger-children
        if (el.classList.contains('stagger-children')) {
          Array.from(el.children).forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.1}s`;
            child.classList.add('animated');
          });
        }

        scrollAnimObserver.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    scrollAnimObserver.observe(el);
  });


  /* =========================================================
   * 6. TESTIMONIALS CAROUSEL
   * Auto-advances every 4s. Supports prev/next buttons and
   * dot indicators. Pauses on hover.
   * ========================================================= */
  const carousel = document.querySelector('.testimonials-carousel, [data-carousel="testimonials"]');
  if (carousel) {
    const cards     = Array.from(carousel.querySelectorAll('.testimonial-card'));
    const prevBtn   = carousel.querySelector('.prev-btn') || document.querySelector('.prev-btn');
    const nextBtn   = carousel.querySelector('.next-btn') || document.querySelector('.next-btn');
    const dotsWrap  = carousel.querySelector('.dots-wrapper, .dots') || document.querySelector('.dots-wrapper');
    let   current   = 0;
    let   autoTimer = null;

    // Build dot indicators if wrapper exists
    let dots = [];
    if (dotsWrap && cards.length) {
      dotsWrap.innerHTML = '';
      dots = cards.map((_, i) => {
        const dot = document.createElement('button');
        dot.className   = 'dot';
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
        return dot;
      });
    } else {
      dots = Array.from(document.querySelectorAll('.dot'));
      dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
    }

    const goTo = (index) => {
      cards[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');

      current = (index + cards.length) % cards.length;

      cards[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    };

    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);

    const startAuto = () => {
      stopAuto();
      autoTimer = setInterval(next, 4000);
    };
    const stopAuto = () => clearInterval(autoTimer);

    if (cards.length) {
      goTo(0);
      startAuto();
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });

    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);
  }


  /* =========================================================
   * 7. SERVICES TABS
   * `.service-tab` buttons show/hide corresponding
   * `.service-panel` elements.
   * ========================================================= */
  const serviceTabs   = document.querySelectorAll('.service-tab');
  const servicePanels = document.querySelectorAll('.service-panel');

  if (serviceTabs.length && servicePanels.length) {
    serviceTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetPanel = tab.dataset.tab || tab.dataset.target;

        serviceTabs.forEach((t) => t.classList.remove('active'));
        servicePanels.forEach((p) => p.classList.remove('active'));

        tab.classList.add('active');

        const panel = targetPanel
          ? document.querySelector(`[data-panel="${targetPanel}"], #${targetPanel}`)
          : null;
        if (panel) panel.classList.add('active');
      });
    });

    // Activate first tab by default if none active
    if (!document.querySelector('.service-tab.active')) {
      serviceTabs[0].click();
    }
  }


  /* =========================================================
   * 8. PORTFOLIO FILTER
   * `.filter-btn[data-filter]` show/hide `.portfolio-item`
   * elements by their `data-category` attribute.
   * ========================================================= */
  const filterBtns      = document.querySelectorAll('.filter-btn[data-filter]');
  const portfolioItems  = document.querySelectorAll('.portfolio-item[data-category]');

  if (filterBtns.length && portfolioItems.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        portfolioItems.forEach((item) => {
          const match = filter === 'all' || item.dataset.category === filter;

          if (match) {
            item.style.opacity    = '0';
            item.style.display    = 'block';
            // Force reflow for transition
            void item.offsetWidth;
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity    = '1';
            item.style.transform  = 'scale(1)';
          } else {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity    = '0';
            item.style.transform  = 'scale(0.95)';
            setTimeout(() => {
              if (item.style.opacity === '0') item.style.display = 'none';
            }, 400);
          }
        });
      });
    });

    // Activate 'all' filter by default
    const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if (allBtn) allBtn.click();
  }


  /* =========================================================
   * 9. CONTACT FORM VALIDATION
   * Validates #contact-form fields; shows inline errors.
   * On success shows `.form-success` and resets form.
   * Prevents actual submission (no backend).
   * ========================================================= */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const showError = (field, msg) => {
      clearError(field);
      field.classList.add('error');
      const span = document.createElement('span');
      span.className     = 'field-error';
      span.textContent   = msg;
      span.style.cssText = 'color:#ef4444;font-size:0.8rem;display:block;margin-top:4px;';
      field.insertAdjacentElement('afterend', span);
    };

    const clearError = (field) => {
      field.classList.remove('error');
      const next = field.nextElementSibling;
      if (next && next.classList.contains('field-error')) next.remove();
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const nameField    = contactForm.querySelector('[name="name"], #name');
      const emailField   = contactForm.querySelector('[name="email"], #email');
      const messageField = contactForm.querySelector('[name="message"], #message');

      // Clear previous errors
      [nameField, emailField, messageField].forEach((f) => f && clearError(f));

      // Name validation
      if (nameField) {
        if (!nameField.value.trim() || nameField.value.trim().length < 2) {
          showError(nameField, 'Name must be at least 2 characters.');
          valid = false;
        }
      }

      // Email validation
      if (emailField) {
        if (!emailRegex.test(emailField.value.trim())) {
          showError(emailField, 'Please enter a valid email address.');
          valid = false;
        }
      }

      // Message validation
      if (messageField) {
        if (!messageField.value.trim() || messageField.value.trim().length < 10) {
          showError(messageField, 'Message must be at least 10 characters.');
          valid = false;
        }
      }

      if (valid) {
        // Show success message
        const successDiv = document.querySelector('.form-success');
        if (successDiv) {
          successDiv.style.display = 'block';
          successDiv.style.opacity = '0';
          void successDiv.offsetWidth;
          successDiv.style.transition = 'opacity 0.5s ease';
          successDiv.style.opacity    = '1';
        }
        contactForm.reset();

        // Hide success after 5 seconds
        setTimeout(() => {
          if (successDiv) {
            successDiv.style.opacity = '0';
            setTimeout(() => { successDiv.style.display = 'none'; }, 500);
          }
        }, 5000);
      }
    });

    // Live clear errors on input
    contactForm.querySelectorAll('input, textarea').forEach((field) => {
      field.addEventListener('input', () => clearError(field));
    });
  }


  /* =========================================================
   * 10. ACTIVE NAV LINK
   * Highlights the current page's nav link by comparing
   * window.location.pathname to each link's href.
   * ========================================================= */
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('nav a[href], #navbar a[href]').forEach((link) => {
    const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, '') || '/';
    if (linkPath === currentPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });


  /* =========================================================
   * 11. BACK TO TOP BUTTON
   * #back-to-top appears after 300px scroll;
   * smooth scrolls to top on click.
   * ========================================================= */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle('visible', window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* =========================================================
   * 12. TECH STACK MARQUEE
   * Doubles the content inside `.marquee-track` to create a
   * seamless infinite scroll (CSS handles the animation).
   * ========================================================= */
  document.querySelectorAll('.marquee-track').forEach((track) => {
    const originalChildren = Array.from(track.children);
    // Clone each child and append to create a seamless loop
    originalChildren.forEach((child) => {
      const clone = child.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  });


  /* =========================================================
   * 13. TYPING EFFECT (TYPEWRITER)
   * Types out the hero headline tagline character by character.
   * Targets the first element with [data-typewriter] or
   * .hero-tagline / .typewriter — configure the text in HTML
   * via data-typewriter="Your Text Here".
   * ========================================================= */
  const typewriterEl = document.querySelector('[data-typewriter], .hero-tagline, .typewriter');
  if (typewriterEl) {
    const fullText    = typewriterEl.dataset.typewriter || typewriterEl.textContent.trim();
    const typingSpeed = 55; // ms per character
    const startDelay  = 500; // ms delay before typing begins

    typewriterEl.textContent = '';
    typewriterEl.style.visibility = 'visible';

    // Add blinking cursor via CSS class
    typewriterEl.classList.add('typewriter-active');

    let charIndex = 0;

    const type = () => {
      if (charIndex < fullText.length) {
        typewriterEl.textContent += fullText[charIndex];
        charIndex++;
        setTimeout(type, typingSpeed);
      } else {
        // Remove cursor blink after typing done (optional: keep it)
        setTimeout(() => typewriterEl.classList.remove('typewriter-active'), 1500);
      }
    };

    setTimeout(type, startDelay);
  }


  /* =========================================================
   * 14. PAGE LOADER
   * Fades out and hides #page-loader after the window loads.
   * ========================================================= */
  const pageLoader = document.getElementById('page-loader');
  if (pageLoader) {
    const hideLoader = () => {
      pageLoader.style.transition = 'opacity 0.6s ease';
      pageLoader.style.opacity    = '0';
      setTimeout(() => {
        pageLoader.style.display = 'none';
        pageLoader.setAttribute('aria-hidden', 'true');
      }, 600);
    };

    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader);
    }
  }


  /* =========================================================
   * 15. SCROLL PROGRESS BAR
   * Updates the width of #scroll-progress as the user scrolls.
   * ========================================================= */
  const scrollProgress = document.getElementById('scroll-progress');
  if (scrollProgress) {
    const updateProgress = () => {
      const scrollTop    = window.scrollY;
      const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
      const progress     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = `${progress}%`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress(); // set on initial load
  }

}); // end DOMContentLoaded
