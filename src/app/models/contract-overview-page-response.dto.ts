export interface ContractOverviewPageResponse {
  page: number;
  size: number;
  numberOfPages: number;
  numberOfItems: number;
  sort?: SortField;
  overviewItems: ContractOverview[];
}
