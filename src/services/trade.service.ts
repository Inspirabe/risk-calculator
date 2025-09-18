import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

export interface TradePayload {
    idempotency_key: string;
    user_client_uid: string;
    platform: string;
    symbol: string;
    type: 'market' | 'limit';
    side: 'buy' | 'sell' | 'long' | 'short';
    leverage: number;
    amount: number;
    price?: number;
    take_profit?: number;
    stop_loss?: number;
}


@Injectable({
    providedIn: 'root'
})
export class TradeService {

    constructor(private http: HttpClient) {}

    placeTrade(payload: TradePayload, token?: string) {
        let headers = new HttpHeaders({'Content-Type': 'application/json'});
        if (token) headers = headers.set('Authorization', `Bearer ${token}`);
        headers = headers.set('Idempotency-Key', payload.idempotency_key);

        const url = `${environment.apiBaseUrl}/trade/`;
        
        console.log(url);

        return this.http.post<{id: string; ok: boolean}>(url, payload, { headers });
    }
}
