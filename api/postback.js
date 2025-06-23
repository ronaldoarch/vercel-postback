
import axios from 'axios';

export default async function handler(req, res) {
  const { click_id, event, value } = req.query;

  if (!click_id || !event) {
    return res.status(400).json({ error: 'Missing click_id or event parameter' });
  }

  const pixelId = '3656416541168561';
  const accessToken = 'EAAbcxz0GujEBOZCe8IpCMsvEV89Bbke2716rThUQO8c5TNZAoGZAbirZCP6k0e3Wo5FLZCd8mkguINR2MVgb42tkMPZBFREAmeZBAp9ZAG7tFZBv2g1r4v2oCnx8Ro2ZCz7tkZCSBzIkji9vZAw7gV2GWZBefd81UpZBw1mQUysuxMZByjuHnRUaepyWEpHBD1IX8PELYYAvAZDZD';

  let eventName = event === 'register' ? 'Lead' : event === 'sale' ? 'Purchase' : 'PageView';

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: `https://cleverplayer.net/midas?afftid=${click_id}`,
        user_data: {}
      }
    ]
  };

  if (eventName === 'Purchase' && value) {
    payload.data[0].custom_data = { value: parseFloat(value), currency: 'BRL' };
  }

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
