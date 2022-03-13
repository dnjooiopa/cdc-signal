export interface Crypto {
    symbol: string;
    exchange: string;
    times: number[];
    closingPrices: number[];
    fastEMAs: number[];
    slowEMAs: number[];
}

interface ExchangeSymbol {
    symbol: string;
    exchange: string;
}
export interface GlobalState {
    exchangeSymbols: ExchangeSymbol[];
    cryptos: Crypto[];
}

export type SignalType = 'none' | 'buy' | 'sell';
