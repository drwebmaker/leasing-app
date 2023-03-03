import {Component, OnDestroy} from '@angular/core';
import {InitPageTableRequest} from "../../helpers/init-page-table-request";
import {MatDialogRef} from "@angular/material/dialog/dialog-ref";
import {BehaviorSubject, map, Subject, switchMap, takeUntil} from "rxjs";
import {VehicleService} from "../../generated-client";
import {faExternalLink} from "@fortawesome/free-solid-svg-icons";
import {ComponentViewType} from "../../models/component-view-type";
import {MatDialog} from "@angular/material/dialog";
import {VehiclesDetailsComponent} from "./vehicles-details/vehicles-details.component";

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements  OnDestroy {
  public detailsIcon = faExternalLink;
  public initPageRequest = Object.assign(InitPageTableRequest);
  public displayedColumns = ['id', 'brand', 'model', 'year', 'vin', 'price', 'details'];

  public destroy$: Subject<void> = new Subject<void>();
  public dataSourceSubject = new BehaviorSubject<unknown>(this.initPageRequest);
  public vehicles$ = this.dataSourceSubject.pipe(
    takeUntil(this.destroy$),
    switchMap(() => this.vehicleService.getAllVehicles(this.initPageRequest)),
    map((data) => data.overviewItems?.length ? data.overviewItems : null)
  )
  private dialogRef!: MatDialogRef<any>;
  constructor(
    private vehicleService: VehicleService,
    public dialog: MatDialog
  ) { }

  public addNewVehicle() {
    this.dialogRef = this.dialog.open(VehiclesDetailsComponent, {
      data: {
        pageMode: ComponentViewType.Add
      }
    });
    this.dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.dataSourceSubject.next({});
      }
    });
  }

  public showDetails(id: number) {
    this.dialogRef = this.dialog.open(VehiclesDetailsComponent, {
      data: {
        pageMode: ComponentViewType.Edit,
        id: id
      }
    });
    this.dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.dataSourceSubject.next({});
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
