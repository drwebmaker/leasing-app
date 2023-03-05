import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {map, Observable, tap} from "rxjs";
import {
  ContractOverview,
  ContractService,
  Customer,
  CustomerService,
  PageRequest,
  Vehicle,
  VehicleService
} from "../../../generated-client";
import {faExternalLink} from "@fortawesome/free-solid-svg-icons";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DetailsDialogComponent} from "../../../components/details-dialog/details-dialog.component";
import {ComponentViewType} from "../../../models/component-view-type";

@Component({
  selector: 'app-contracts-details',
  templateUrl: './contracts-details.component.html',
  styleUrls: ['./contracts-details.component.scss']
})
export class ContractsDetailsComponent implements OnInit {
  public detailsIcon = faExternalLink;
  public form!: FormGroup;
  public initPageRequest: PageRequest = {
    page: 0,
    size: 10,
    sort: 'ASC'
  };
  public contractId!: number;
  public isEditMode = false;

  private customersList!: Customer[];
  private vehiclesList!: Vehicle[];
  public customers$: Observable<Customer[]> = this.customerService.getAllCustomers(this.initPageRequest).pipe(
    map((data) => data.overviewItems || []),
    tap((data) => {
      this.customersList = data;
    })
  );
  public vehicles$: Observable<Vehicle[]> = this.vehicleService.getAllVehicles(this.initPageRequest).pipe(
    map((data) => data.overviewItems || []),
    tap((data) => {
      this.vehiclesList = data;
    })
  );
  public vehicleControl = new FormControl(null, [Validators.required, (control: AbstractControl): ValidationErrors | null => {
    const contracts = this.data.contracts ? this.data.contracts : [];
    const filteredData = contracts.filter((item: ContractOverview) => {
      return item.vehicleId === control.value && item.contractId !== this.contractId;
    });
    return filteredData.length ? {wrongVehicle: 'test'} : null;
  }])

  private dialogRef!: MatDialogRef<any>;

  constructor(private customerService: CustomerService,
              private vehicleService: VehicleService,
              private contractService: ContractService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public currentDialogRef: MatDialogRef<ContractsDetailsComponent>,
              private dialog: MatDialog,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
    if(this.data && this.data.pageMode === ComponentViewType.Edit) {
      this.isEditMode = true;
      this.contractId = this.data.id;
      this.loadContracts();
    }
  }

  public onSaveClick() {
    const tableData = this.form.getRawValue()
    const params = {
      id: this.contractId,
      monthlyRate: tableData.monthlyRate,
      vehicle: this.vehiclesList.find((item) => item.id === tableData.vehicle),
      customer: this.customersList.find((item) => item.id === tableData.customer)
    }
    if(this.data.pageMode === ComponentViewType.Edit) {
      this.updateContract(params);
    } else {
      this.createContract(params);
    }
    this.currentDialogRef.close(true);
  }

  public showCustomerDetails() {
    this.customerService.getCustomerForId(this.form.get('customer')?.value).subscribe((data) => {
      this.dialogRef = this.dialog.open(DetailsDialogComponent, {
        data: {
          dataSource: data,
          config: [
            {
              label: 'ID',
              fieldName: 'id'
            },
            {
              label: 'First Name',
              fieldName: 'firstName'
            },
            {
              label: 'Last Name',
              fieldName: 'lastName'
            },
            {
              label: 'BirthDate',
              fieldName: 'birthDate',
              type: 'Date'
            }
          ]
        }
      });
    })
  }

  public showVehicleDetails() {
    this.vehicleService.getVehicleForId(this.form.get('vehicle')?.value).subscribe((data) => {
      this.dialogRef = this.dialog.open(DetailsDialogComponent, {
        data: {
          dataSource: data,
          config: [
            {
              label: 'ID',
              fieldName: 'id'
            },
            {
              label: 'Brand',
              fieldName: 'brand'
            },
            {
              label: 'Model',
              fieldName: 'model'
            },
            {
              label: 'Year',
              fieldName: 'modelYear'
            },
            {
              label: 'Price',
              fieldName: 'price'
            },
            {
              label: 'VIN',
              fieldName: 'vin'
            }
          ]
        }
      });
    })
  }

  public deleteContract() {

    this.contractService.deleteContract(this.contractId).subscribe(() => this.currentDialogRef.close(true));
  }

  private createForm() {
    this.form = this.fb.group({
      contractNumber: [{value: null, disabled: true}],
      monthlyRate: [null, Validators.required],
      customer: [null, Validators.required],
      vehicle: this.vehicleControl
    });
  }

  private loadContracts() {
    this.contractService.getContractForId(this.contractId).subscribe((data) => {
      this.form.patchValue({
        contractNumber: data.id,
        monthlyRate: data.monthlyRate,
        customer: data.customer.id,
        vehicle: data.vehicle.id
      })
    });
  }

  private createContract(data: any) {
    this.contractService.createContract(data).subscribe();
  }
  private updateContract(data: any): void {
    this.contractService.updateContract(data.id, data).subscribe();
  }
}
