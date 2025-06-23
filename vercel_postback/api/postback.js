import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

async function sendToFacebook(clickId, eventName, value = null) {
  const pixelId = process.env.ID_PIXEL || 'SEU_PIXEL_ID'; // Troque pelo seu Pixel ID real
  const accessToken = process.env.TOKEN_DE_ACESSO || 'SEU_ACCESS_TOKEN'; // Troque pelo seu token de acesso da CAPI

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: 'https://seuprojeto.vercel.app/api/postback',
        custom_data: {
          value: value ? Number(value) : 0,
          currency: 'BRL'
        },
        user_data: {
          external_id: clickId
        }
      }
    ]
  };

  const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log('Facebook CAPI Response:', result);
  } catch (error) {
    console.error('Erro ao enviar para o Facebook:', error);
  }
}

router.post('/postback', async (req, res) => {
  const { click_id, event, value } = req.body;

  if (!click_id || !event) {
    return res.status(400).json({ error: 'Faltando parâmetros obrigatórios: click_id e event' });
  }

  // Mapeando os eventos vindos da casa de apostas para eventos do Meta
  if (event === 'register') {
    await sendToFacebook(click_id, 'Lead');
  } else if (event === 'sale') {
    await sendToFacebook(click_id, 'Purchase', value);
  } else {
    console.warn('Evento não reconhecido:', event);
  }

  res.status(200).json({ message: 'Postback processado e enviado ao Facebook!' });
});

export default router;
