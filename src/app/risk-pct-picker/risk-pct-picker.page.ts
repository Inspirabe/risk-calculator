import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-risk-pct-picker',
    templateUrl: './risk-pct-picker.page.html',
    styleUrls: ['./risk-pct-picker.page.css'],
    standalone: false,
})

export class RiskPctPickerPage{
    @Input() value = 1;   // %
    @Input() min = 1;
    @Input() max = 30;
    @Input() title = 'Edit Desired Risk';

    constructor(private modalCtrl: ModalController) {}

    dec() { this.value = Math.max(this.min, this.value - 1); }
    inc() { this.value = Math.min(this.max, this.value + 1); }
    close(withValue = false) { this.modalCtrl.dismiss(withValue ? this.value : null); }

    ngOnInit() {
    }
}

