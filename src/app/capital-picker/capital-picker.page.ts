import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

import { SettingsService } from '../../services/settings.service';


@Component({
    selector: 'app-capital-picker',
    standalone: true,
    imports: [CommonModule, FormsModule, IonicModule],
    templateUrl: './capital-picker.page.html',
})

export class CapitalPickerPage {
    @Input() value = 1000;     // current capital
    @Input() min = 1000;        // set what you like
    @Input() max = 100000;  // set what you like
    @Input() step = 1000;       // +/- step
    @Input() title = 'Edit Capital';

    display_value: string = '';

    constructor(
        public settings: SettingsService,
        private modalCtrl: ModalController
    ) {}

    dec()  { this.value = Math.max(this.min, this.value - this.step); }
    inc()  { this.value = Math.min(this.max, this.value + this.step); }
    close(withValue = false) { 
        this.modalCtrl.dismiss(withValue ? this.value : null);
        this.settings.capital = this.value;
        console.log(this.settings.capital + 'x' + '('+this.settings.desired_risk+' / ' +100+')');
        this.settings.risk_capital = (this.settings.capital * (this.settings.desired_risk / 100))
        console.log(this.settings.risk_capital);
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

    private toNum(v: string): number {
        return Number(v.replace(',', '.').trim());
    }
}