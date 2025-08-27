import { Component } from '@angular/core';

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
  lev = 1;

  // Deze zou je uit Settings / Capital kunnen ophalen via service of store:
  capital = 1000;     // demo
  riskPct = 0;

  calc() {
    const riskPerUnit = Math.abs(this.entry - this.stop);
    if (riskPerUnit === 0) { this.riskPct = 0; return; }
    const positionSize = (this.capital * 0.01 * this.lev) / riskPerUnit; // bv. 1% baseline
    const riskAmount = positionSize * riskPerUnit;
    this.riskPct = (riskAmount / this.capital) * 100;
  }

  reset() {
    this.entry = 100; this.stop = 95; this.tp = 110; this.lev = 1; this.riskPct = 0;
  }
}
