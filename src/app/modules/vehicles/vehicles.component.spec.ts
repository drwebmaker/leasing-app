import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclesComponent } from './vehicles.component';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import { VehicleService } from 'src/app/generated-client';
import { VehiclesDetailsComponent } from './vehicles-details/vehicles-details.component';
import { ComponentViewType } from 'src/app/models/component-view-type';
import {of } from 'rxjs';

describe('VehiclesComponent', () => {
  let component: VehiclesComponent;
  let fixture: ComponentFixture<VehiclesComponent>;
  let mockVehicleService: jasmine.SpyObj<VehicleService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<VehiclesDetailsComponent>>;

  beforeEach(async () => {
    mockVehicleService = jasmine.createSpyObj('VehicleService', ['getAllVehicles']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    mockDialog.open.and.returnValue(dialogRef);
    await TestBed.configureTestingModule({
      declarations: [ VehiclesComponent ],
      providers: [
        { provide: VehicleService, useValue: mockVehicleService },
        { provide: MatDialog, useValue: mockDialog }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnDestroy', () => {
    it('should call destroy$', () => {
      const spy = spyOn(component.destroy$, 'next');
      component.ngOnDestroy();
      expect(spy).toHaveBeenCalled();
    });

    it('should call destroy$.complete', () => {
      const spy = spyOn(component.destroy$, 'complete');
      component.ngOnDestroy();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('addNewVehicle', () => {
    it('should open dialog for add new vehicle', () => {
      dialogRef.afterClosed.and.returnValue(of(true));
      spyOn(component.dataSourceSubject, 'next');
      component.addNewVehicle();
      expect(mockDialog.open).toHaveBeenCalledWith(VehiclesDetailsComponent, {
        data: {
          pageMode: ComponentViewType.Add
        }
      });
      expect(dialogRef.afterClosed).toHaveBeenCalled();
      expect(component.dataSourceSubject.next).toHaveBeenCalledWith({});
    });
  });

  describe('showDetails', () => {
    it('should open dialog for update vehicle', () => {
      dialogRef.afterClosed.and.returnValue(of(true));
      spyOn(component.dataSourceSubject, 'next');
      component.showDetails(1);
      expect(mockDialog.open).toHaveBeenCalledWith(VehiclesDetailsComponent, {
        data: {
          pageMode: ComponentViewType.Edit,
          id: 1
        }
      });
      expect(dialogRef.afterClosed).toHaveBeenCalled();
      expect(component.dataSourceSubject.next).toHaveBeenCalledWith({});
    });
  });
});
