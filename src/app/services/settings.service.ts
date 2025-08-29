import { Injectable } from '@angular/core';

@Injectable({ 
    providedIn: 'root' 
})

export class SettingsService {

    constructor() { }

    // lijst met platforms en fees
    platforms = [
        { id: 'bingx',   label: 'BingX',    maker_fee: 0.02, taker_fee: 0.05 },
        { id: 'bybit',   label: 'Bybit',    maker_fee: 0.02, taker_fee: 0.055 },
        { id: 'binance', label: 'Binance',  maker_fee: 0.02, taker_fee: 0.06 },
        { id: 'okx',     label: 'OKX',      maker_fee: 0.02, taker_fee: 0.06 },
        { id: 'gmx',     label: 'GMX',      maker_fee: 0.04, taker_fee: 0.06 },
    ];
}


