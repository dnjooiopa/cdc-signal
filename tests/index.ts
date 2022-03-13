import { getOHLC } from 'src/utils';

(async () => {
  console.log('🧪 makeRequest');
  const result = await getOHLC('https://api.cryptowat.ch/markets/binance/btcusdt/ohlc');
  console.log(result[0]);
})();
