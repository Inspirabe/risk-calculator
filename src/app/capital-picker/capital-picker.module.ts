import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CapitalPickerPageRoutingModule } from './capital-picker-routing.module';

import { CapitalPickerPage } from './capital-picker.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CapitalPickerPageRoutingModule
    ]
})
export class CapitalPickerPageModule {}
