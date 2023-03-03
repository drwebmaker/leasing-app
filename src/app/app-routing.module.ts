import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'contracts',
    pathMatch: 'full'
  },
  {
    path: 'contracts',
    loadChildren: () => import('./modules/contracts/contracts.module').then((m) => m.ContractsModule)
  },
  {
    path: 'customers',
    loadChildren: () => import('./modules/customers/customers.module').then((m) => m.CustomersModule)
  },
  {
    path: 'vehicles',
    loadChildren: () => import('./modules/vehicles/vehicles.module').then((m) => m.VehiclesModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
