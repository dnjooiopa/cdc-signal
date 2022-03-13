import path from 'path';
import { calculateEMAs, getOHLCs, getSignal } from 'src/utils';
import { fileExists, readFile, saveFile } from 'src/utils/file';

import global from './global';
import { SignalType } from './model/index';

const TIME_IDX = 0;
const CLOSING_PRICE_IDX = 4;
const DATA_PATH = path.join(__dirname, 'data.json');

export async function init() {
    if (!fileExists(DATA_PATH)) {
        const defaultData = readFile(path.join(__dirname, 'data.default.json'));
        saveFile(DATA_PATH, defaultData);
    }
    global.state = JSON.parse(readFile(DATA_PATH));
    await update();
}

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
            console.log('Length too short', exchange, symbol);
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
    saveFile(DATA_PATH, JSON.stringify(global.state));
}
