import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SymbolPickerPage } from './symbol-picker.page';

const routes: Routes = [
  {
    path: '',
    component: SymbolPickerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SymbolPickerPageRoutingModule {}
