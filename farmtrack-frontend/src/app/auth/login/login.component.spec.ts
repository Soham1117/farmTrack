import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { LoginResponse } from '../../models/auth.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  const mockLoginResponse: LoginResponse = {
    token: 'mock-token',
  };

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should call AuthService.login and navigate to home on successful login', () => {
    const mockFormData = { username: 'testuser', password: 'password123' };
    authServiceSpy.login.and.returnValue(of(mockLoginResponse));
    component.loginForm.setValue(mockFormData);

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith(mockFormData);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    expect(component.error).toBe('');
  });

  it('should set error message on failed login', () => {
    const mockFormData = { username: 'testuser', password: 'wrongpassword' };
    authServiceSpy.login.and.returnValue(
      throwError(() => new Error('Invalid credentials'))
    );
    component.loginForm.setValue(mockFormData);

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith(mockFormData);
    expect(component.error).toBe('Invalid username or password');
  });
});
