import fetch from "node-fetch";

async function buscarShopee(query) {
  try {
    const url = `https://shopee.com.br/search?keyword=${encodeURIComponent(query)}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await res.text();

    // Pega títulos dos produtos (forma simples)
    const resultados = [...html.matchAll(/"name":"(.*?)"/g)];

    if (!resultados.length) {
      console.log("⚠️ Nenhum produto encontrado");
      return [];
    }

    const produtos = resultados.slice(0, 5).map(r => ({
      titulo: r[1].replace(/\\u0026/g, "&"),
      link: url
    }));

    return produtos;

  } catch (err) {
    console.log("❌ ERRO:", err.message);
    return [];
  }
}

function gerarCopy(produto) {
  return `
🔥 OFERTA ENCONTRADA!

🛒 ${produto.titulo}

👉 Confira aqui:
${produto.link}

💥 Corre que pode acabar!
`;
}

async function rodarBot() {
  console.log("🔎 Buscando ofertas...");

  const termos = ["iphone", "smart tv", "fone bluetooth"];

  for (const termo of termos) {
    console.log(`📦 Buscando por: ${termo}`);

    const produtos = await buscarShopee(termo);

    for (const produto of produtos) {
      console.log(gerarCopy(produto));
    }
  }
}

// roda a cada 30 min
setInterval(rodarBot, 1000 * 60 * 30);

// roda na hora também
rodarBot();
