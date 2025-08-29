import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RiskPctPickerPageRoutingModule } from './risk-pct-picker-routing.module';

import { RiskPctPickerPage } from './risk-pct-picker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RiskPctPickerPageRoutingModule
  ],
  declarations: [RiskPctPickerPage]
})
export class RiskPctPickerPageModule {}
