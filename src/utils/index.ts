import axios from 'axios';

import { Crypto, SignalType } from '../model/index';
import { getDateFromTime, getLocaleString } from './date';

const TIME_FRAME = '86400';

export async function getOHLCs(exchange: string, symbol: string): Promise<any[]> {
    try {
        const url = `https://api.cryptowat.ch/markets/${exchange}/${symbol}/ohlc`;
        const options = {
            params: {
                after: (new Date().getTime() / 1000 - 86400 * 60).toFixed(0),
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

export function getSignalMessage(cryptos: Crypto[], dayOffset: number = 2): string {
    let msg = `🚀 Automatic update: ${getLocaleString()}`;

    for (let idx = 0; idx < cryptos.length; idx++) {
        const crypto = cryptos[idx];
        const dayIdx = crypto.signals.length - dayOffset;
        const signal = crypto.signals[dayIdx];

        const closingPrice = crypto.closingPrices[dayIdx];

        const time = crypto.times[dayIdx];
        const dateStr = getDateFromTime(time);
        if (signal !== 'none') {
            const signalEmoji = signal === 'buy' ? '🟢' : '🔴';
            msg += `\n ${dateStr} | ${crypto.exchange.toUpperCase()} | ${crypto.symbol.toUpperCase()} | ${signal.toUpperCase()} ${signalEmoji} at ${closingPrice}$`;
        }
    }

    return msg;
}
