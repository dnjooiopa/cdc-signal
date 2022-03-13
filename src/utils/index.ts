import axios from 'axios';

export async function getOHLC(url) {
  try {
    const response = await axios.get(url, {
      params: {
        after: (new Date().getTime() / 1000 - 86400 * 60).toFixed(0),
        periods: '86400',
      },
    });
    return response.data.result['86400'];
  } catch (err) {
    console.log('🔴 makeRequest error:', err.message);
    return undefined;
  }
}
