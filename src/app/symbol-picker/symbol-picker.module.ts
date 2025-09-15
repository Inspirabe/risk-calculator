import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SymbolPickerPageRoutingModule } from './symbol-picker-routing.module';

import { SymbolPickerPage } from './symbol-picker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SymbolPickerPageRoutingModule
  ],
  declarations: [SymbolPickerPage]
})
export class SymbolPickerPageModule {}
