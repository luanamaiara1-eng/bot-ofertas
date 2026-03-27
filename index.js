import fetch from "node-fetch";

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

async function buscarShopee(query) {
  try {
    const url = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(
  `https://shopee.com.br/api/v4/search/search_items?by=relevancy&keyword=${query}&limit=5&newest=0`
)}`;

    const res = await fetch(url);

    if (!res.ok) {
      console.log("❌ ERRO HTTP:", res.status);
      return [];
    }

    const data = await res.json();

    if (!data || !data.items) {
      console.log("⚠️ Resposta inválida:", data);
      return [];
    }

    console.log("📦 RESULTADOS:", data.items.length);

    return data.items.map(item => {
      const p = item.item_basic;

      return {
        titulo: p.name,
        preco: p.price / 100000,
        link: `https://shopee.com.br/product/${p.shopid}/${p.itemid}`,
      };
    });

  } catch (error) {
    console.log("❌ ERRO:", error.message);
    return [];
  }
}

function gerarCopy(produto) {
  return `
🔥 OFERTA!

🛍️ ${produto.titulo}
💰 R$ ${produto.preco.toFixed(2)}

👉 ${produto.link}
`;
}

setInterval(rodarBot, 1000 * 60 * 30);
rodarBot();
