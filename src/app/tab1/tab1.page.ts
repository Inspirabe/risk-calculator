import { Component } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';

import { SettingsService } from '../../services/settings.service';
import { ApiAuthService } from '../../services/api-auth.service';
import { LogTradeService, TradePayload } from '../../services/log-trade.service'

import { LeveragePickerPage } from '../leverage-picker/leverage-picker.page';
import { SymbolPickerPage } from '../symbol-picker/symbol-picker.page';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.css'],
    standalone: false,
})

export class Tab1Page {
    constructor(
        public settings: SettingsService,
        private auth: ApiAuthService,
        private modalCtrl: ModalController,
        private LogTrade: LogTradeService,
        private toast: ToastController
    ) {}

    submitting:boolean = false;
    submittingTrade:boolean = false;
    tradeLogged:boolean = false;
    showLogTrade:boolean = true;

    entry_price_raw: string = '';
    stop_loss_price_raw: string = '';
    take_profit_raw: string = '';
    
    selected_symbol: string = '';

    entry_price: number                     = 0;
    stop_loss_price: number                 = 0;
    take_profit: number                     = 0;
    leverage: number                        = 20;
    capital: number                         = 1000;
    desired_risk: number                    = 1;
    risk_reward: number                     = 0;

    distance_to_take_profit: number         = 0;
    distance_to_stop_loss: number           = 0;
    distance_to_take_profit_amount: number  = 0;
    position_size: number                   = 0;
    maker_fee: number                       = 0.02;
    taker_fee: number                       = 0.05;
    risk_capital: number                    = 0;
    recommended_leverage: number            = 10;
    margin_cost: number                     = 0;

    ngOnInit(): void {
        // ---- leverage ophalen ----
        const tmp_leverage = localStorage.getItem('pref_leverage');
        if (tmp_leverage !== null) {
            this.leverage = parseInt(tmp_leverage, 10);
        }
        this.calc();
    }

    calc() {
        if(!this.isPos(this.entry_price) || !this.isPos(this.stop_loss_price) || !this.isPos(this.take_profit)){
            return;
        }


        const tmp_capital = localStorage.getItem('capital');
        if (tmp_capital !== null) {
            this.capital = parseInt(tmp_capital, 10);
        }
        const tmp_desired_risk = localStorage.getItem('desired_risk');
        if (tmp_desired_risk !== null) {
            this.desired_risk = parseInt(tmp_desired_risk, 10);
        }
        const calc_desired_risk             = (this.desired_risk / 100)
        const calc_maker_fee                = (this.maker_fee / 100)
        const calc_taker_fee                = (this.taker_fee / 100)
        const calc_risk_capital             = (this.capital * (this.desired_risk / 100));

        this.distance_to_take_profit = Math.abs((this.entry_price - this.take_profit) / this.entry_price);
        // console.log('distance_to_take_profit: ' + this.distance_to_take_profit);

        this.distance_to_stop_loss = (Math.abs((this.entry_price - this.stop_loss_price) / this.entry_price));
        // console.log('distance_to_stop_loss: ' + this.distance_to_stop_loss);

        this.position_size = (this.capital*calc_desired_risk)/((calc_maker_fee+calc_taker_fee)+(1-calc_taker_fee)*this.distance_to_stop_loss);
        this.position_size = Number.isFinite((this.position_size))
            ? this.position_size
            : 0;
        // console.log('position_size: ' + this.position_size);

        this.distance_to_take_profit_amount = ((this.position_size+(this.position_size*this.distance_to_take_profit))-this.position_size*calc_maker_fee-((this.position_size+(this.position_size*this.distance_to_take_profit))*calc_taker_fee)-this.position_size);
        // console.log('distance_to_take_profit_amount: ' + this.distance_to_take_profit_amount);

        this.risk_reward = (this.distance_to_take_profit_amount / calc_risk_capital);
        this.risk_reward = Number.isFinite((this.risk_reward))
            ? this.risk_reward
            : 0;
        // console.log('risk_reward: ' + this.risk_reward);

        this.recommended_leverage = this.get_recommended_leverage(this.distance_to_stop_loss);
        // console.log('recommended_leverage: ' + this.recommended_leverage);

        this.margin_cost = this.position_size / this.leverage;
    }

    get_recommended_leverage(distance_to_sl: number): number {
        if (distance_to_sl < 0.50) {
            distance_to_sl = distance_to_sl * 100;
        }

        const leverage_table = [
            { max: 0.52, lev: 75 },
            { max: 1.00, lev: 50 },
            { max: 1.52, lev: 35 },
            { max: 2.25, lev: 25 },
            { max: 3.00, lev: 10 },
        ];
        
        // distance_to_sl hier als percentage, bv. 1.23 voor 1.23%
        for (const row of leverage_table) {
            if (distance_to_sl <= row.max) {
                return row.lev;
            }
        }
        // Minimale waarde van leverage_table.lev
        return Math.min(...leverage_table.map(r => r.lev));
    }

    reset() {
        // clear what the user sees (inputs)
        this.entry_price_raw = '';
        this.stop_loss_price_raw = '';
        this.take_profit_raw = '';

        // clear numeric models
        this.entry_price            = 0; 
        this.stop_loss_price        = 0; 
        this.take_profit            = 0; 
        this.leverage               = 0; 
        this.risk_reward            = 0;
        this.position_size          = 0;
        this.recommended_leverage   = 10;
        this.margin_cost            = 0;

        const tmp_leverage = localStorage.getItem('pref_leverage');
        if (tmp_leverage !== null) {
            this.leverage = parseInt(tmp_leverage, 10);
        }

        this.submitting = false;
        this.submittingTrade = false;
        this.tradeLogged = false;
        this.showLogTrade = true;
    }

