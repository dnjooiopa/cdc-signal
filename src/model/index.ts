export interface Crypto {
    symbol: string;
    times: number[];
    closingPrices: number[];
    ema12s: number[];
    ema26s: number[];
}

export type SignalType = 'none' | 'buy' | 'sell';
