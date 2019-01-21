import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AppResolve } from './services/app-resolve.service';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    resolve: {
      data: AppResolve
    },
    children: [
      {
        path: 'parties',
        children: [
          {
            path: 'persons',
            loadChildren: './main/natural-person/natural-person.module#NaturalPersonModule'
          }
        ]
      },
      {
        path: 'taxes',
        children: [
          {
            path: 'modules',
            loadChildren: './main/tax-module/tax-module.module#TaxModuleModule'
          },
          {
            path: 'registers',
            loadChildren: './main/tax-register/tax-register.module#TaxRegisterModule'
          },
          {
            path: 'claims',
            loadChildren: './main/tax-claim/tax-claim.module#TaxClaimModule'
          }
        ]
      }
    ]
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule'
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingRoutingModule { }
