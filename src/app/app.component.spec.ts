import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {ContractService, CustomerService, VehicleService} from "./generated-client";

describe('AppComponent', () => {
  let mockCustomerService: jasmine.SpyObj<CustomerService>
  let mockVehicleService: jasmine.SpyObj<VehicleService>

  beforeEach(async () => {
    mockCustomerService = jasmine.createSpyObj('CustomerService', ['createCustomer']);
    mockVehicleService = jasmine.createSpyObj('VehicleService', ['createVehicle']);
    mockCustomerService = jasmine.createSpyObj('ContractService', ['createContract']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: CustomerService, useValue: mockCustomerService },
        { provide: VehicleService, useValue: mockVehicleService },
        { provide: ContractService, useValue: mockCustomerService },
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
