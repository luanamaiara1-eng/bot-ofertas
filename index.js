import fetch from "node-fetch";

// 🚀 Função principal
async function rodarBot() {
  try {
    console.log("🔄 Iniciando nova busca...");

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

// 🔎 Buscar produtos (SEM TOKEN e com proteção total)
async function buscarOfertas(query) {
  try {
    const url = `https://api.mercadolibre.com/sites/MLB/search?q=${query}&limit=5`;

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

    if (!data || !data.results || !Array.isArray(data.results)) {
      console.log("⚠️ API respondeu diferente:", JSON.stringify(data));
      return [];
    }

    console.log("📦 RESULTADOS:", data.results.length);

    return data.results.map(item => ({
      titulo: item.title || "Sem título",
      preco: item.price || 0,
      link: item.permalink || "",
      imagem: item.thumbnail || ""
    }));

  } catch (error) {
    console.log("❌ ERRO NA BUSCA:", error.message);
    return [];
  }
}
// 💰 Gerador de copy (mensagem de venda)
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

// 🚀 Executa agora ao iniciar
rodarBot();
