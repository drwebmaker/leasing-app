import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ComponentViewType} from "../../../models/component-view-type";
import {CustomerService} from "../../../generated-client";
import * as moment from 'moment';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {
  public form!: FormGroup;
  public customerId!: number;
  public isEditMode = false;
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private customerService: CustomerService,
    public currentDialogRef: MatDialogRef<CustomerDetailsComponent>,
  ) { }

  ngOnInit(): void {
    this.createForm();
    if(this.data && this.data.pageMode === ComponentViewType.Edit) {
      this.isEditMode = true;
      this.customerId = this.data.id;
      this.loadCustomers();
    }
  }

  public onSaveClick() {
    const tableData = this.form.getRawValue()
    const params = {
      id: this.customerId,
      firstName: tableData.firstName,
      lastName: tableData.lastName,
      birthDate: moment(this.form.get('birthday')?.value).format('YYYY-MM-DD')
    }
    if(this.data.pageMode === ComponentViewType.Edit) {
      this.updateCustomer(params);
    } else {
      this.createCustomer(params);
    }
    this.currentDialogRef.close(true);

  }
  public onDeleteClick() {
    this.customerService.deleteCustomer(this.customerId).subscribe(() => this.currentDialogRef.close(true));
  }

  private createForm() {
    this.form = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      birthday: [null, Validators.required]
    });
  }

  private loadCustomers() {
    this.customerService.getCustomerForId(this.customerId).subscribe((data) => {
      this.form.patchValue({
        firstName: data.firstName,
        lastName: data.lastName,
        birthday: new Date(data.birthDate.toString())
      })
    });
  }
  private createCustomer(data: any) {
    this.customerService.createCustomer(data).subscribe();
  }
  private updateCustomer(data: any): void {
    this.customerService.updateCustomer(data.id, data).subscribe();
  }
}
