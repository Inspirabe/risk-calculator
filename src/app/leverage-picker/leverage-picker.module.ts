import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeveragePickerPageRoutingModule } from './leverage-picker-routing.module';

import { LeveragePickerPage } from './leverage-picker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeveragePickerPageRoutingModule
  ],
  declarations: [LeveragePickerPage]
})
export class LeveragePickerPageModule {}
