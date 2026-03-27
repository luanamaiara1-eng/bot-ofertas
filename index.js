import fetch from "node-fetch";

// 🔥 Função principal
async function rodarBot() {
  try {
    console.log("🔎 Buscando ofertas...");

    const termos = ["iphone", "nike", "smart tv", "geladeira"];
    const termo = termos[Math.floor(Math.random() * termos.length)];

    console.log("🧠 Buscando por:", termo);

    const ofertas = await buscarOfertas(termo);

    if (!ofertas.length) {
      console.log("⚠️ Nenhuma oferta encontrada");
      return;
    }

    for (const produto of ofertas) {
      const mensagem = gerarCopy(produto);
      console.log(mensagem);
    }

  } catch (error) {
    console.log("❌ ERRO NO BOT:", error.message);
  }
}

// 🔎 Buscar produtos no Mercado Livre (SEM TOKEN)
async function buscarOfertas(query) {
  try {
    const url = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;

    const res = await fetch(url);
    const data = await res.json();

    console.log("📦 RESULTADOS:", data.results?.length);

    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.slice(0, 5).map(item => ({
      titulo: item.title,
      preco: item.price,
      link: item.permalink,
      imagem: item.thumbnail
    }));

  } catch (error) {
    console.log("❌ ERRO NA BUSCA:", error.message);
    return [];
  }
}

// 💰 Gerador de copy (texto de venda)
function gerarCopy(produto) {
  return `
🔥 OFERTA ENCONTRADA!

🛍️ ${produto.titulo}
💰 R$ ${produto.preco}

👉 Compre aqui:
${produto.link}

🚀 Corre que pode acabar!
`;
}

// ⏱️ Executa a cada 30 minutos
setInterval(rodarBot, 1000 * 60 * 30);

// 🚀 Primeira execução imediata
rodarBot();
