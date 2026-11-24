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
   * 1B. HERO 3D LUMINOUS CYBER-WAVE & NEURAL VISUAL ENGINE
   * 60fps high-DPI procedural 3D wave ribbons and glowing particles
   * Continuously flowing, breathing, and reacting every second
   * ========================================================= */
  const canvas = document.getElementById('hero-motion-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0, dpr = 1;
    let time = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = canvas.parentElement || document.getElementById('hero');
      width = parent ? parent.offsetWidth : window.innerWidth;
      height = parent ? parent.offsetHeight : window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      if (e.clientY <= rect.bottom) {
        mouse.tx = (e.clientX / width - 0.5) * 2;
        mouse.ty = (e.clientY / height - 0.5) * 2;
      }
    }, { passive: true });

    // Floating ambient cyber particles
    const numParticles = 40;
    const particles = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.45,
        speedY: (Math.random() - 0.5) * 0.45,
        alpha: Math.random() * 0.55 + 0.25,
        hue: Math.random() > 0.5 ? 215 : 185
      });
    }

    // Grid configuration for 3D flowing cyber-ribbons
    const rows = 24;
    const cols = 36;
    const fov = 420;

    const render = () => {
      time += 0.018;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw floating ambient particles on right half
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < width * 0.35) p.x = width;
        if (p.x > width) p.x = width * 0.35;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const fade = Math.min(1, Math.max(0, (p.x - width * 0.3) / (width * 0.35)));
        ctx.fillStyle = `hsla(${p.hue}, 95%, 65%, ${p.alpha * fade})`;
        ctx.fill();
      }

      // 2. Draw 3D flowing wave ribbons
      const originX = width * 0.68 + mouse.x * 45;
      const originY = height * 0.52 + mouse.y * 30;

      for (let r = 0; r < rows; r++) {
        const z = (r / rows) * 550 - 80;
        const scale = fov / (fov + z);
        const yOffset = (r - rows / 2) * 13;

        ctx.beginPath();
        let started = false;

        for (let c = 0; c < cols; c++) {
          const u = (c / (cols - 1)) - 0.5;
          const x3d = u * 980;

          // Harmonic wave equation creating organic continuous silk movement
          const wave = Math.sin(u * 5 + time + r * 0.22) * 55 +
                       Math.cos(u * 8 - time * 1.2 + r * 0.15) * 35 +
                       Math.sin(time * 1.5 + u * 3) * 20;

          const y3d = yOffset + wave;

          const screenX = originX + x3d * scale;
          const screenY = originY + y3d * scale;

          if (!started) {
            ctx.moveTo(screenX, screenY);
            started = true;
          } else {
            ctx.lineTo(screenX, screenY);
          }
        }

        const depthRatio = r / rows;
        const alpha = Math.max(0.08, (1 - depthRatio * 0.72) * 0.88);

        // Gradient stroke: electric blue -> cyan -> violet
        const grad = ctx.createLinearGradient(originX - 420 * scale, 0, originX + 480 * scale, 0);
        grad.addColorStop(0, `rgba(39, 82, 255, 0)`);
        grad.addColorStop(0.35, `rgba(39, 82, 255, ${alpha * 0.6})`);
        grad.addColorStop(0.7, `rgba(0, 245, 255, ${alpha})`);
        grad.addColorStop(1, `rgba(168, 85, 247, ${alpha * 0.8})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.max(1, (1 - depthRatio * 0.6) * 2.2);
        ctx.stroke();

        // Glowing crest points at select peaks
        if (r % 3 === 0) {
          const crestCol = Math.floor((Math.sin(time * 0.8 + r) * 0.5 + 0.5) * (cols - 8)) + 4;
          const u = (crestCol / (cols - 1)) - 0.5;
          const x3d = u * 980;
          const wave = Math.sin(u * 5 + time + r * 0.22) * 55 +
                       Math.cos(u * 8 - time * 1.2 + r * 0.15) * 35 +
                       Math.sin(time * 1.5 + u * 3) * 20;
          const screenX = originX + x3d * scale;
          const screenY = originY + (yOffset + wave) * scale;

          if (screenX > width * 0.38) {
            ctx.beginPath();
            ctx.arc(screenX, screenY, Math.max(1.5, 3.2 * scale), 0, Math.PI * 2);
            ctx.fillStyle = '#00f5ff';
            ctx.shadowColor = '#00f5ff';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      requestAnimationFrame(render);
    };

    render();
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
   * 3. SMOOTH SCROLLING & "START A CONVERSATION" ON-TAP
   * Intercepts all anchor links starting with `#` and scrolls
   * smoothly to the target element.
   * Special behavior for #start-conversation: smooth scroll,
   * pulses consultation card, and auto-focuses first input.
   * ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return; // skip bare # links

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight + 24 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });

        // If target is start-conversation, focus input and pulse card
        if (targetId === '#start-conversation' || targetId === '#cta-strip') {
          setTimeout(() => {
            const card = target.querySelector('.cb-floating-card');
            const nameInput = target.querySelector('#cb-name') || target.querySelector('input');
            if (card) {
              card.classList.remove('cb-card-pulse');
              void card.offsetWidth; // trigger reflow
              card.classList.add('cb-card-pulse');
            }
            if (nameInput) {
              nameInput.focus({ preventScroll: true });
            }
          }, 600);
        }
      }
    });
  });

  /* =========================================================
   * 3B. CONVERSATION BANNER FORM HANDLER (LIVE EMAIL DISPATCH)
   * Dispatches live emails to naveenbhobhrea4@gmail.com & info@acuratechglobal.com
   * ========================================================= */
  const cbForm = document.querySelector('.cb-form');
  if (cbForm) {
    cbForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = (document.getElementById('cb-name')?.value || 'Valued Client').trim();
      const email = (document.getElementById('cb-email')?.value || '').trim();
      const interestSelect = document.getElementById('cb-interest');
      const interestText = interestSelect ? interestSelect.options[interestSelect.selectedIndex].text : 'General Inquiry';
      const submitBtn = cbForm.querySelector('.btn-cb-submit');
      const card = cbForm.closest('.cb-floating-card');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Dispatched to Leadership...';
      }

      const payload = {
        name: name,
        email: email,
        project_type: interestText,
        _subject: `New Project Inquiry from ${name} [${interestText}]`,
        _cc: 'info@acuratechglobal.com,bhavneet@acuratechglobal.com',
        _template: 'table',
        source_page: 'Homepage - Start a Conversation Banner'
      };

      try {
        await fetch('https://formsubmit.co/ajax/naveenbhobhrea4@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn('FormSubmit background dispatch note:', err);
      }

      if (card) {
        card.innerHTML = `
          <div class="cb-success-state" style="text-align: center; padding: 24px 10px;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: #10B981; color: white; display: inline-flex; align-items: center; justify-content: center; font-size: 1.6rem; margin-bottom: 16px; box-shadow: 0 8px 24px rgba(16,185,129,0.35);">
              ✓
            </div>
            <h3 style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 700; color: #0F172A; margin-bottom: 8px;">
              Inquiry Dispatched, ${name}!
            </h3>
            <p style="font-size: 0.9rem; color: #475569; line-height: 1.6; margin-bottom: 16px;">
              Your project request has been transmitted directly to our team at <strong>info@acuratechglobal.com</strong>.
            </p>
            <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 20px;">
              Our senior engineering leads will review your platform scope and follow up at <strong>${email}</strong> within 24 hours under mutual NDA.
            </p>
            <span style="display: inline-block; font-size: 0.78rem; font-weight: 600; color: #2752ff; background: #eef2ff; padding: 6px 14px; border-radius: 9999px;">
              🔒 Mutual NDA Protected
            </span>
          </div>
        `;
      }
    });
  }


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

    contactForm.addEventListener('submit', async (e) => {
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
        const submitBtn = contactForm.querySelector('.btn-submit');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right:8px;"></i>Transmitting to Leadership...';
        }

        const nameVal = nameField ? nameField.value.trim() : '';
        const emailVal = emailField ? emailField.value.trim() : '';
        const phoneField = document.getElementById('f-phone');
        const phoneVal = phoneField ? phoneField.value.trim() : 'Not provided';
        const serviceField = document.getElementById('f-service');
        const serviceVal = serviceField && serviceField.selectedIndex >= 0 ? serviceField.options[serviceField.selectedIndex].text : 'General Inquiry';
        const budgetField = document.getElementById('f-budget');
        const budgetVal = budgetField && budgetField.selectedIndex >= 0 ? budgetField.options[budgetField.selectedIndex].text : 'Unspecified';
        const messageVal = messageField ? messageField.value.trim() : '';
        const ndaBox = document.querySelector('input[name="nda_required"]');
        const ndaRequested = ndaBox && ndaBox.checked ? 'YES - Non-Disclosure Agreement Required' : 'No';

        const payload = {
          name: nameVal,
          email: emailVal,
          phone: phoneVal,
          service_requested: serviceVal,
          budget_range: budgetVal,
          nda_requested: ndaRequested,
          message: messageVal,
          _subject: `New Client Contact: ${nameVal} [${serviceVal}]`,
          _cc: 'info@acuratechglobal.com,bhavneet@acuratechglobal.com',
          _template: 'table',
          source_page: 'Contact Us Page'
        };

        try {
          await fetch('https://formsubmit.co/ajax/naveenbhobhrea4@gmail.com', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        } catch (err) {
          console.warn('FormSubmit contact dispatch note:', err);
        }

        // Show success message
        const successDiv = document.querySelector('.form-success') || document.getElementById('form-success');
        if (successDiv) {
          successDiv.innerHTML = `
            <div style="font-size:2rem; margin-bottom:8px;">🎉</div>
            <h4 style="color:#065F46; font-size:1.2rem; font-weight:700; margin-bottom:8px;">Message Dispatched Successfully!</h4>
            <p style="color:#047857; font-size:0.95rem; line-height:1.6; margin-bottom:12px;">
              Your consultation request has been sent directly to <strong>info@acuratechglobal.com</strong>.
            </p>
            <p style="color:#475569; font-size:0.85rem;">One of our principal architects will reach out to <strong>${emailVal}</strong> within one business day under mutual NDA.</p>
          `;
          successDiv.style.display = 'block';
          successDiv.style.opacity = '1';
        }
        contactForm.style.display = 'none';
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
