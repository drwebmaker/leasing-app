import {Component, OnDestroy} from '@angular/core';
import { CustomerService } from 'src/app/generated-client';
import {InitPageTableRequest} from "../../helpers/init-page-table-request";
import {BehaviorSubject, map, Subject, switchMap, takeUntil} from "rxjs";
import {faExternalLink} from "@fortawesome/free-solid-svg-icons";
import {ComponentViewType} from "../../models/component-view-type";
import {MatDialogRef} from "@angular/material/dialog/dialog-ref";
import {MatDialog} from "@angular/material/dialog";
import {CustomerDetailsComponent} from "./customer-details/customer-details.component";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements  OnDestroy {
  public detailsIcon = faExternalLink;
  public initPageRequest = Object.assign(InitPageTableRequest);
  public displayedColumns = ['id', 'firstName', 'lastName', 'birthday', 'details'];

  private dialogRef!: MatDialogRef<any>;
  private destroy$: Subject<void> = new Subject<void>();

  public dataSourceSubject = new BehaviorSubject<unknown>(this.initPageRequest);
  public customers$ = this.dataSourceSubject.pipe(
    takeUntil(this.destroy$),
    switchMap(() => this.customersService.getAllCustomers(this.initPageRequest)),
    map((data) => data.overviewItems?.length ? data.overviewItems : null)
  )

  constructor(
    private customersService: CustomerService,
    public dialog: MatDialog
  ) { }

  public addNewCustomer() {
    this.dialogRef = this.dialog.open(CustomerDetailsComponent, {
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
    this.dialogRef = this.dialog.open(CustomerDetailsComponent, {
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
