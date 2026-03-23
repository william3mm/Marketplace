// ============================================================
// DADOS DOS PRODUTOS
// Adiciona, remove ou edita produtos aqui.
// A página renderiza-se automaticamente.
// ============================================================

export const produtos = [
  {
    id: 1,
    nome: "Smartwatch Series 9 Ultra",
    categoria: "Eletrónicos",
    foto: "https://via.placeholder.com/300x300?text=Smartwatch",
    preco_usd: 30,
    desconto: 15, // % de desconto (0 = sem desconto)
    cores: ["#1a237e", "#212121", "#c0c0c0"],
    tamanhos: ["42mm", "44mm", "46mm"],
    avaliacao: 4.6,
    vendidos: "2.3k",
    specs: [
      { chave: "Ecrã", valor: 'AMOLED 1.9"' },
      { chave: "Bateria", valor: "500 mAh / 7 dias" },
      { chave: "Conectividade", valor: "BT 5.3 + GPS" },
      { chave: "Resistência", valor: "IP68" },
    ],
    descricao:
      "O Smartwatch Series 9 Ultra monitoriza saúde 24/7, com GPS integrado e NFC para pagamentos. Compatível com Android e iOS.",
  },
  {
    id: 2,
    nome: "Kit Chaves Precisão",
    categoria: "Ferramentas",
    foto: "https://via.placeholder.com/300x300?text=Kit+Chaves",
    preco_usd: 15,
    desconto: 0,
    cores: [], // sem cores
    tamanhos: [], // sem tamanhos
    avaliacao: 4.4,
    vendidos: "870",
    specs: [
      { chave: "Peças", valor: "46 unidades" },
      { chave: "Material", valor: "Aço inox" },
      { chave: "Estojo", valor: "Incluído" },
    ],
    descricao:
      "Kit completo de chaves de precisão para electrónica, óculos e relógios. Estojo rígido incluído.",
  },
  {
    id: 3,
    nome: "Ténis Casual Unisexo Style",
    categoria: "Moda",
    foto: "https://via.placeholder.com/300x300?text=Tenis",
    preco_usd: 20,
    desconto: 10,
    cores: ["#ffffff", "#212121", "#e53935"],
    tamanhos: ["38", "39", "40", "41", "42", "43", "44"],
    avaliacao: 4.2,
    vendidos: "1.1k",
    specs: [
      { chave: "Material", valor: "Lona + Borracha" },
      { chave: "Género", valor: "Unisexo" },
      { chave: "Sola", valor: "Antiderrapante" },
    ],
    descricao:
      "Ténis casual confortável para o dia-a-dia. Disponível em várias cores e tamanhos.",
  },
  {
    id: 4,
    nome: "Fones Ouvido Bluetooth TWS",
    categoria: "Eletrónicos",
    foto: "https://via.placeholder.com/300x300?text=Fone+Ouvido",
    preco_usd: 12,
    desconto: 0,
    cores: ["#212121", "#ffffff"],
    tamanhos: [],
    avaliacao: 4.3,
    vendidos: "3.2k",
    specs: [
      { chave: "Bluetooth", valor: "5.0" },
      { chave: "Bateria", valor: "6h + 24h (case)" },
      { chave: "Cancelamento", valor: "Ruído passivo" },
    ],
    descricao:
      "Fones TWS sem fio com graves potentes e case de carregamento. Ideal para desporto e trabalho.",
  },
  {
    id: 5,
    nome: "Sensor Estacionamento (Kit)",
    categoria: "Peças Auto",
    foto: "https://via.placeholder.com/300x300?text=Peca+Auto",
    preco_usd: 24,
    desconto: 0,
    cores: ["#212121", "#f5f5f5"],
    tamanhos: [],
    avaliacao: 4.1,
    vendidos: "420",
    specs: [
      { chave: "Sensores", valor: "4 unidades" },
      { chave: "Sinal", valor: "Sonoro + LED" },
      { chave: "Instalação", valor: "Universal" },
    ],
    descricao:
      "Kit de sensores de estacionamento traseiros com alarme sonoro. Instalação universal para qualquer viatura.",
  },
  {
    id: 6,
    nome: "Mini Processador Alimentos",
    categoria: "Casa",
    foto: "https://via.placeholder.com/300x300?text=Processador",
    preco_usd: 10,
    desconto: 5,
    cores: ["#ffffff", "#e53935"],
    tamanhos: [],
    avaliacao: 4.0,
    vendidos: "650",
    specs: [
      { chave: "Potência", valor: "350W" },
      { chave: "Capacidade", valor: "500ml" },
      { chave: "Lâminas", valor: "Aço inox" },
    ],
    descricao:
      "Mini processador compacto ideal para picar, triturar e misturar alimentos. Fácil de limpar.",
  },
];
