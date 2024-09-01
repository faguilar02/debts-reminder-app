import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';
import { PublicGuard } from './auth/guards/public.guard';
import { PrivateGuard } from './auth/guards/private.guard';


export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [PublicGuard],
    loadComponent: () =>
      import('./auth/layout/auth-layout/auth-layout.component'),
    children: authRoutes,
  },

  {
    path: '',
    canActivate: [PrivateGuard],
    loadComponent: () =>
      import('./debts/layout/layout-page/layout-page.component'),
    children: [
      {
        path: 'debts',
        loadChildren: () => import('./debts/debts.routes'),
      },

      {
        path: '**',
        redirectTo: 'debts',
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
