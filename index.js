import fetch from "node-fetch";

// 🚀 Função principal
async function rodarBot() {
  try {
    console.log("🔄 Buscando ofertas Shopee...");

    const termos = ["iphone", "nike", "smart tv", "geladeira"];
    const termo = termos[Math.floor(Math.random() * termos.length)];

    console.log("🧠 Buscando por:", termo);

    const ofertas = await buscarShopee(termo);

    if (!ofertas.length) {
      console.log("⚠️ Nenhuma oferta encontrada");
      return;
    }

    for (const produto of ofertas) {
      console.log(gerarCopy(produto));
    }

  } catch (error) {
    console.log("❌ ERRO:", error.message);
  }
}

// 🔎 Buscar produtos na Shopee
async function buscarShopee(query) {
  try {
    const url = `https://shopee.com.br/api/v4/search/search_items?by=relevancy&keyword=${encodeURIComponent(query)}&limit=5&newest=0`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });

    if (!res.ok) {
      console.log("❌ ERRO HTTP:", res.status);
      return [];
    }

    const data = await res.json();

    if (!data || !data.items || !Array.isArray(data.items)) {
      console.log("⚠️ Resposta inválida:", JSON.stringify(data));
      return [];
    }

    console.log("📦 RESULTADOS:", data.items.length);

    return data.items.map(item => {
      const p = item.item_basic;

      return {
        titulo: p.name,
        preco: p.price / 100000, // Shopee usa valor multiplicado
        link: `https://shopee.com.br/product/${p.shopid}/${p.itemid}`,
        imagem: `https://cf.shopee.com.br/file/${p.image}`
      };
    });

  } catch (error) {
    console.log("❌ ERRO NA BUSCA:", error.message);
    return [];
  }
}

// 💰 Copy de venda
function gerarCopy(produto) {
  return `
🔥 OFERTA SHOPEE!

🛍️ ${produto.titulo}
💰 R$ ${produto.preco.toFixed(2)}

👉 Compre aqui:
${produto.link}

🚀 Corre que pode acabar!
`;
}

// ⏱️ roda a cada 30 min
setInterval(rodarBot, 1000 * 60 * 30);

// 🚀 inicia agora
rodarBot();
