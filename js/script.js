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

/* ==========================================
   CARRINHO DE COMPRAS - GREG'S BURGUER
========================================== */

const cartFloating = document.getElementById("cartFloating");
const cart = document.getElementById("cart");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const continueShopping = document.getElementById("continueShopping");

let cartProducts = JSON.parse(
  localStorage.getItem("gregsCart")
) || [];


/* ==========================================
   FORMATAR DINHEIRO
========================================== */

function formatMoney(value) {

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

}


/* ==========================================
   ABRIR CARRINHO
========================================== */

function openCart() {

  cart.classList.add("active");
  cartOverlay.classList.add("active");

  document.body.style.overflow = "hidden";

}


/* ==========================================
   FECHAR CARRINHO
========================================== */

function closeCart() {

  cart.classList.remove("active");
  cartOverlay.classList.remove("active");

  document.body.style.overflow = "";

}


/* ==========================================
   ADICIONAR PRODUTO
========================================== */

function addToCart(product) {

  const existingProduct = cartProducts.find(
    item => item.name === product.name
  );


  if (existingProduct) {

    existingProduct.quantity++;

  } else {

    cartProducts.push({
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });

  }


  saveCart();

  renderCart();

  openCart();

}


/* ==========================================
   REMOVER PRODUTO
========================================== */

function removeFromCart(index) {

  cartProducts.splice(index, 1);

  saveCart();

  renderCart();

}


/* ==========================================
   ALTERAR QUANTIDADE
========================================== */

function changeQuantity(index, change) {

  cartProducts[index].quantity += change;


  if (cartProducts[index].quantity <= 0) {

    cartProducts.splice(index, 1);

  }


  saveCart();

  renderCart();

}


/* ==========================================
   SALVAR
========================================== */

function saveCart() {

  localStorage.setItem(
    "gregsCart",
    JSON.stringify(cartProducts)
  );

}


/* ==========================================
   RENDERIZAR CARRINHO
========================================== */

function renderCart() {

  if (!cartItems) {
    return;
  }


  if (cartProducts.length === 0) {

    cartItems.innerHTML = `

      <div class="cart-empty">

        <div class="cart-empty-icon">
          🛒
        </div>

        <h3>Seu carrinho está vazio</h3>

        <p>
          Adicione seus hambúrgueres favoritos
          para começar o pedido.
        </p>

      </div>

    `;

  } else {

    cartItems.innerHTML = cartProducts
      .map((product, index) => `

        <div class="cart-item">

          <img
            class="cart-item-image"
            src="${product.image}"
            alt="${product.name}"
          >

          <div class="cart-item-info">

            <div class="cart-item-name">
              ${product.name}
            </div>

            <div class="cart-item-price">
              ${formatMoney(product.price)}
            </div>

            <div class="cart-item-controls">

              <button
                class="cart-quantity-button"
                onclick="changeQuantity(${index}, -1)">
                −
              </button>

              <span class="cart-quantity">
                ${product.quantity}
              </span>

              <button
                class="cart-quantity-button"
                onclick="changeQuantity(${index}, 1)">
                +
              </button>

              <button
                class="cart-remove"
                onclick="removeFromCart(${index})">
                Remover
              </button>

            </div>

          </div>

        </div>

      `)
      .join("");

  }


  updateCartTotals();

}


/* ==========================================
   ATUALIZAR TOTAIS
========================================== */

function updateCartTotals() {

  const totalItems = cartProducts.reduce(
    (total, product) => {
      return total + product.quantity;
    },
    0
  );


  const totalPrice = cartProducts.reduce(
    (total, product) => {
      return total +
        (product.price * product.quantity);
    },
    0
  );


  cartCount.textContent = totalItems;

  cartTotal.textContent = formatMoney(totalPrice);

  checkoutButton.disabled =
    cartProducts.length === 0;

}


/* ==========================================
   BOTÕES "ADICIONAR"
========================================== */

document
  .querySelectorAll(".add-to-cart")
  .forEach(button => {

    button.addEventListener("click", () => {

      const product = {

        name: button.dataset.name,

        price: Number(
          button.dataset.price
        ),

        image: button.dataset.image

      };


      addToCart(product);


      const originalText =
        button.textContent;

      button.textContent = "Adicionado ✓";

      setTimeout(() => {

        button.textContent =
          originalText;

      }, 1200);

    });

  });


/* ==========================================
   EVENTOS
========================================== */

if (cartFloating) {

  cartFloating.addEventListener(
    "click",
    openCart
  );

}

if (cartClose) {

  cartClose.addEventListener(
    "click",
    closeCart
  );

}

if (cartOverlay) {

  cartOverlay.addEventListener(
    "click",
    closeCart
  );

}

if (continueShopping) {

  continueShopping.addEventListener(
    "click",
    closeCart
  );

}


/* ==========================================
   ESC FECHA
========================================== */

document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {

      closeCart();

    }

  }
);


/* ==========================================
   CHECKOUT
========================================== */

if (checkoutButton) {

  checkoutButton.addEventListener(
    "click",
    () => {

      if (cartProducts.length === 0) {
        return;
      }


      /*
       * NA PRÓXIMA ETAPA:
       *
       * Aqui vamos abrir o checkout
       * com:
       *
       * Nome
       * Telefone
       * Endereço
       * Observação
       * Forma de pagamento
       *
       */

      alert(
        "Próxima etapa: finalizar o pedido."
      );

    }
  );

}


/* ==========================================
   INICIALIZAR
========================================== */

renderCart();

