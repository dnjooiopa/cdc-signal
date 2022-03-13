import { SignalType } from './../model/index';
import axios from 'axios';

const TIME_IDX = 0;
const CLOSING_PRICE_IDX = 4;
const TIME_FRAME = '86400';

export async function getOHLCs(url): Promise<number[]> {
    try {
        const options = {
            params: {
                after: (new Date().getTime() / 1000 - 86400 * 180).toFixed(0),
                periods: TIME_FRAME,
            },
        };
        const response = await axios.get(url, options);
        return response.data.result[TIME_FRAME];
    } catch (err) {
        console.log('🔴 makeRequest error:', err.message);
        return [];
    }
}

export function calculateEMAs(prices: number[], length: number, smoothing = 2): number[] {
    let EMAs = [];
    const k = smoothing / (length + 1);

    EMAs.push(prices.slice(0, length).reduce((total, current) => total + current, 0) / length);
    for (const price of prices.slice(length)) {
        EMAs.push(price * k + EMAs[EMAs.length - 1] * (1 - k));
    }
    return EMAs;
}

export function getSignal(fastEma: number, fastEmaPrev: number, slowEma: number, slowEmaPrev: number): SignalType {
    if (fastEma > slowEma && fastEmaPrev < slowEmaPrev) {
        return 'buy';
    } else if (fastEma < slowEma && fastEmaPrev > slowEmaPrev) {
        return 'sell';
    } else {
        return 'none';
    }
}
