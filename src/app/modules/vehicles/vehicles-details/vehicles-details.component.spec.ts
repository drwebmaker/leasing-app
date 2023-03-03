import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { VehiclesDetailsComponent } from './vehicles-details.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { ReactiveFormsModule } from '@angular/forms';
import {ModelAndBrandService, VehicleService} from "../../../generated-client";
import { of } from 'rxjs';
import {MaterialModule} from "../../material.module";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {ComponentViewType} from "../../../models/component-view-type";

describe('VehiclesDetailsComponent', () => {
  let component: VehiclesDetailsComponent;
  let fixture: ComponentFixture<VehiclesDetailsComponent>;
  let mockVehicleService: jasmine.SpyObj<VehicleService>;
  let mockModelAndBrandService: jasmine.SpyObj<ModelAndBrandService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<VehiclesDetailsComponent>>;

  beforeEach(async () => {
    mockVehicleService = jasmine.createSpyObj('VehicleService', {
      'getVehicleForId': of({}),
      'createVehicle': of({}),
      'updateVehicle': of({}),
      'deleteVehicle': of({})
    });
    mockModelAndBrandService = jasmine.createSpyObj('ModelAndBrandService', {
      'getBrands': of([{ id: 1, name: 'Brand 1' }, { id: 2, name: 'Brand 2' }]),
      'createVehicle': of({})
    });
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogRef.close.and.returnValue();
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: VehicleService, useValue: mockVehicleService },
        { provide: ModelAndBrandService, useValue: mockModelAndBrandService },
        { provide: MatDialogRef, useValue: dialogRef }
      ],
      imports: [ReactiveFormsModule, MaterialModule, NoopAnimationsModule],
      declarations: [ VehiclesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load brands on init', fakeAsync(() => {
    const brands = [{ id: 1, name: 'Brand 1' }, { id: 2, name: 'Brand 2' }];
    component.ngOnInit();
    tick();
    expect(component.brands).toEqual(brands);
  }));
  it('should call loadVehicles in edit mode', () => {
    component.data = {
      id: 1,
      pageMode: ComponentViewType.Edit
    }

    component.ngOnInit();
    expect(mockVehicleService.getVehicleForId).toHaveBeenCalledWith(1);
    expect(component.isEditMode).toBeTruthy();
    expect(component.vehicleId).toBe(1);
  });

  describe('onSaveClick', () => {
    it('should create vehicle in Add mode', () => {
      component.data = {
        id: 1,
        pageMode: ComponentViewType.Add
      }
      component.onSaveClick();
      expect(mockVehicleService.createVehicle).toHaveBeenCalled()
    });
    it('should update vehicle in Edit mode', () => {
      component.data = {
        id: 1,
        pageMode: ComponentViewType.Edit
      }
      component.onSaveClick();
      expect(mockVehicleService.updateVehicle).toHaveBeenCalled()
    });
  })
});
