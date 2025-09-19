import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TradeMarginCostPickerPageRoutingModule } from './trade-margincost-picker-routing.module';

import { TradeMarginCostPickerPage } from './trade-margincost-picker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TradeMarginCostPickerPageRoutingModule
  ],
  declarations: [TradeMarginCostPickerPage]
})
export class TradeMarginCostPickerPageModule {}
