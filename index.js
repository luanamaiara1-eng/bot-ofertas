import fetch from "node-fetch";

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;


async function rodarBot() {
  console.log("Buscando ofertas...");

  const ofertas = await buscarOfertas();

  for (const produto of ofertas) {
    console.log(gerarCopy(produto));
  }
}

setInterval(rodarBot, 1000 * 60 * 30);

rodarBot();
async function buscarOfertas() {
  try {
    const res = await fetch(
      "https://api.mercadolibre.com/sites/MLB/search?q=promoção&sort=price_asc",
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    const data = await res.json();

    console.log("RESPOSTA COMPLETA:", data);
    console.log("TOKEN:", ACCESS_TOKEN);

    if (!data || !data.results) {
      console.log("⚠️ API não retornou resultados");
      return [];
    }

    const ofertas = data.results
      .filter(
        (item) =>
          item.original_price &&
          (item.original_price - item.price) / item.original_price > 0.3
      )
      .slice(0, 3);

    return ofertas;

  } catch (error) {
    console.log("ERRO:", error);
    return [];
  }
}
