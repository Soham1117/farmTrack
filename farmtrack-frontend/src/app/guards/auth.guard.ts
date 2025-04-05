import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isLoggedIn = authService.isLoggedIn();
  if (isLoggedIn) {
    return true;
  }

  return router.parseUrl('/login');
};

export const viewerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const userRole = authService.getCurrentUserRole();
  const isLoggedIn = authService.isLoggedIn();

  if (isLoggedIn && (userRole === 'ROLE_VIEWER' || userRole === 'ROLE_ADMIN')) {
    return true;
  }

  if (isLoggedIn) {
    return router.parseUrl('/unauthorized');
  }

  return router.parseUrl('/login');
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getCurrentUserRole();
  const isLoggedIn = authService.isLoggedIn();

  if (isLoggedIn && userRole === 'ROLE_ADMIN') {
    return true;
  }

  if (isLoggedIn) {
    return router.parseUrl('/unauthorized');
  }

  return router.parseUrl('/login');
};

@Injectable({ providedIn: 'root' })
export class roleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as Array<string>;
    const userRole = this.authService.getCurrentUserRole();

    if (requiredRoles.includes(userRole || '')) {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}
