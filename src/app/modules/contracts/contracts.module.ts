import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsRoutingModule } from "./contracts-routing.module";
import { ContractsComponent } from './contracts.component';
import { ContractsDetailsComponent } from './contracts-details/contracts-details.component';
import {MaterialModule} from "../material.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    ContractsComponent,
    ContractsDetailsComponent
  ],
  imports: [
    CommonModule,
    ContractsRoutingModule,
    MaterialModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ]
})
export class ContractsModule { }
