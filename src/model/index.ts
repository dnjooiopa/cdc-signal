export interface Crypto {
    symbol: string;
    exchange: string;
    times: number[];
    closingPrices: number[];
    fastEMAs: number[];
    slowEMAs: number[];
    signals: SignalType[];
}

interface ExchangeSymbol {
    symbol: string;
    exchange: string;
}
export interface GlobalState {
    exchangeSymbols: ExchangeSymbol[];
    cryptos: Crypto[];
}

export interface SignalObject {
    name: string;
    pair: string;
    order: SignalType;
}

export type SignalType = 'none' | 'buy' | 'sell';
