import { Component } from '@angular/core';
import {Contract, ContractService, Customer, CustomerService, Vehicle, VehicleService} from "./generated-client";
import {CustomersMock} from "./mocks/customers-mock";
import {VehiclesMock} from "./mocks/vehicles-mock";
import {ContractsMock} from "./mocks/contracts-mock";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public isChecked = false;
  private customers: Customer[] = CustomersMock;
  private vehicles: Vehicle[] = VehiclesMock;
  private contracts: Contract[] = ContractsMock;
  constructor(
    private customerService: CustomerService,
    private vehicleService: VehicleService,
    private contractService: ContractService
  ) {}

  public createCustomers() {
    this.customers.forEach(item => {
      this.customerService.createCustomer(item).subscribe();
    });
  }
  public createVehicles() {
    this.vehicles.forEach(item => {
      this.vehicleService.createVehicle(item).subscribe();
    });
  }
  public createContracts() {
    this.contracts.forEach(item => {
      this.contractService.createContract(item).subscribe();
    });
  }
}
