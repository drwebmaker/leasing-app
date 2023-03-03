import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Brand, ModelAndBrandService, VehicleService} from "../../../generated-client";
import {ComponentViewType} from "../../../models/component-view-type";
import {filter, Subject, switchMap, takeUntil, tap} from "rxjs";

@Component({
  selector: 'app-vehicles-details',
  templateUrl: './vehicles-details.component.html',
  styleUrls: ['./vehicles-details.component.scss']
})
export class VehiclesDetailsComponent implements OnInit, OnDestroy {
  public form!: FormGroup;
  public vehicleId!: number;
  public isEditMode = false;
  private destroy$: Subject<void> = new Subject<void>();
  public modelsSubject = new Subject<number>();
  public brands?: Brand[];
  public models$ = this.modelsSubject.pipe(
    filter(Boolean),
    switchMap((modelId: number) => this.modelAndBrandService.getModelsByBrandId(modelId))
  )

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private vehicleService: VehicleService,
    private modelAndBrandService: ModelAndBrandService,
    public currentDialogRef: MatDialogRef<VehiclesDetailsComponent>,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.modelAndBrandService.getBrands().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.brands = data;
    })
    if(this.data && this.data.pageMode === ComponentViewType.Edit) {
      this.isEditMode = true;
      this.vehicleId = this.data.id;
      this.loadVehicles();
    }
    this.form.get('brand')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      tap((value) => {
        const brandId = this.brands?.find((item)=>item.name === value)?.id;
        this.modelsSubject.next(brandId!)
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onSaveClick() {
    const tableData = this.form.getRawValue()
    const params = {
      id: this.vehicleId,
      brand: tableData.brand,
      model: tableData.model,
      modelYear: tableData.modelYear,
      vin: tableData.vin,
      price: tableData.price,
    }
    if(this.data.pageMode === ComponentViewType.Edit) {
      this.updateCustomer(params);
    } else {
      this.createCustomer(params);
    }
    this.currentDialogRef.close(true);

  }
  public onDeleteClick() {
    this.vehicleService.deleteVehicle(this.vehicleId).subscribe(() => this.currentDialogRef.close(true));
  }

  private createForm() {
    this.form = this.fb.group({
      brand: [null, Validators.required],
      model: [null, Validators.required],
      modelYear: [null, Validators.required],
      vin: [null],
      price: [null, Validators.required]
    })
  }

  private loadVehicles() {
    this.vehicleService.getVehicleForId(this.vehicleId).subscribe((data) => {
      const brandId = this.brands?.find((item)=>item.name === data.brand)?.id;
      this.modelsSubject.next(brandId!);
      this.form.patchValue({
        model: data.model,
        brand: data.brand,
        vin: data.vin,
        modelYear: data.modelYear,
        price: data.price
      });
    });
  }

  private createCustomer(data: any) {
    this.vehicleService.createVehicle(data).subscribe();
  }
  private updateCustomer(data: any): void {
    this.vehicleService.updateVehicle(data.id, data).subscribe();
  }

}
