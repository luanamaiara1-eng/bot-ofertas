import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8080;

/*
  Função para buscar ofertas reais
*/
async function buscarOfertas(query = "iphone") {
  try {
    console.log(`🔎 Buscando ofertas por: ${query}`);

    const url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(query)}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return [];
    }

    const ofertas = data.results.map((item) => ({
      titulo: item.title,
      preco: item.price,
      precoOriginal: item.original_price || item.price,
      imagem: item.thumbnail,
      link: item.permalink,
      desconto:
        item.original_price && item.original_price > item.price
          ? Math.round(
              ((item.original_price - item.price) /
                item.original_price) *
                100
            )
          : 0,
    }));

    return ofertas;
  } catch (error) {
    console.error("❌ ERRO:", error.message);
    return [];
  }
}

/*
  Encontrar a melhor promoção
*/
function melhorOferta(ofertas) {
  if (!ofertas.length) return null;

  return ofertas.sort((a, b) => {
    if (b.desconto !== a.desconto) {
      return b.desconto - a.desconto;
    }

    return a.preco - b.preco;
  })[0];
}

/*
  Endpoint API
*/
app.get("/ofertas", async (req, res) => {
  const query = req.query.q || "iphone";

  const ofertas = await buscarOfertas(query);

  const melhor = melhorOferta(ofertas);

  res.json({
    sucesso: true,
    busca: query,
    total: ofertas.length,
    melhorOferta: melhor,
    ofertas,
  });
});

/*
  Rodar servidor
*/
app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});
