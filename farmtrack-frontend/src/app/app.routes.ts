import { Routes } from '@angular/router';
import { FarmListComponent } from './farm-list/farm-list.component';
import { MovementListComponent } from './movement-list/movement-list.component';
import { FarmFormComponent } from './farm-form/farm-form.component';
import { MovementFormComponent } from './movement-form/movement-form.component';
import { LoginComponent } from './auth/login/login.component';
import { UnauthorizedComponent } from './auth/unauthorized/unauthorized.component';
import { authGuard, roleGuard } from './guards/auth.guard';
import { UsermanagementComponent } from './usermanagement/usermanagement.component';
import { UsersListComponent } from './users-list/users-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  {
    path: 'farms',
    component: FarmListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_VIEWER'] },
  },
  {
    path: 'movements',
    component: MovementListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_VIEWER'] },
  },
  {
    path: 'farm/create',
    component: FarmFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] },
  },
  {
    path: 'farm/edit/:id',
    component: FarmFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] },
  },
  {
    path: 'movement/create',
    component: MovementFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] },
  },
  {
    path: 'movement/edit/:id',
    component: MovementFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] },
  },
  {
    path: 'users',
    component: UsersListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN'] },
  },
  {
    path: 'user/create',
    component: UsermanagementComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN'] },
  },

  { path: '**', redirectTo: 'farms' },
];
