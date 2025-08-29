import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'leverage-picker',
    loadChildren: () => import('./leverage-picker/leverage-picker.module').then( m => m.LeveragePickerPageModule)
  },
  {
    path: 'risk-pct-picker',
    loadChildren: () => import('./risk-pct-picker/risk-pct-picker.module').then( m => m.RiskPctPickerPageModule)
  },  {
    path: 'capital-picker',
    loadChildren: () => import('./capital-picker/capital-picker.module').then( m => m.CapitalPickerPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
