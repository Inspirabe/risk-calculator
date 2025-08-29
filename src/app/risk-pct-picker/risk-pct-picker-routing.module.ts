import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiskPctPickerPage } from './risk-pct-picker.page';

const routes: Routes = [
  {
    path: '',
    component: RiskPctPickerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RiskPctPickerPageRoutingModule {}
