import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { NaturalPersonResolverService } from './services/natural-person-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'natural-person',
        loadChildren: './main/natural-person/natural-person.module#NaturalPersonModule',
        resolve: {
          data: NaturalPersonResolverService
        }
      },
      {
        path: 'tax-module',
        loadChildren: './main/tax-module/tax-module.module#TaxModuleModule'
      },
      {
        path: 'tax-register',
        loadChildren: './main/tax-register/tax-register.module#TaxRegisterModule'
      },
      {
        path: '',
        redirectTo: 'natural-person',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingRoutingModule { }
