import {Customer} from "./customer.dto";
import {Vehicle} from "./vehicle.dto";

interface Contract {
  id: number;
  monthlyRate: number;
  vehicle: Vehicle;
  customer: Customer;
}
