import { produtos } from "../../../Config/produtos.js";
const CAMBIO = 920;

function calcPrecoKz(preco_usd, desconto) {
  const base = preco_usd * CAMBIO;
  return desconto > 0 ? Math.round(base * (1 - desconto / 100)) : base;
}

function formatKz(valor) {
  return valor.toLocaleString("pt-PT");
}

// ============================================================
// RENDERIZAÇÃO DOS CARDS NA GRELHA (index.html)
// ============================================================
function renderProdutos(lista = produtos) {
  const grid = document.querySelector(".product-grid");
  if (!grid) return;

  grid.innerHTML = lista
    .map((p) => {
      const precoKz = calcPrecoKz(p.preco_usd, p.desconto);
      const badgeHTML =
        p.desconto > 0
          ? `<span class="discount-chip">-${p.desconto}%</span>`
          : "";

      return `
      <div class="product-card" onclick="irParaProduto(${p.id})">
        <div class="product-img">
          ${badgeHTML}
          <img src="${p.foto}" alt="${p.nome}" loading="lazy" />
        </div>
        <div class="product-info">
          <span class="cat-tag">${p.categoria}</span>
          <h4>${p.nome}</h4>
          <div class="price-box">
            <span class="price-kz">${formatKz(precoKz)} Kz</span>
            <span class="price-usd">$${p.preco_usd}.00</span>
          </div>
          <button class="btn-add" onclick="event.stopPropagation(); irParaProduto(${p.id})">
            <i class="bi bi-bag-plus"></i> Encomendar
          </button>
        </div>
      </div>
    `;
    })
    .join("");
}

function irParaProduto(id) {
  window.location.href = `produto.html?id=${id}`;
}

// ============================================================
// FILTRO POR CATEGORIA
// ============================================================
function filtrarCategoria(categoria) {
  document.querySelectorAll(".category-list li a").forEach((a) => {
    a.classList.toggle("active", a.dataset.cat === categoria);
  });

  const filtrados =
    categoria === "Todos"
      ? produtos
      : produtos.filter((p) => p.categoria === categoria);

  renderProdutos(filtrados);
}

function renderPaginaProduto() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const p = produtos.find((prod) => prod.id === id);

  if (!p) {
    document.querySelector(".page").innerHTML = `
      <div style="text-align:center; padding: 60px 20px;">
        <h2>Produto não encontrado</h2>
        <a href="index.html" style="color:#1a237e;">← Voltar à loja</a>
      </div>`;
    return;
  }
  window.produtoActual = p;
  const precoKz = calcPrecoKz(p.preco_usd, p.desconto);
  const precoOriginalKz = p.preco_usd * CAMBIO;

  document.title = `AngoChina | ${p.nome}`;

  document.getElementById("mainImg").src = p.foto;
  document.getElementById("mainImg").alt = p.nome;

  const badge = document.querySelector(".discount-badge");
  if (p.desconto > 0) {
    badge.textContent = `-${p.desconto}% Promo`;
    badge.style.display = "block";
  } else {
    badge.style.display = "none";
  }

  document.querySelectorAll(".thumb img").forEach((img) => (img.src = p.foto));

  document.querySelector(".cat-tag").textContent = p.categoria;
  document.querySelector(".product-title").textContent = p.nome;

  document.querySelector(".rating-num").textContent = p.avaliacao;
  document.querySelector(".sold-tag").textContent = `${p.vendidos} vendidos`;
  renderEstrelas(p.avaliacao);

  document.querySelector(".price-kz").textContent = `${formatKz(precoKz)} Kz`;
  document.querySelector(".price-usd").textContent = `≈ $${p.preco_usd}.00`;
  if (p.desconto > 0) {
    document.querySelector(".price-original").textContent =
      `${formatKz(precoOriginalKz)} Kz`;
    document.querySelector(".price-original").style.display = "inline";
  } else {
    document.querySelector(".price-original").style.display = "none";
  }

  renderVariantes(p);
  renderSpecs(p.specs);

  document.querySelector(".desc-text").innerHTML = `<p>${p.descricao}</p>`;
}

function renderEstrelas(rating) {
  const container = document.querySelector(".stars");
  if (!container) return;
  const cheia = Math.floor(rating);
  const meia = rating % 1 >= 0.5 ? 1 : 0;
  const vazia = 5 - cheia - meia;
  container.innerHTML =
    '<i class="bi bi-star-fill"></i>'.repeat(cheia) +
    (meia ? '<i class="bi bi-star-half"></i>' : "") +
    '<i class="bi bi-star"></i>'.repeat(vazia);
}

