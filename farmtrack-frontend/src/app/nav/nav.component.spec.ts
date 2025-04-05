import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavComponent } from './nav.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'logout',
      'getCurrentUserRole',
      'isLoggedIn',
      'getToken',
    ]);

    authServiceSpy.getCurrentUserRole.and.returnValue('user');
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.getToken.and.returnValue('fake-token');

    await TestBed.configureTestingModule({
      imports: [
        NavComponent,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        CommonModule,
      ],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout and navigate to login page', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const event = new Event('click');
    const preventDefaultSpy = spyOn(event, 'preventDefault');

    component.logout(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(authService.logout).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
