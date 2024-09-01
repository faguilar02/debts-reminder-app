import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'login',
    title: 'Login',
    loadComponent: () => import('./pages/login-page/login-page.component'),
  },

  {
    path: 'register',
    title: 'Register',
    loadComponent: () =>
      import('./pages/register-page/register-page.component'),
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
