import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsComponent } from './contracts.component';
import {ContractOverviewService} from "../../generated-client";
import {MatDialog} from "@angular/material/dialog";
import { of } from 'rxjs';
import {ContractsDetailsComponent} from "./contracts-details/contracts-details.component";
import { ComponentViewType } from 'src/app/models/component-view-type';

describe('ContractsComponent', () => {
  let component: ContractsComponent;
  let fixture: ComponentFixture<ContractsComponent>;
  let mockContractOverviewService: jasmine.SpyObj<ContractOverviewService>;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockContractOverviewService = jasmine.createSpyObj('ContractOverviewService', ['getContractOveriew']);
    mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ ContractsComponent ],
      providers: [
        { provide: ContractOverviewService, useValue: mockContractOverviewService },
        { provide: MatDialog, useValue: mockMatDialog },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsComponent);
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
    it('should unsubscribe from all subscriptions', () => {
      spyOn(component.destroy$, 'next');
      spyOn(component.destroy$, 'complete');

      component.ngOnDestroy();

      expect(component.destroy$.next).toHaveBeenCalled();
      expect(component.destroy$.complete).toHaveBeenCalled();
    });
  });

  describe('addNewContract', () => {
    it('should open ContractsDetailsComponent with the correct data', () => {
      mockMatDialog.open.and.returnValue({
        afterClosed: () => of(true),
      } as any);

      component.addNewContract();

      expect(mockMatDialog.open).toHaveBeenCalledWith(ContractsDetailsComponent, {
        data: {
          pageMode: ComponentViewType.Add,
          contracts: component.contracts,
        },
      });
    });

    it('should refresh the data source when the dialog is closed with a result', () => {
      mockMatDialog.open.and.returnValue({
        afterClosed: () => of(true),
      } as any);

      spyOn(component.dataSourceSubject, 'next');

      component.addNewContract();

      expect(component.dataSourceSubject.next).toHaveBeenCalledWith({});
    });

    it('should not refresh the data source when the dialog is closed without a result', () => {
      mockMatDialog.open.and.returnValue({
        afterClosed: () => of(false),
      } as any);

      spyOn(component.dataSourceSubject, 'next');

      component.addNewContract();

      expect(component.dataSourceSubject.next).not.toHaveBeenCalled();
    });

  });
  it('should call contractOverviewService.getContractOveriew when dataSourceSubject emits a value', () => {
    component.dataSourceSubject.next({});
    expect(mockContractOverviewService.getContractOveriew).toHaveBeenCalledWith(component.initPageRequest);
  });
});
