import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { ApiAuthService } from '../../services/api-auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.css'],
  standalone: false,
})
export class TabsPage implements OnInit {

    isMobile: boolean = false;

    constructor(
        public settings: SettingsService,
        private http: HttpClient,
        private auth: ApiAuthService
    ) {}

    async ngOnInit(): Promise<void> {
        let tmp_capital = localStorage.getItem('capital');
        if (tmp_capital !== null) {
            this.settings.capital = parseInt(tmp_capital, 10);
        }

        await this.settings.loadPlatforms();
    }
}

export interface platform{
    id: string,
    label: string,
    maker_fee: number,
    taker_fee: number
}