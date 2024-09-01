import { Routes } from '@angular/router';

export default [
  {
    path: 'debts-list',
    title: 'Debts List',
    loadComponent: () => import('./pages/debts-list/debts-list.component'),
  },

  {
    path: 'new-debt',
    title: 'New Debt',
    loadComponent: () => import('./pages/new-debt/new-debt.component'),
  },

  {
    path: 'edit/:id',
    title: 'Edit Debt',
    loadComponent: () => import('./pages/new-debt/new-debt.component')
  },


  {
    path: '**',
    redirectTo: 'debts-list',
  },
] as Routes;
