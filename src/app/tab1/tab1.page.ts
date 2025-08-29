import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { SettingsService } from '../services/settings.service';

import { LeveragePickerPage } from '../leverage-picker/leverage-picker.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.css'],
  standalone: false,
})
export class Tab1Page {

    constructor(
        private settings: SettingsService,
        private modalCtrl: ModalController
    ) {}

    entry_price: number                     = 0;
    stop_loss_price: number                 = 0;
    take_profit: number                     = 0;
    leverage: number                        = 20;
    capital: number                         = 1000;
    desired_risk: number                    = 1;
    reward_risk: number                     = 0;

    distance_to_take_profit: number         = 0;
    distance_to_stop_loss: number           = 0;
    distance_to_take_profit_amount: number  = 0;
    position_size: number                   = 0;
    maker_fee: number                       = 0.02; // %
    taker_fee: number                       = 0.05; // %
    risk_capital: number                    = 0;
    recommended_leverage: number            = 0;
    margin_cost: number                     = 0;

    selected_platform: string = 'bingx';
    platforms = this.settings.platforms;

    ngOnInit(): void {
        // ---- leverage ophalen ----
        const tmp_leverage = localStorage.getItem('pref_leverage');
        if (tmp_leverage !== null) {
            this.leverage = parseInt(tmp_leverage, 10);
        }

        // ---- platform + fees ophalen ----
        const stored_platform   = localStorage.getItem('pref_platform');
        const stored_maker      = localStorage.getItem('pref_maker_fee');
        const stored_taker      = localStorage.getItem('pref_taker_fee');

        if (stored_platform) {
            this.selected_platform = stored_platform;
            // fees uit storage of fallback naar lijst
            if (stored_maker && stored_taker) {
                this.maker_fee = parseFloat(stored_maker);
                this.taker_fee = parseFloat(stored_taker);
            } else {
                const p = this.platforms.find(x => x.id === stored_platform);
                if (p) { this.maker_fee = p.maker_fee; this.taker_fee = p.taker_fee; }
            }
        } else {
            // init defaults wegschrijven
            localStorage.setItem('pref_platform', String(this.selected_platform));
            localStorage.setItem('pref_maker_fee', String(this.maker_fee));
            localStorage.setItem('pref_taker_fee', String(this.taker_fee));
        }
        this.calc();
    }


    on_platform_change(platform_id: string) {
        this.selected_platform = platform_id;
        const p = this.platforms.find(x => x.id === platform_id);
        if (p) {
            this.maker_fee = p.maker_fee;
            this.taker_fee = p.taker_fee;
        }
        // bewaren in localStorage
        localStorage.setItem('pref_platform', this.selected_platform);
        localStorage.setItem('pref_maker_fee', String(this.maker_fee));
        localStorage.setItem('pref_taker_fee', String(this.taker_fee));
    }

    calc() {
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
        console.log('distance_to_take_profit: ' + this.distance_to_take_profit);

        this.distance_to_stop_loss = (Math.abs((this.entry_price - this.stop_loss_price) / this.entry_price));
        console.log('distance_to_stop_loss: ' + this.distance_to_stop_loss);

        this.position_size = (this.capital*calc_desired_risk)/((calc_maker_fee+calc_taker_fee)+(1-calc_taker_fee)*this.distance_to_stop_loss);
        this.position_size = Number.isFinite((this.position_size))
            ? this.position_size
            : 0;
        console.log('position_size: ' + this.position_size);

        this.distance_to_take_profit_amount = ((this.position_size+(this.position_size*this.distance_to_take_profit))-this.position_size*calc_maker_fee-((this.position_size+(this.position_size*this.distance_to_take_profit))*calc_taker_fee)-this.position_size);
        console.log('distance_to_take_profit_amount: ' + this.distance_to_take_profit_amount);

        this.reward_risk = (this.distance_to_take_profit_amount / calc_risk_capital);
        this.reward_risk = Number.isFinite((this.reward_risk))
            ? this.reward_risk
            : 0;
        console.log('reward_risk: ' + this.reward_risk);

        this.recommended_leverage = this.get_recommended_leverage(this.distance_to_stop_loss);
        console.log('recommended_leverage: ' + this.recommended_leverage);

        this.margin_cost = this.position_size / this.leverage;
        // console.log('margin_cost: ' + this.margin_cost);

        if (Number.isFinite(this.recommended_leverage)) {
            this.recommended_leverage = 0;
        }

    }

    get_recommended_leverage(distance_to_sl: number): number {
        if (distance_to_sl < 0.01) {
            distance_to_sl = distance_to_sl * 100;
        }

        const leverage_table = [
            { max: 0.52, lev: 75 },
            { max: 1.00, lev: 50 },
            { max: 1.52, lev: 35 },
            { max: 2.25, lev: 25 },
            { max: 3.00, lev: 15 },
        ];
        
        // distance_to_sl hier als percentage, bv. 1.23 voor 1.23%
        for (const row of leverage_table) {
            if (distance_to_sl <= row.max) {
                return row.lev;
            }
        }
        return 15; // minimum
    }


    reset() {
        this.entry_price            = 0; 
        this.stop_loss_price        = 0; 
        this.take_profit            = 0; 
        this.leverage               = 0; 
        this.reward_risk            = 0;
        this.position_size          = 0;
        this.recommended_leverage   = 0;
        this.margin_cost            = 0;
        
        const tmp_leverage = localStorage.getItem('pref_leverage');
        if (tmp_leverage !== null) {
            this.leverage = parseInt(tmp_leverage, 10);
        }
        // this.entry_price            = 4.78;
        // this.stop_loss_price        = 4.75;
        // this.take_profit            = 4.97;
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
        });

        await modal.present();
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
