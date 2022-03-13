import { globalStates, init } from '../src/app';
import { calculateEMAs, getOHLCs, getSignal, getSignalMessage } from '../src/utils';

const TIME_IDX = 0;
const CLOSING_PRICE_IDX = 4;

(async () => {
    const start = new Date().getTime();
    await init();
    const end = new Date().getTime();
    console.log('Fetching time:', (end - start) / 1000, 'seconds.');

    console.log('🧪 makeRequest');

    const OHLCs = await getOHLCs('binance', 'btcusdt');
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

    console.log('🧪 getSignalMessage');
    const signalMessage = getSignalMessage(globalStates.cryptos);
    console.log(signalMessage);
})();
