import axios from 'axios';

const TIME_IDX = 0;
const CLOSING_PRICE_IDX = 4;

export async function getOHLCs(url) {
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

export function calculateEMAs(prices: number[], length: number, smoothing = 2) {
  let EMAs = [];
  const k = smoothing / (length + 1);

  EMAs.push(prices.slice(0, length).reduce((total, current) => total + current, 0) / length);
  for (const price of prices.slice(length)) {
    EMAs.push(price * k + EMAs[EMAs.length - 1] * (1 - k));
  }
  return EMAs;
}
