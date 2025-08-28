import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LeveragePickerPage } from '../leverage-picker/leverage-picker.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.css'],
  standalone: false,
})
export class Tab1Page {
    entry = 100;
    stop = 95;
    tp = 110;
    leverage = 20;

    // Deze zou je uit Settings / Capital kunnen ophalen via service of store:
    capital = 1000;     // demo
    riskPct = 0;

    // lijst met platforms en fees
    platforms = [
        { id: 'bingx',   label: 'BingX',    maker_fee: 0.02, taker_fee: 0.05 },
        { id: 'bybit',   label: 'Bybit',    maker_fee: 0.02, taker_fee: 0.055 },
        { id: 'binance', label: 'Binance',  maker_fee: 0.02, taker_fee: 0.06 },
        { id: 'okx',     label: 'OKX',      maker_fee: 0.02, taker_fee: 0.06 },
        { id: 'gmx',     label: 'GMX',      maker_fee: 0.04, taker_fee: 0.06 },
        // voeg er gerust meer bij
    ];

    // selectie + “hidden” fee-waarden
    selected_platform: string = 'bingx';
    maker_fee: number = 0.02; // %
    taker_fee: number = 0.05; // %


    ngOnInit(): void {
        // ---- leverage ophalen ----
        const tmp_leverage = localStorage.getItem('pref_leverage');
        if (tmp_leverage !== null) {
            this.leverage = parseInt(tmp_leverage, 10);
        }

        // ---- platform + fees ophalen ----
        const stored_platform = localStorage.getItem('pref_platform');
        const stored_maker = localStorage.getItem('pref_maker_fee');
        const stored_taker = localStorage.getItem('pref_taker_fee');
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
            localStorage.setItem('pref_platform', this.selected_platform);
            localStorage.setItem('pref_maker_fee', String(this.maker_fee));
            localStorage.setItem('pref_taker_fee', String(this.taker_fee));
        }
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
        const riskPerUnit = Math.abs(this.entry - this.stop);
        if (riskPerUnit === 0) { this.riskPct = 0; return; }
        const positionSize = (this.capital * 0.01 * this.leverage) / riskPerUnit; // bv. 1% baseline
        const riskAmount = positionSize * riskPerUnit;
        this.riskPct = (riskAmount / this.capital) * 100;
    }

    reset() {
        this.entry = 100; this.stop = 95; this.tp = 110; this.leverage = 1; this.riskPct = 0;
    }

    constructor(private modalCtrl: ModalController) {}

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
}
