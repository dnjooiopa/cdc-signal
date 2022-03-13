import { calculateEMAs, getOHLCs, getSignal } from '../src/utils';

const TIME_IDX = 0;
const CLOSING_PRICE_IDX = 4;

(async () => {
    console.log('🧪 makeRequest');
    const name = 'btc';
    const pair = 'usdt';

    const OHLCs = await getOHLCs(`https://api.cryptowat.ch/markets/binance/${name}${pair}/ohlc`);
    console.log(OHLCs[0]);

    console.log('🧪 calculateEMAs');
    const closingPrices = OHLCs.map((o) => o[CLOSING_PRICE_IDX]);
    const slowLength = 26;
    const fastLength = 12;
    const slowEMAs = calculateEMAs(closingPrices, slowLength);
    const fastEMAs = calculateEMAs(closingPrices, fastLength).slice(slowLength - fastLength);
    console.log(fastEMAs.slice(0, 10));

    console.log('🧪 getSignal');
    const times = OHLCs.map((o) => o[TIME_IDX] * 1000).slice(slowLength - 1);
    for (let idx = 1; idx < times.length; idx++) {
        const signal = getSignal(fastEMAs[idx], fastEMAs[idx - 1], slowEMAs[idx], slowEMAs[idx - 1]);
        console.log(new Date(times[idx]), signal);
    }
})();
