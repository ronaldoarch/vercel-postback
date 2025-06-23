import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { click_id, event, value } = req.body;

  if (!click_id || !event) {
    return res.status(400).json({ error: 'Missing click_id or event' });
  }

  const pixelId = process.env.PIXEL_ID;
  const accessToken = process.env.ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    return res.status(500).json({ error: 'Missing Pixel ID or Access Token' });
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
}
