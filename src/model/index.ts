export interface Crypto {
    symbol: string;
    exchange: string;
    times: number[];
    closingPrices: number[];
    ema12s: number[];
    ema26s: number[];
}

export interface GlobalState {
    symbols: string[];
    cryptos: Crypto[];
}

export type SignalType = 'none' | 'buy' | 'sell';
