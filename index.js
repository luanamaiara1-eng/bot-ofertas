import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

async function buscarShopee(query) {
  try {
    const url = `https://shopee.com.br/search?keyword=${encodeURIComponent(query)}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await res.text();

    const resultados = [...html.matchAll(/"name":"(.*?)","/g)]
      .map(r => r[1])
      .filter(nome =>
        nome.length > 20 &&
        !nome.toLowerCase().includes("shopee") &&
        !nome.toLowerCase().includes("login")
      );

    return resultados.slice(0, 5).map(nome => ({
      titulo: nome.substring(0, 80),
      link: url
    }));

  } catch (err) {
    console.log("ERRO:", err.message);
    return [];
  }
}

// 🔥 CRIA A API
app.get("/ofertas", async (req, res) => {
  const query = req.query.q || "iphone";

  const produtos = await buscarShopee(query);

  res.json({
    sucesso: true,
    total: produtos.length,
    produtos
  });
});

// 🔥 INICIA O SERVIDOR
app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});
