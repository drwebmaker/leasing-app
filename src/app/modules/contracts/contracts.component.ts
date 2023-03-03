import {Component, OnDestroy} from '@angular/core';
import {
  BehaviorSubject, map,
  shareReplay, Subject, switchMap, takeUntil, tap
} from 'rxjs';
import {
  ContractOverview,
  ContractOverviewPageResponse,
  ContractOverviewService
} from "../../generated-client";
import {MatDialog} from "@angular/material/dialog";
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';
import {MatDialogRef} from "@angular/material/dialog/dialog-ref";
import {ContractsDetailsComponent} from "./contracts-details/contracts-details.component";
import {ComponentViewType} from "../../models/component-view-type";
import {InitPageTableRequest} from "../../helpers/init-page-table-request";

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent implements OnDestroy {
  public detailsIcon = faExternalLink;
  public initPageRequest = Object.assign(InitPageTableRequest);
  public displayedColumns: string[] = ['contractNumber', 'customer', 'vehicle', 'vin', 'monthlyRate', 'vehiclePrice', 'details'];

  public dataSourceSubject = new BehaviorSubject<unknown>(this.initPageRequest);

  public destroy$: Subject<void> = new Subject<void>();
  public dataSource$ = this.dataSourceSubject.pipe(
    takeUntil(this.destroy$),
    switchMap((data) => {
      this.initPageRequest = { ...this.initPageRequest, ...(data as object) };
      return this.contractOverviewService.getContractOveriew(this.initPageRequest);
    }),
    map((dataSource: ContractOverviewPageResponse) =>
    dataSource.overviewItems?.length ? dataSource.overviewItems : null),
    tap((data) => this.contracts = data),
    shareReplay(1)
  );

  private dialogRef!: MatDialogRef<any>;
  public contracts: ContractOverview[] | null = [];

  constructor(
    public dialog: MatDialog,
    private contractOverviewService: ContractOverviewService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public addNewContract() {
    this.dialogRef = this.dialog.open(ContractsDetailsComponent, {
      data: {
        pageMode: ComponentViewType.Add,
        contracts: this.contracts
      }
    });
    this.dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.dataSourceSubject.next({});
      }
    });
  }

  showDetails(id: number) {
    this.dialogRef = this.dialog.open(ContractsDetailsComponent, {
      data: {
        pageMode: ComponentViewType.Edit,
        id: id,
        contracts: this.contracts
      }
    });
    this.dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.dataSourceSubject.next({});
      }
    });
  }

}
