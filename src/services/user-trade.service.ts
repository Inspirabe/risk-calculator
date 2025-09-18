import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

export interface UserTradePayload {
    idempotency_key: string;
    user_client_uid: string;
    platform: string;
    maker_fee_pct: number;
    taker_fee_pct: number;
    symbol: string;
    entry_price: number;
    take_profit: number;
    stop_loss: number;
    leverage: number;
    position_size: number;
    risk_reward: number;
    margin_cost: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserTradeService {

    constructor(private http: HttpClient) {}

    userTrade(payload: UserTradePayload, token?: string) {
        let headers = new HttpHeaders({'Content-Type': 'application/json'});
        if (token) headers = headers.set('Authorization', `Bearer ${token}`);
        headers = headers.set('Idempotency-Key', payload.idempotency_key);

        const url = `${environment.apiBaseUrl}/user-trade/`;
        return this.http.post<{id: string; ok: boolean}>(url, payload, { headers });
    }
}
