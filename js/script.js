/* ================================================
   Greg's Burguer – script.js
   Funcionalidades: menu mobile, header scroll,
   reveal on scroll, back to top, form validation
   ================================================ */

(function () {
  'use strict';

  // ---------- Elementos ----------
  const header     = document.getElementById('header');
  const hamburger  = document.getElementById('hamburger');
  const nav        = document.getElementById('nav');
  const backToTop  = document.getElementById('backToTop');
  const form       = document.getElementById('contactForm');
  const feedback   = document.getElementById('formFeedback');
  const navLinks   = document.querySelectorAll('.nav__link');
  const reveals    = document.querySelectorAll('.reveal');

  // ---------- Menu Mobile ----------
  function toggleMenu() {
    const isOpen = hamburger.classList.toggle('active');
    nav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', isOpen);
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    nav.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', false);
  }

  hamburger.addEventListener('click', toggleMenu);

  // Fechar ao clicar em um link do menu
  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Fechar ao clicar fora do menu
  nav.addEventListener('click', function (e) {
    if (e.target === nav) closeMenu();
  });

  // ---------- Header ao rolar ----------
  function handleHeaderScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // ---------- Botão Voltar ao Topo ----------
  function handleBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- Reveal on scroll (IntersectionObserver) ----------
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Adiciona atraso escalonado para elementos irmãos
        var siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.children).filter(function (el) {
              return el.classList.contains('reveal');
            })
          : [];
        var idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = idx * 0.1 + 's';
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ---------- Scroll global ----------
  window.addEventListener('scroll', function () {
    handleHeaderScroll();
    handleBackToTop();
  }, { passive: true });

  // Verificar no load também
  handleHeaderScroll();
  handleBackToTop();

  // ---------- Scroll suave para links âncora ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = header.offsetHeight + 12;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ---------- Validação do Formulário ----------
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name    = document.getElementById('name').value.trim();
      var email   = document.getElementById('email').value.trim();
      var message = document.getElementById('message').value.trim();

      // Limpar feedback
      feedback.style.color = '';
      feedback.textContent = '';

      if (!name) {
        showFeedback('Por favor, insira seu nome.', 'error');
        return;
      }
      if (!email || !isValidEmail(email)) {
        showFeedback('Por favor, insira um e-mail válido.', 'error');
        return;
      }
      if (!message) {
        showFeedback('Por favor, escreva sua mensagem.', 'error');
        return;
      }

      // Simular envio
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Enviando...';

      setTimeout(function () {
        showFeedback('✅ Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        form.reset();
        btn.disabled = false;
        btn.textContent = 'Enviar Mensagem';
      }, 1200);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.style.color = type === 'error' ? '#D62828' : '#F4A261';
  }

  // ---------- Active nav link ao scroll ----------
  var sections = document.querySelectorAll('section[id]');

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

})();
