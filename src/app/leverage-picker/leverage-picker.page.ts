import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
    selector: 'app-leverage-picker',
    templateUrl: 'leverage-picker.page.html',
    styleUrls: ['./leverage-picker.page.css'],
    standalone: false,
})
export class LeveragePickerPage {
    @Input() value = 20;
    @Input() min = 1;
    @Input() max = 100;
    @Input() title = 'Edit Leverage';

    constructor(private modalCtrl: ModalController) {}

    dec()  { this.value = Math.max(this.min, this.value - 1); }
    inc()  { this.value = Math.min(this.max, this.value + 1); }
    close(withValue = false) {
        this.modalCtrl.dismiss(withValue ? this.value : null);
    }
}
