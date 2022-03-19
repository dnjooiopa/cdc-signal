import axios from 'axios';
import config from '../config';

const TIME_FRAME = '86400';

export async function getOHLCs(exchange: string, symbol: string): Promise<any[]> {
    try {
        const url = `https://api.cryptowat.ch/markets/${exchange}/${symbol}/ohlc`;
        const options = {
            params: {
                after: (new Date().getTime() / 1000 - 86400 * 60).toFixed(0),
                periods: TIME_FRAME,
                apikey: config.API_KEY,
            },
        };
        const response = await axios.get(url, options);
        return response.data.result[TIME_FRAME];
    } catch (err) {
        console.log('🔴 makeRequest error:', err.message);
        return [];
    }
}
