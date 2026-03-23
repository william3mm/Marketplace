const CAMBIO = 920;

function formatKz(valor) {
  return valor.toLocaleString("pt-PT");
}

let carrinho = JSON.parse(localStorage.getItem("angochina_cart")) || [];

// 2. FUNÇÃO PARA SALVAR SEMPRE QUE HOUVER MUDANÇA
function guardarNoStorage() {
  localStorage.setItem("angochina_cart", JSON.stringify(carrinho));
}

function iniciarCarrinho() {
  if (document.getElementById("cartDrawer")) return;

  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <!-- Overlay -->
    <div class="cart-overlay" id="cartOverlay" onclick="fecharCarrinho()"></div>

    <!-- Drawer -->
    <div class="cart-drawer" id="cartDrawer">

      <div class="cart-header">
        <h2>
          <i class="bi bi-cart3"></i>
          Carrinho
          <span class="cart-count-badge" id="drawerCount">0</span>
        </h2>
        <button class="cart-close" onclick="fecharCarrinho()">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="cart-body" id="cartBody">
        <div class="cart-empty">
          <i class="bi bi-cart-x"></i>
          <p>O teu carrinho está vazio.<br>Adiciona produtos para começar.</p>
        </div>
      </div>

      <div class="cart-footer" id="cartFooter" style="display:none">
        <div class="summary-row">
          <span>Subtotal</span>
          <span id="cartSubtotal">0 Kz</span>
        </div>
        <div class="summary-row">
          <span>Envio</span>
          <span class="free-shipping">Calculado no checkout</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <span id="cartTotal">0 Kz</span>
        </div>
        <button class="btn-checkout" onclick="irParaCheckout()">
          <i class="bi bi-lightning-fill"></i> Finalizar Compra
        </button>
        <button class="btn-continue" onclick="fecharCarrinho()">
          ← Continuar a comprar
        </button>
      </div>

    </div>
  `,
  );
}

// ── ABRIR / FECHAR ─────────────────────────────────────────
function abrirCarrinho() {
  document.getElementById("cartOverlay").classList.add("open");
  document.getElementById("cartDrawer").classList.add("open");
  document.body.style.overflow = "hidden"; // impede scroll do fundo
}

function fecharCarrinho() {
  document.getElementById("cartOverlay").classList.remove("open");
  document.getElementById("cartDrawer").classList.remove("open");
  document.body.style.overflow = "";
}

function adicionarAoCarrinho(p, qty = 1, variantes = {}) {
  if (!p) return;
  const precoKz = calcPrecoKz(p.preco_usd, p.desconto);

  const existente = carrinho.find(
    (i) =>
      i.id === p.id &&
      i.variantes?.cor === variantes.cor &&
      i.variantes?.tamanho === variantes.tamanho,
  );

  if (existente) {
    existente.qty = Math.min(99, existente.qty + qty);
  } else {
    carrinho.push({
      id: p.id,
      nome: p.nome,
      categoria: p.categoria,
      foto: p.foto,
      precoKz,
      preco_usd: p.preco_usd,
      qty,
      variantes,
    });
  }

  // ATUALIZAÇÕES CRÍTICAS:
  guardarNoStorage(); // Salva no navegador
  renderCarrinho();
  actualizarBadge();
  abrirCarrinho();
}

function removerItem(index) {
  carrinho.splice(index, 1);
  guardarNoStorage();
  renderCarrinho();
  actualizarBadge();
}

// ── ALTERAR QUANTIDADE ─────────────────────────────────────
function alterarQtyCarrinho(index, delta) {
  carrinho[index].qty = Math.max(1, Math.min(99, carrinho[index].qty + delta));
  guardarNoStorage();
  renderCarrinho();
  actualizarBadge();
}

// ── RENDERIZAR LISTA DE ITENS ──────────────────────────────
function renderCarrinho() {
  const body = document.getElementById("cartBody");
  const footer = document.getElementById("cartFooter");
  const count = document.getElementById("drawerCount");

  const total = carrinho.reduce((s, i) => s + i.precoKz * i.qty, 0);

  count.textContent = carrinho.reduce((s, i) => s + i.qty, 0);

  if (carrinho.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <i class="bi bi-cart-x"></i>
        <p>O teu carrinho está vazio.<br>Adiciona produtos para começar.</p>
      </div>`;
    footer.style.display = "none";
    return;
  }

  footer.style.display = "block";

  body.innerHTML = carrinho
    .map((item, i) => {
      const variantesTexto = [
        item.variantes?.tamanho ? `Tam: ${item.variantes.tamanho}` : "",
        item.variantes?.cor
          ? `<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${item.variantes.cor};vertical-align:middle;border:1px solid #ccc"></span>`
          : "",
      ]
        .filter(Boolean)
        .join(" &nbsp;");

      return `
      <div class="cart-card">
        <img src="${item.foto}" alt="${item.nome}" />
        <div class="cart-item-info">
          <div class="cart-item-cat">${item.categoria}</div>
          <h4>${item.nome}</h4>
          ${variantesTexto ? `<div style="font-size:0.72rem;color:#888;margin-bottom:6px">${variantesTexto}</div>` : ""}
          <div class="cart-item-price">${formatKz(item.precoKz * item.qty)} Kz</div>
          <div class="cart-item-controls">
            <div class="quantity-control">
              <button class="btn-qty" onclick="alterarQtyCarrinho(${i}, -1)">−</button>
              <span class="qty-number">${item.qty}</span>
              <button class="btn-qty" onclick="alterarQtyCarrinho(${i}, 1)">+</button>
            </div>
            <button class="btn-remove" onclick="removerItem(${i})" title="Remover">
              <i class="bi bi-trash3"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  document.getElementById("cartSubtotal").textContent = `${formatKz(total)} Kz`;
  document.getElementById("cartTotal").textContent = `${formatKz(total)} Kz`;
}

function actualizarBadge() {
  const total = carrinho.reduce((s, i) => s + i.qty, 0);
  document
    .querySelectorAll(".cart-icon .badge, #cartCount, #drawerCount")
    .forEach((el) => {
      if (el) el.textContent = total;
    });
}

// ── CHECKOUT ───────────────────────────────────────────────
function irParaCheckout() {
  // Por agora mostra um toast — substituir por redirect quando tiveres a página
  if (typeof showToast === "function") {
    showToast("🚀 A redirecionar para o pagamento...");
  }
  // window.location.href = "checkout.html";
}

// ── HELPER: lê preço unitário do produto ──────────────────
function calcPrecoKz(preco_usd, desconto) {
  const base = preco_usd * CAMBIO;
  return desconto > 0 ? Math.round(base * (1 - desconto / 100)) : base;
}

// ── HELPER: lê variantes seleccionadas na página do produto ─
function getVariantesSelecionadas() {
  const tamanhoBtn = document.querySelector(".variant-btn.active");
  const corBtn = document.querySelector(".color-btn.active");
  return {
    tamanho: tamanhoBtn ? tamanhoBtn.textContent.trim() : null,
    cor: corBtn ? corBtn.style.background : null,
  };
}

// ── EXPÕE FUNÇÕES GLOBALMENTE ──────────────────────────────
window.abrirCarrinho = abrirCarrinho;
window.fecharCarrinho = fecharCarrinho;
window.adicionarAoCarrinho = adicionarAoCarrinho;
window.removerItem = removerItem;
window.alterarQtyCarrinho = alterarQtyCarrinho;
window.getVariantesSelecionadas = getVariantesSelecionadas;

document.addEventListener("DOMContentLoaded", () => {
  iniciarCarrinho();

  // Importante: Renderizar e atualizar assim que a página carrega
  renderCarrinho();
  actualizarBadge();

  document.querySelectorAll(".cart-icon").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      abrirCarrinho();
    });
  });
});
