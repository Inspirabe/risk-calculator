import { Component, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

import { SettingsService } from '../../services/settings.service';
import { LeveragePickerPage } from '../leverage-picker/leverage-picker.page';
import { RiskPctPickerPage } from '../risk-pct-picker/risk-pct-picker.page';
import { CapitalPickerPage } from '../capital-picker/capital-picker.page';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.css'],
    standalone: false,
})

export class Tab3Page implements OnInit, ViewWillEnter {

    constructor(
        public settings: SettingsService,
        private modalCtrl: ModalController
    ) {}

    is_dark_mode: boolean               = false;
    apply_recom_leverage: boolean       = false;
    leverage: number                    = 20; 
    desired_risk: number                = 1;
    risk_capital: number                = (this.settings.capital * (this.desired_risk / 100))
    platforms                           = this.settings.platforms;

    async ngOnInit(): Promise<void> {
        await this.settings.loadPlatforms();

        const stored = localStorage.getItem('pref_dark_mode');
        if (stored !== null) {
            this.is_dark_mode = stored === 'true';
        } else {
            this.is_dark_mode = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
        }
        this.apply_theme(this.is_dark_mode);

        if (stored === null && window.matchMedia) {
            const mq = window.matchMedia('(prefers-color-scheme: dark)');
            mq.addEventListener?.('change', (e) => {
                this.is_dark_mode = e.matches;
                this.apply_theme(this.is_dark_mode);
            });
        }

        const tmp_leverage = localStorage.getItem('pref_leverage');
        if (tmp_leverage !== null) {
            this.leverage = parseInt(tmp_leverage, 10);
        }

        const tmp_desired_risk = localStorage.getItem('desired_risk');
        if (tmp_desired_risk !== null) {
            this.desired_risk = parseInt(tmp_desired_risk, 10);
        }
        
        const storedRecomLeverage = localStorage.getItem('apply_recom_leverage');
        if (storedRecomLeverage !== null) {
            this.apply_recom_leverage = storedRecomLeverage === 'true';
        }
        this.settings.setApplyRecomLeverage(this.apply_recom_leverage);
    }

    ionViewWillEnter(): void {
        const stored = localStorage.getItem('pref_dark_mode');
        this.is_dark_mode =
        stored !== null ? stored === 'true' : document.body.classList.contains('dark');

        const tmp_leverage = localStorage.getItem('pref_leverage');
        if (tmp_leverage !== null) this.leverage = parseInt(tmp_leverage, 10);

        const tmp_capital = localStorage.getItem('capital');
        if (tmp_capital !== null) this.settings.capital = parseInt(tmp_capital, 10);

        const tmp_desired_risk = localStorage.getItem('desired_risk');
        if (tmp_desired_risk !== null) this.desired_risk = parseInt(tmp_desired_risk, 10);
    }

    setDarkMode(dark: boolean): void {
        localStorage.setItem('pref_dark_mode', String(dark));
        this.apply_theme(dark);
    }
    
    async openRiskPct() {
        const modal = await this.modalCtrl.create({
            component: RiskPctPickerPage,
            componentProps: { value: this.desired_risk, min: 1, max: 20, title: 'Edit Desired Risk' },
            breakpoints: [0, 0.4, 0.9],
            initialBreakpoint: 0.9,
        });

        modal.onDidDismiss().then(({ data }) => {
            if (typeof data === 'number') {
                this.desired_risk = data;
                localStorage.setItem('desired_risk', String(data));
            }
        });

        await modal.present();
    }

    async openCapital() {
        const modal = await this.modalCtrl.create({
            component: CapitalPickerPage,
            componentProps: { value: this.settings.capital, min: 1000, max: 100000, title: 'Edit Capital' },
            breakpoints: [0, 0.4, 0.9],
            initialBreakpoint: 0.9,
        });

        modal.onDidDismiss().then(({ data }) => {
            if (typeof data === 'number') {
                this.settings.capital = data;
                localStorage.setItem('capital', String(data));
            }
        });

        await modal.present();
    }
    
    async openLeverage() {
        const modal = await this.modalCtrl.create({
            component: LeveragePickerPage,
            componentProps: { value: this.leverage, min: 1, max: 100, title: 'Edit Leverage' },
            breakpoints: [0, 0.4, 0.9],
            initialBreakpoint: 0.9, // voelt als een sheet zoals in je screenshot
        });

        modal.onDidDismiss().then(({ data }) => {
            if (typeof data === 'number') {
                this.leverage = data;
                localStorage.setItem('pref_leverage', String(data));
            }
        });

        await modal.present();
    }

    onPlatformChange(platform_id: string) {
        this.settings.switchPlatform(platform_id);
    }

    setApplyRecommendedLeverage(applyRecommandedLeverage: boolean) {
        this.settings.setApplyRecomLeverage(applyRecommandedLeverage);
    }
     
    onClientInput(ev: CustomEvent) {
        const raw = String(ev.detail?.value ?? '');
        this.settings.setUserClientUID(raw);
    }

    async selectAll(ev: CustomEvent) {
        const ionInput = ev.target as any;
        if (!ionInput?.getInputElement) return;

        const input: HTMLInputElement = await ionInput.getInputElement();

        setTimeout(() => {
            const val = input.value ?? '';
            try { input.setSelectionRange(0, String(val).length); } catch {}
        }, 0);
    }

    formatCurrency(val: number): string {
        if (val == null) return '';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(val);
    }

    formatPct(val: number): string {
        if (val == null) return '';
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            maximumFractionDigits: 0
        }).format(val / 100); // expects decimal, so divide by 100
    }
    
    private apply_theme(dark: boolean): void {
        document.body.classList.toggle('dark', dark);            // Ionic vars
        document.documentElement.classList.toggle('dark', dark); // Tailwind
        document.documentElement.setAttribute('color-theme', dark ? 'dark' : 'light');
    }
}
