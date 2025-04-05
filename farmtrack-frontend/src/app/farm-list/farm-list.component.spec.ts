import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FarmListComponent } from './farm-list.component';
import { FarmService } from '../services/farm.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../services/auth.service';

describe('FarmListComponent', () => {
  let component: FarmListComponent;
  let fixture: ComponentFixture<FarmListComponent>;
  let farmServiceSpy: jasmine.SpyObj<FarmService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const farmServiceMock = jasmine.createSpyObj('FarmService', ['getFarms']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const authServiceMock = jasmine.createSpyObj('AuthService', [
      'yourAuthMethodHere',
    ]);

    await TestBed.configureTestingModule({
      imports: [FarmListComponent, HttpClientTestingModule],
      providers: [
        { provide: FarmService, useValue: farmServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FarmListComponent);
    component = fixture.componentInstance;
    farmServiceSpy = TestBed.inject(FarmService) as jasmine.SpyObj<FarmService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should load farms and assign them to farms array on initialization', () => {
    const mockFarms = [
      { premiseId: 'Farm1', totalAnimal: 10 },
      { premiseId: 'Farm2', totalAnimal: 20 },
    ];
    farmServiceSpy.getFarms.and.returnValue(of(mockFarms));

    component.ngOnInit();

    expect(farmServiceSpy.getFarms).toHaveBeenCalled();
    expect(component.farms).toEqual(mockFarms);
  });

  it('should log an error if loading farms fails', () => {
    const consoleSpy = spyOn(console, 'error');
    farmServiceSpy.getFarms.and.returnValue(
      throwError(() => new Error('Failed to fetch farms'))
    );

    component.ngOnInit();

    expect(farmServiceSpy.getFarms).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching farms:',
      jasmine.any(Error)
    );
  });
});
