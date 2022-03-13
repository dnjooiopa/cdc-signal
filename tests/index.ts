import { calculateEMAs, getOHLCs } from 'src/utils';

const TIME_IDX = 0;
const CLOSING_PRICE_IDX = 4;

(async () => {
  console.log('🧪 makeRequest');
  const OHLCs = await getOHLCs('https://api.cryptowat.ch/markets/binance/btcusdt/ohlc');
  console.log(OHLCs[0]);

  console.log('🧪 calculateEMAs');
  const closingPrices = OHLCs.map((o) => o[CLOSING_PRICE_IDX]);
  const EMAs = calculateEMAs(closingPrices, 26);
  console.log(EMAs);
})();