    onEntryBlur() {
        const n = this.toNum(this.entry_price_raw);
        this.entry_price = Number.isFinite(n) ? n : 0;
        this.calc();
    }

    onStopLossBlur() {
        const n = this.toNum(this.stop_loss_price_raw);
        this.stop_loss_price = Number.isFinite(n) ? n : 0;
        this.calc();
    }

    onTakeProfitBlur() {
        const n = this.toNum(this.take_profit_raw);
        this.take_profit = Number.isFinite(n) ? n : 0;
        this.calc();
    }

    applyRecommendedLeverage(): void {
        const lev = Math.round(this.recommended_leverage || 0);
        if (!Number.isFinite(lev) || lev <= 0) return;

        this.leverage = lev;
        localStorage.setItem('pref_leverage', String(lev));

        this.calc();
    }

    async logTrade() {
        if (!this.readyToLog()) {
            this.presentToast('Fill all fields first', 'warning');
            return;
        }

        if (this.submitting) return;
        this.submitting = true;

        const uuid = (crypto as any).randomUUID ? (crypto as any).randomUUID() :
                    Math.random().toString(36).slice(2) + Date.now();

        const payload: TradePayload = {
            idempotency_key: uuid,
            user_id: 1,
            platform: this.settings.selected_platform,
            maker_fee_pct: this.maker_fee,
            taker_fee_pct: this.taker_fee,
            symbol: 'QVQX',
            entry_price: this.entry_price,
            take_profit: this.take_profit,
            stop_loss: this.stop_loss_price,
            leverage: Math.round(this.leverage),
            position_size: this.position_size,
            risk_reward: this.risk_reward,
            margin_cost: this.margin_cost
        };

        try {
            const token = await this.auth.getToken();
            const res = await this.LogTrade.logTrade(payload, token).toPromise();
            if (res?.ok) {
                this.presentToast('Trade logged', 'success');

                if(this.settings.selected_platform != ''){
                    this.showLogTrade = false;
                }else{
                    this.submitting = true;
                }
            } else {
                this.presentToast('Could not log trade', 'danger');
            }
        } catch (e: any) {
            this.presentToast(e?.error?.message || 'Network/API error', 'danger');
        } finally {
            this.submitting = false;
            this.tradeLogged = true;
        }
    }

    async placeTrade() {
        if (this.submittingTrade) return;

        this.submittingTrade = true;

        this.presentToast('Trade placed on ' + this.settings.platform_label, 'success');
        this.showLogTrade = true;
        
        try {
        //     // optioneel: token uit settings/localStorage
        //     const token = await this.auth.getToken();
        //     const res = await this.LogTrade.logTrade(payload, token).toPromise();
        //     if (res?.ok) {
                    // this.presentToast('Trade placed on ' + this.settings.platform_label, 'success');
                    // this.showLogTrade = true;
                    this.submittingTrade = false;
        //     } else {
        //         this.presentToast('Could not place trade', 'danger');
        //     }
        // } catch (e: any) {
        //     this.presentToast(e?.error?.message || 'Network/API error', 'danger');
        } finally {
            this.submittingTrade = false;
            this.reset();
        }
    }

    public async presentToast(message: string, color: 'success'|'warning'|'danger'|'medium') {
        const t = await this.toast.create({ 
            message: message, 
            duration: 3000, 
            color: color, 
            position: 'top',
            cssClass: 'toast-below-header',
            buttons: [
                {
                    side: 'start',
                    icon: color === 'success' ? 'checkmark-circle' : 'alert-circle',
                }
            ]
        });
        await t.present();
    }

    readyToLog(): boolean {
        return this.isPos(this.entry_price) && this.isPos(this.stop_loss_price) && this.isPos(this.take_profit);
    }

    async openLeverage() {
        const modal = await this.modalCtrl.create({
            component: LeveragePickerPage,
            componentProps: { value: this.leverage, min: 1, max: 100, title: 'Edit Leverage' },
            breakpoints: [0, 0.4, 0.9],
            initialBreakpoint: 0.9, // voelt als een sheet zoals in je screenshot
        });

        modal.onDidDismiss().then(({ data }) => {
            if (typeof data === 'number') this.leverage = data;
            this.calc();
        });

        await modal.present();
    }

    async openSymbolPicker() {
        console.log('openSymbolPicker called')
        
        const modal = await this.modalCtrl.create({
            component: SymbolPickerPage,
            breakpoints: [0, 0.9],
            initialBreakpoint: 0.9
        });

        modal.onDidDismiss().then(({ data }) => {
            if (data) {
                this.selected_symbol = data; // symbool uit modal
            }
        });

        await modal.present();
    }

    async selectAll(ev: CustomEvent) {
        const el = ev.target as HTMLIonInputElement;
        if (!('getInputElement' in el)) return;
        const input = await (el as any).getInputElement();
        setTimeout(() => {
            const v = input.value ?? '';
            try { input.setSelectionRange(0, String(v).length); } catch {}
        }, 0);
    }

    private toNum(v: any): number {
        // accepteer "123,45" en "123.45", lege -> NaN
        if (v === null || v === undefined) return NaN;
        if (typeof v === 'string') v = v.replace(',', '.').trim();
        const n = Number(v);
        return Number.isFinite(n) ? n : NaN;
    }

    private isPos(n: number) { return Number.isFinite(n) && n > 0; }

}
