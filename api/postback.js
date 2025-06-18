
export default async function handler(req, res) {
  const { event, click_id, value } = req.query;

  console.log('Evento recebido:', event);
  console.log('Click ID:', click_id);
  console.log('Valor:', value);

  // Aqui você pode salvar em banco, Google Sheet, etc.

  return res.status(200).send('Postback recebido com sucesso!');
}
