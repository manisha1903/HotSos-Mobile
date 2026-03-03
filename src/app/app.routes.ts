import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'shell',
    loadComponent: () =>
      import('./features/shell/shell').then((m) => m.Shell),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'housekeeping',
        pathMatch: 'full',
      },
      {
        path: 'housekeeping',
        loadComponent: () =>
          import('./features/housekeeping/housekeeping').then(
            (m) => m.Housekeeping
          ),
      },
      {
        path: 'service-orders',
        loadComponent: () =>
          import('./features/service-orders/service-orders').then(
            (m) => m.ServiceOrders
          ),
      },
      {
        path: 'guests',
        loadComponent: () =>
          import('./features/guests/guests').then((m) => m.Guests),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
