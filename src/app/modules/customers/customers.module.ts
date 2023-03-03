import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersComponent } from './customers.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import {RouterModule, Routes} from "@angular/router";
import {MaterialModule} from "../material.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ReactiveFormsModule} from "@angular/forms";
import { MAT_DATE_LOCALE } from '@angular/material/core';

const routes: Routes = [
  {
    path: '',
    component: CustomersComponent
  }
];

@NgModule({
  declarations: [
    CustomersComponent,
    CustomerDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FontAwesomeModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomersModule { }
