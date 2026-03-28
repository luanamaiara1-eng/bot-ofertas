import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

async function buscarShopee(query) {
  try {
    const url = `https://shopee.com.br/search?keyword=${encodeURIComponent(query)}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "pt-BR,pt;q=0.9"
      }
    });

    const html = await res.text();

    // pega nomes dos produtos
    const nomes = [...html.matchAll(/"name":"(.*?)"/g)].map(r => r[1]);

    // pega preços
    const precos = [...html.matchAll(/"price":(\d+)/g)].map(r => r[1]);

    // pega imagens
    const imagens = [...html.matchAll(/"image":"(.*?)"/g)].map(r => r[1]);

    const produtos = nomes
      .slice(0, 5)
      .map((nome, i) => ({
        titulo: nome.substring(0, 80),
        preco: precos[i]
          ? `R$ ${(Number(precos[i]) / 100000).toFixed(2)}`
          : "Preço indisponível",
        imagem: imagens[i]
          ? imagens[i].replace(/\\u002F/g, "/")
          : null,
        link: url
      }))
      .filter(p => p.titulo.length > 5);

    return produtos;
  } catch (err) {
    console.log("ERRO:", err.message);
    return [];
  }
}

// melhor oferta = menor preço válido
function melhorOferta(produtos) {
  const validos = produtos.filter(p => p.preco !== "Preço indisponível");

  if (!validos.length) return null;

  return validos.sort((a, b) => {
    const pa = Number(a.preco.replace(/[^\d,]/g, "").replace(",", "."));
    const pb = Number(b.preco.replace(/[^\d,]/g, "").replace(",", "."));
    return pa - pb;
  })[0];
}

// API
app.get("/ofertas", async (req, res) => {
  const query = req.query.q || "iphone";

  const produtos = await buscarShopee(query);
  const melhor = melhorOferta(produtos);

  res.json({
    sucesso: true,
    total: produtos.length,
    melhorOferta: melhor,
    produtos
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});
