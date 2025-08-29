import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
    selector: 'app-capital-picker',
    standalone: true,
    imports: [CommonModule, FormsModule, IonicModule],
    templateUrl: './capital-picker.page.html',
})
export class CapitalPickerPage {
  @Input() value = 1000;     // current capital
  @Input() min = 100;        // set what you like
  @Input() max = 1_000_000;  // set what you like
  @Input() step = 100;       // +/- step
  @Input() title = 'Edit Capital';

  constructor(private modalCtrl: ModalController) {}

  dec()  { this.value = Math.max(this.min, this.value - this.step); }
  inc()  { this.value = Math.min(this.max, this.value + this.step); }
  close(withValue = false) { this.modalCtrl.dismiss(withValue ? this.value : null); }

  formatCurrency(n: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0);
  }
}
