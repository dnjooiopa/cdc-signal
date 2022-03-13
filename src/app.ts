import fs from 'fs';
import path from 'path';
import { calculateEMAs, getOHLCs, readFile, saveFile, fileExists } from 'src/utils';

import { GlobalState } from './model';

let globalStates: GlobalState | undefined;
const TIME_IDX = 0;
const CLOSING_PRICE_IDX = 4;
const DATA_PATH = path.join(__dirname, 'data.json');

export async function init() {
    if (!fileExists(DATA_PATH)) {
        const defaultData = readFile(path.join(__dirname, 'data.default.json'));
        saveFile(DATA_PATH, defaultData);
    }
    globalStates = JSON.parse(readFile(DATA_PATH));
    await update();
}

async function update() {
    for (const exchangeSymbol of globalStates.exchangeSymbols) {
        const { exchange, symbol } = exchangeSymbol;
        console.log('Fetching', exchange, symbol);

        const crypto = globalStates.cryptos.find((c) => c.symbol === symbol);
        if (crypto && crypto.times[crypto.times.length - 1] > new Date().getTime()) {
            console.log('Already updated', exchange, symbol);
            continue;
        }

        const ohlcs = await getOHLCs(exchange, symbol);
        if (ohlcs.length < 30) {
            console.log('Length too short', exchange, symbol);
            continue;
        }

        const closingPrices = ohlcs.map((o) => o[CLOSING_PRICE_IDX]);
        const slowLength = 26;
        const fastLength = 12;
        const slowEMAs = calculateEMAs(closingPrices, slowLength);
        const fastEMAs = calculateEMAs(closingPrices, fastLength).slice(slowLength - fastLength);
        const times = ohlcs.map((o) => o[TIME_IDX] * 1000).slice(slowLength - 1);

        globalStates.cryptos.push({
            symbol,
            exchange,
            times,
            closingPrices,
            fastEMAs,
            slowEMAs,
        });

        console.log('Successfully fetched', exchange, symbol);
    }
    saveFile(DATA_PATH, JSON.stringify(globalStates));
}
