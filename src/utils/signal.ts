import global from '../global';
import { SignalObject, SignalType } from '../model/index';
import { getDateFromTime, getLocaleString } from './date';

const signalEmoji = {
    buy: '🟢',
    sell: '🔴',
    none: '',
};

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
            msg += `\n${
                signalEmoji[signal]
            } ${dateStr} | ${crypto.exchange.toUpperCase()} | ${crypto.symbol.toUpperCase()} | ${signal.toUpperCase()} at ${closingPrice}$`;
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

export function getAllSignal(dayOffset: number = 2): string {
    let msg = `🚀 All signals: ${getLocaleString()}`;
    const { cryptos } = global.state;

    for (let idx = 0; idx < cryptos.length; idx++) {
        const crypto = cryptos[idx];
        const dayIdx = crypto.signals.length - dayOffset;
        const signal = crypto.signals[dayIdx];

        const closingPrice = crypto.closingPrices[dayIdx];

        const time = crypto.times[dayIdx];
        const dateStr = getDateFromTime(time);

        msg += `\n ${dateStr} | ${crypto.exchange.toUpperCase()} | ${crypto.symbol.toUpperCase()} | ${signal.toUpperCase()} ${
            signalEmoji[signal]
        } at ${closingPrice}$`;
    }
    return msg;
}
