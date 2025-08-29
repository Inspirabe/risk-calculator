import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CapitalPickerPage } from './capital-picker.page';

const routes: Routes = [
  {
    path: '',
    component: CapitalPickerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CapitalPickerPageRoutingModule {}
