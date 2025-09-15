// services/api-auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

type TokenResponse = { access_token: string; issued_at: number; expires_at: number };

@Injectable({ providedIn: 'root' })
export class ApiAuthService {
    constructor(
        private http: HttpClient,
    ) {}

    async getToken(): Promise<string> {
        const url = `${environment.apiBaseUrl}/get-token/`;
        const headers = new HttpHeaders({ 
            'client-id': environment.clientID,
            'client-secret': environment.clientSecret 
        });
        const res = await firstValueFrom(this.http.post<TokenResponse>(url, {}, { headers }));
        return res.access_token;
    }
}
