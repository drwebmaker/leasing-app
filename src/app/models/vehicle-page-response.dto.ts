import { Vehicle } from "./vehicle.dto";

export interface VehiclePageResponse {
  page: number;
  size: number;
  numberOfPages: number;
  numberOfItems: bigint;
  sort: SortField;
  overviewItems: Vehicle[];
}
