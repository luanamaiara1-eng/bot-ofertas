import fetch from "node-fetch";

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

async function buscarOfertas() {
  const res = await fetch(
    "https://api.mercadolibre.com/sites/MLB/search?q=promoção&sort=price_asc",
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }
  );

  const data = await res.json();

  const ofertas = data.results
    .filter(
      (item) =>
        item.original_price &&
        (item.original_price - item.price) / item.original_price > 0.3
    )
    .slice(0, 3);

  return ofertas;
}

function gerarCopy(produto) {
  return `
🔥 OFERTA IMPERDÍVEL

${produto.title}

De R$${produto.original_price} por R$${produto.price} 😱

👉 ${produto.permalink}

⚠️ Corre que pode acabar!
`;
}

async function rodarBot() {
  console.log("Buscando ofertas...");

  const ofertas = await buscarOfertas();

  for (const produto of ofertas) {
    console.log(gerarCopy(produto));
  }
}

setInterval(rodarBot, 1000 * 60 * 30);

rodarBot();
