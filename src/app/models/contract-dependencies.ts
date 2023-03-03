import {Customer, Vehicle} from "../generated-client";

export interface ContractDependencies {
  customers: Customer,
  vehicles: Vehicle
}
