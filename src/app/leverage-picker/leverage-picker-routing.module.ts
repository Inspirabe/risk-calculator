import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeveragePickerPage } from './leverage-picker.page';

const routes: Routes = [
  {
    path: '',
    component: LeveragePickerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeveragePickerPageRoutingModule {}
