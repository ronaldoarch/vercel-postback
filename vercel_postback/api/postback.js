import axios from 'axios';

import fetch from 'node-fetch';

async function sendToFacebook(clickId, eventName, value = null) {
  const pixelId = 'SEU_PIXEL_ID'; // 👉 Troque pelo seu Pixel ID real
  const accessToken = 'SEU_ACCESS_TOKEN'; // 👉 Troque pelo seu token de acesso da CAPI

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { click_id, event, value } = req.body;

  if (!click_id || !event) {
<<<<<<< HEAD
    return res.status(400).send('Faltando parâmetros obrigatórios: click_id e event');
  }

  // Mapeando os eventos vindos da casa de apostas para eventos do Meta
  if (event === 'register') {
    await sendToFacebook(click_id, 'Lead');
  } else if (event === 'sale') {
    await sendToFacebook(click_id, 'Purchase', value);
  } else {
    console.warn('Evento não reconhecido:', event);
  }

  res.status(200).send('Postback processado e enviado ao Facebook!');
=======
    return res.status(400).json({ error: 'Missing click_id or event' });
  }

  const pixelId = process.env.ID_PIXEL;
  const accessToken = process.env.TOKEN_DE_ACESSO;

  if (!pixelId || !accessToken) {
    return res.status(500).json({ error: 'Missing Pixel ID or Access Token in environment' });
  }

  const eventName = event === 'register' ? 'Lead' : event === 'sale' ? 'Purchase' : 'PageView';

  const payload = {
    data: [{
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: `https://cleverplayer.net/midas?afftid=${click_id}`,
      user_data: {},
      ...(eventName === 'Purchase' && value
        ? { custom_data: { value: parseFloat(value), currency: 'BRL' } }
        : {}),
    }]
  };

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
      payload
    );
    res.status(200).json({ success: true, fb_response: response.data });
  } catch (error) {
    res.status(500).json({ error: 'Meta CAPI error', details: error.response?.data || error.message });
  }
>>>>>>> 3460a72a5725c5ccb9a043901766b00e2900a002
}
