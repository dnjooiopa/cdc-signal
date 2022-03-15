import global from '../global';
import { SignalObject, SignalType } from '../model/index';
import { getDateFromTime, getLocaleString } from './date';

export function getSignal(fastEma: number, fastEmaPrev: number, slowEma: number, slowEmaPrev: number): SignalType {
    if (fastEma > slowEma && fastEmaPrev < slowEmaPrev) {
        return 'buy';
    } else if (fastEma < slowEma && fastEmaPrev > slowEmaPrev) {
        return 'sell';
    } else {
        return 'none';
    }
}

export function getSignalMessage(dayOffset: number = 2): string {
    let msg = `🚀 Automatic update: ${getLocaleString()}`;
    const { cryptos } = global.state;

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

export function getSignalObject(): SignalObject[] {
    const signals: SignalObject[] = [];
    const { cryptos } = global.state;

    for (let idx = 0; idx < cryptos.length; idx++) {
        const crypto = cryptos[idx];
        const dayIdx = crypto.signals.length - 2;
        const signalType = crypto.signals[dayIdx];

        if (signalType !== 'none') {
            signals.push({
                name: crypto.symbol.replace('usdt', ''),
                pair: 'busd',
                order: signalType,
            });
        }
    }
    return signals;
}
