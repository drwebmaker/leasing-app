import { Customer } from "./customer.dto";

export interface CustomerPageResponse {
  page: number;
  size: number;
  numberOfPages: number;
  numberOfItems: number;
  sort: SortField;
  overviewItems: Customer[];
}
