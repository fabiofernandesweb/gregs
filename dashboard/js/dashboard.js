document.addEventListener("DOMContentLoaded", () => {

  /* ==========================
     DATA
  ========================== */

  const orders = [
    {
      id: "#1048",
      customer: "João Silva",
      items: 2,
      payment: "PIX",
      total: 59.80,
      status: "Entregue"
    },
    {
      id: "#1047",
      customer: "Maria Souza",
      items: 3,
      payment: "Cartão",
      total: 53.80,
      status: "Preparando"
    },
    {
      id: "#1046",
      customer: "Pedro Lima",
      items: 2,
      payment: "PIX",
      total: 37.90,
      status: "Novo"
    }
  ];


  /* ==========================
     DATA ATUAL
  ========================== */

  const currentDate = document.getElementById("currentDate");

  if (currentDate) {

    const date = new Date();

    currentDate.textContent = date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  }


  /* ==========================
     MENU MOBILE
  ========================== */

  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");

  if (menuToggle && sidebar) {

    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });

  }


  /* ==========================
     NAVEGAÇÃO
  ========================== */

  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach(item => {

    item.addEventListener("click", event => {

      event.preventDefault();

      navItems.forEach(nav => {
        nav.classList.remove("active");
      });

      item.classList.add("active");

    });

  });


  /* ==========================
     MODAL NOVO PEDIDO
  ========================== */

  const modal = document.getElementById("orderModal");
  const openModal = document.getElementById("newOrderButton");
  const closeModal = document.getElementById("closeModal");

  if (openModal && modal) {

    openModal.addEventListener("click", () => {
      modal.classList.add("active");
    });

  }

  if (closeModal && modal) {

    closeModal.addEventListener("click", () => {
      modal.classList.remove("active");
    });

  }

  if (modal) {

    modal.addEventListener("click", event => {

      if (event.target === modal) {
        modal.classList.remove("active");
      }

    });

  }


  /* ==========================
     CALCULAR TOTAL
  ========================== */

  const productSelect = document.getElementById("productSelect");
  const quantity = document.getElementById("quantity");
  const modalTotal = document.getElementById("modalTotal");

  function updateTotal() {

    if (!productSelect || !quantity || !modalTotal) {
      return;
    }

    const price = Number(productSelect.value);
    const qty = Number(quantity.value) || 1;

    const total = price * qty;

    modalTotal.textContent = total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

  }

  if (productSelect) {
    productSelect.addEventListener("change", updateTotal);
  }

  if (quantity) {
    quantity.addEventListener("input", updateTotal);
  }


  /* ==========================
     CRIAR PEDIDO
  ========================== */

  const createOrder = document.getElementById("createOrder");
  const customerName = document.getElementById("customerName");

  if (createOrder) {

    createOrder.addEventListener("click", () => {

      const name = customerName.value.trim();

      if (!name) {
        alert("Digite o nome do cliente.");
        customerName.focus();
        return;
      }

      const price = Number(productSelect.value);
      const qty = Number(quantity.value) || 1;
      const total = price * qty;

      console.log({
        cliente: name,
        produto: productSelect.options[
          productSelect.selectedIndex
        ].text,
        quantidade: qty,
        total: total
      });

      alert("Pedido criado com sucesso!");

      customerName.value = "";
      quantity.value = 1;

      modal.classList.remove("active");

    });

  }


  /* ==========================
     SELECT PERÍODO
  ========================== */

  const periodSelect = document.getElementById("periodSelect");

  if (periodSelect) {

    periodSelect.addEventListener("change", () => {

      console.log(
        "Período selecionado:",
        periodSelect.value
      );

    });

  }

});
