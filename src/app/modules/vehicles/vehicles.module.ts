import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {VehiclesComponent} from "./vehicles.component";
import {VehiclesDetailsComponent} from "./vehicles-details/vehicles-details.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../material.module";

const routes: Routes = [
  {
    path: '',
    component: VehiclesComponent
  }
];

@NgModule({
  declarations: [VehiclesComponent, VehiclesDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FontAwesomeModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class VehiclesModule { }
