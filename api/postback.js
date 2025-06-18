// pages/api/postback.js

export default async function handler(req, res) {
  const { evento, id_de_clique, valor } = req.query; // ou req.body se for POST

console.log('Evento recebido:', evento);
console.log('ID do clique:', id_de_clique);
console.log('Valentia:', valor);


  // Aqui você pode salvar no banco, planilha do Google, etc.

  return res.status(200).send('Postback recebido com sucesso!');
}
