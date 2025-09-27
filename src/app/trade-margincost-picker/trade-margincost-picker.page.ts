import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { SettingsService } from '../../services/settings.service';

@Component({
    selector: 'app-trade-margincost-picker',
    templateUrl: 'trade-margincost-picker.page.html',
    styleUrls: ['./trade-margincost-picker.page.css'],
    standalone: false,
})
export class TradeMarginCostPickerPage {
    @Input() value = 20;
    @Input() min = 10;
    @Input() max = 1000;
    @Input() title = 'Edit Trade Margin Cost';

    constructor(
        public settings: SettingsService,
        private modalCtrl: ModalController
    ) {}

    dec()  { this.value = Math.max(this.min, this.value - 10); }
    inc()  { this.value = Math.min(this.max, this.value + 10); }

    close(withValue = false) {
        this.modalCtrl.dismiss(withValue ? this.value : null);
        this.settings.trade_margin_cost = this.value;
    }

    
    formatCurrency(n: number) {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
        // return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0);
    }
        
    onAmountInput(ev: CustomEvent) {
        const raw = ev.detail?.value.replace(/\s+/g, '');
        // const raw = String(ev.detail?.value ?? '');
        const n = this.toNum(raw);  // your helper that accepts comma/dot if you have it
        if (Number.isFinite(n) && n !== this.value) {
            if((n >= this.min) && (n <= this.max)){
                this.value = n;
            }
        }
    }

    // If you prefer to log only when the user is done typing:
    onAmountBlur(ev: CustomEvent) {
        const raw = String(ev.detail?.value ?? '');
        const n = this.toNum(raw);
        if (Number.isFinite(n) && n !== this.value) {
            if((n >= this.min) && (n <= this.max)){
                this.value = n;
            }
        }
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

    
    private toNum(v: string): number {
        return Number(v.replace(',', '.').trim());
    }
}
