import { Injectable } from '@angular/core';
import { ApiAuthService } from './api-auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

export type PlatformRow = {
    id: string;
    label: string;
    maker_fee: number; // percent, e.g. 0.02 means 0.02%
    taker_fee: number; // percent, e.g. 0.05 means 0.05%
};

@Injectable({ 
    providedIn: 'root' 
})

export class SettingsService {
    constructor(
        private http: HttpClient, 
        private auth: ApiAuthService
    ) {}

    capital: number     = 1000;
    user_client_id      = localStorage.getItem('user_client_id') ?? '';
    selected_platform   = localStorage.getItem('pref_platform') ?? '';
    platform_label      = localStorage.getItem('platform_label') ?? '';
    maker_fee: number   = parseFloat(localStorage.getItem('pref_maker_fee') ?? '0.02');
    taker_fee: number   = parseFloat(localStorage.getItem('pref_taker_fee') ?? '0.05');

    platforms = [
        { id: 'bingx',   label: 'BingX',    maker_fee: 0.02, taker_fee: 0.05 }
    ];

    private loaded = false;

    async loadPlatforms(force = false): Promise<PlatformRow[]> {
        if (this.loaded && !force) return this.platforms;

        const url = `${environment.apiBaseUrl}/platform/`;
        const token = await this.auth.getToken();
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (token) headers = headers.set('Authorization', `Bearer ${token}`);

        try {
            const res = await firstValueFrom(this.http.get<PlatformRow[]>(url, { headers }));
            if (Array.isArray(res) && res.length) {
            // ensure numbers (in case backend sends strings)
            this.platforms = res.map(p => ({
                id: p.id,
                label: p.label,
                maker_fee: +p.maker_fee,
                taker_fee: +p.taker_fee,
            }));
            this.loaded = true;
            }
        } catch (e) {
            console.warn('Platforms fetch failed, using defaults', e);
        }
        return this.platforms;
    }

    switchPlatform(platform_id: string){
        this.selected_platform = platform_id;
        const p = this.platforms.find(x => x.id === platform_id);
        if (p) {
            this.platform_label = p.label;
            this.maker_fee = p.maker_fee;
            this.taker_fee = p.taker_fee;
        }else{
            this.platform_label = '';
        }

        localStorage.setItem('pref_platform', String(this.selected_platform));
        localStorage.setItem('platform_label', String(this.platform_label));
        localStorage.setItem('pref_maker_fee', String(this.maker_fee));
        localStorage.setItem('pref_taker_fee', String(this.taker_fee));
    }

    async loadMarkets(quote: string): Promise<any[]> {
        const token = await this.auth.getToken();
        const url = `${environment.apiBaseUrl}/markets/`;

        const params = {
            user_id: this.user_client_id,
            platform: this.selected_platform,
            quote: 'USDT'
        };
        
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (token) headers = headers.set('Authorization', `Bearer ${token}`);

        try {
            const res = await firstValueFrom(
                this.http.get<any[]>(url, { headers, params })
            );
            return res;
        } catch (e) {
            console.error('Markets fetch failed', e);
        return [];
        }
    }





    setClientID(user_client_id: string){
        localStorage.setItem('user_client_id', String(user_client_id));
    }

    /** ========================================================================== */

    /**
	 * Determines whether the application is running on a mobile device based on the user agent string.
	 * @group Method
	 * @returns {boolean} True if the application is running on a mobile device, otherwise false.
	 */
    isMobile = (): boolean =>
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		) ||
		(navigator.userAgent.includes('Mac') && 'ontouchend' in document);

	/**
	 * Determines whether the application is running on an iOS device based on the user agent string.
	 * @group Method
	 * @returns {boolean} True if the application is running on an iOS device, otherwise false.
	 */
	isIos = (): boolean =>
		/(iPad|iPhone|iPod)/g.test(navigator.userAgent);

}


