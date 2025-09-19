import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TradeMarginCostPickerPage } from './trade-margincost-picker.page';

const routes: Routes = [
  {
    path: '',
    component: TradeMarginCostPickerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TradeMarginCostPickerPageRoutingModule {}
