import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';


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

    constructor(private modalCtrl: ModalController) {}

    dec()  { this.value = Math.max(this.min, this.value - 10); }
    inc()  { this.value = Math.min(this.max, this.value + 10); }

    close(withValue = false) {
        this.modalCtrl.dismiss(withValue ? this.value : null);
    }
}