function renderVariantes(p) {
  const card = document.querySelector(".variants-card");
  if (!card) return;

  let html = "";

  if (p.tamanhos && p.tamanhos.length > 0) {
    html += `<p class="section-label">Tamanho</p>
    <div class="variant-options">
      ${p.tamanhos
        .map(
          (t, i) =>
            `<button class="variant-btn ${i === 0 ? "active" : ""}" onclick="selectVariant(this)">${t}</button>`,
        )
        .join("")}
    </div>`;
  }

  if (p.cores && p.cores.length > 0) {
    html += `<p class="section-label">Cor</p>
    <div class="color-options">
      ${p.cores
        .map(
          (c, i) =>
            `<div class="color-btn ${i === 0 ? "active" : ""}" style="background:${c}" onclick="selectColor(this)"></div>`,
        )
        .join("")}
    </div>`;
  }

  html += `
    <div class="qty-row">
      <span class="qty-label">Quantidade</span>
      <button class="qty-btn" onclick="changeQty(-1)">−</button>
      <div class="qty-display" id="qtyDisplay">1</div>
      <button class="qty-btn" onclick="changeQty(1)">+</button>
    </div>
    <div class="total-row">
    <span class="total-label">Total</span>
    <span class="total-value" id="totalValue">${formatKz(calcPrecoKz(p.preco_usd, p.desconto))} Kz</span>
  </div>
    `;

  card.innerHTML = html;
}

function renderSpecs(specs) {
  const grid = document.querySelector(".specs-grid");
  if (!grid || !specs || specs.length === 0) {
    grid?.closest(".desc-card")?.querySelector(".specs-title")?.remove();
    grid?.remove();
    return;
  }
  grid.innerHTML = specs
    .map(
      (s) => `
    <div class="spec-item">
      <div class="spec-key">${s.chave}</div>
      <div class="spec-val">${s.valor}</div>
    </div>
  `,
    )
    .join("");
}

// ============================================================
// FUNÇÕES DO PRODUTO — usadas nos onclick="" do HTML
// ============================================================
function changeQty(delta) {
  const display = document.getElementById("qtyDisplay");
  const totalEl = document.getElementById("totalValue");
  if (!display) return;

  let qty = parseInt(display.textContent);
  qty = Math.max(1, Math.min(99, qty + delta));
  display.textContent = qty;

  if (totalEl) {
    const precoUnitario = document
      .querySelector(".price-kz")
      .textContent.replace(/\./g, "") // remove pontos: 27.600 → 27600
      .replace(/\s/g, "") // ← remove espaços: 22 080 → 22080
      .replace(" Kz", "")
      .replace("Kz", ""); // garante que remove o Kz com ou sem espaço

    totalEl.textContent = formatKz(parseInt(precoUnitario) * qty) + " Kz";
  }
}

function selectVariant(btn) {
  btn
    .closest(".variant-options")
    .querySelectorAll(".variant-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
}

function selectColor(btn) {
  btn
    .closest(".color-options")
    .querySelectorAll(".color-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
}

function changePhoto(thumb, src) {
  document
    .querySelectorAll(".thumb")
    .forEach((t) => t.classList.remove("active"));
  thumb.classList.add("active");
  const img = document.getElementById("mainImg");
  img.style.opacity = "0";
  img.style.transform = "scale(0.96)";
  setTimeout(() => {
    img.src = src;
    img.style.transition = "opacity 0.25s, transform 0.25s";
    img.style.opacity = "1";
    img.style.transform = "scale(1)";
  }, 150);
}

let cartCount = 0;

function addToCart() {
  const qty = parseInt(document.getElementById("qtyDisplay")?.textContent || 1);
  const variantes = window.getVariantesSelecionadas();
  adicionarAoCarrinho(window.produtoActual, qty, variantes);
}

function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2800);
}

window.irParaProduto = irParaProduto;
window.changeQty = changeQty;
window.selectVariant = selectVariant;
window.selectColor = selectColor;
window.changePhoto = changePhoto;
window.addToCart = addToCart;
window.showToast = showToast;

// ============================================================
// INICIALIZAÇÃO AUTOMÁTICA
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".product-grid")) {
    renderProdutos();

    document.querySelectorAll(".category-list li a").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        filtrarCategoria(a.dataset.cat || "Todos");
      });
    });
  }

  if (document.getElementById("mainImg")) {
    renderPaginaProduto();
  }
});
