import global from '../global';
import { SignalType } from '../model/index';
import { getOHLCs } from './cryptowatch';
import { saveFile } from './file';
import { calculateEMAs } from './math';
import { getSignal } from './signal';

const TIME_IDX = 0;
const CLOSING_PRICE_IDX = 4;

export async function update() {
    for (const exchangeSymbol of global.state.exchangeSymbols) {
        const { exchange, symbol } = exchangeSymbol;
        console.log('---------------------------------------------');
        console.log('Fetching', exchange, symbol);

        const crypto = global.state.cryptos.find((c) => c.symbol === symbol);
        if (crypto && crypto.times[crypto.times.length - 1] > new Date().getTime()) {
            console.log('Already updated', exchange, symbol);
            continue;
        }

        const ohlcs = await getOHLCs(exchange, symbol);
        if (ohlcs.length < 30) {
            console.log('Length too short or symbol not found', exchange, symbol);
            continue;
        }

        let closingPrices = ohlcs.map((o) => o[CLOSING_PRICE_IDX]);

        const slowLength = 26;
        const fastLength = 12;
        const slowEMAs = calculateEMAs(closingPrices, slowLength);
        const fastEMAs = calculateEMAs(closingPrices, fastLength).slice(slowLength - fastLength);

        closingPrices = closingPrices.slice(slowLength - 1);

        const times = ohlcs.map((o) => o[TIME_IDX] * 1000).slice(slowLength - 1);

        let signals: SignalType[] = ['none'];
        for (let idx = 1; idx < times.length; idx++) {
            const signal = getSignal(fastEMAs[idx], fastEMAs[idx - 1], slowEMAs[idx], slowEMAs[idx - 1]);
            signals.push(signal);
        }

        global.state.cryptos = global.state.cryptos.filter((c) => c.symbol !== symbol);
        global.state.cryptos.push({
            symbol,
            exchange,
            times,
            closingPrices,
            fastEMAs,
            slowEMAs,
            signals,
        });

        console.log('Successfully fetched', exchange, symbol);
    }
    console.log('----------------------------------------------');
    saveFile(global.DATA_PATH, JSON.stringify(global.state));
}

export async function addSymbol(exchange: string, symbol: string): Promise<string> {
    const existingSymbol = global.state.exchangeSymbols.find((es) => es.symbol === symbol && es.exchange === exchange);
    let msg = `\`${exchange.toUpperCase()}|${symbol.toUpperCase()}\` is already existed.`;
    if (!existingSymbol) {
        const ohlcs = await getOHLCs(exchange, symbol);
        if (ohlcs.length < 30) {
            msg = `Length too short or symbol not found: \`${exchange.toUpperCase()}|${symbol.toUpperCase()}\``;
        } else {
            global.state.exchangeSymbols.push({
                exchange,
                symbol,
            });
            await update();
            msg = `\`${exchange.toUpperCase()}|${symbol.toUpperCase()}\` has been added.`;
        }
    }
    return msg;
}

export async function removeSymbol(exchange: string, symbol: string): Promise<string> {
    const existingSymbol = global.state.exchangeSymbols.find((es) => es.symbol === symbol && es.exchange === exchange);
    let msg = `\`${exchange.toUpperCase()}|${symbol.toUpperCase()}\` is not existed.`;
    if (existingSymbol) {
        const { exchangeSymbols, cryptos } = global.state;
        global.state.exchangeSymbols = exchangeSymbols.filter(
            (es) => !(es.symbol === symbol && es.exchange === exchange)
        );
        global.state.cryptos = cryptos.filter((c) => !(c.symbol === symbol && c.exchange === exchange));
        saveFile(global.DATA_PATH, JSON.stringify(global.state));
        msg = `\`${exchange.toUpperCase()}|${symbol.toUpperCase()}\` has been removed.`;
    }
    return msg;
}
