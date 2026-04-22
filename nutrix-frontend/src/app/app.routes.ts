import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tmb',
    loadComponent: () => import('./features/tmb-calculator/tmb-calculator.component').then(m => m.TmbCalculatorComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tmb/history',
    loadComponent: () => import('./features/tmb-calculator/tmb-history/tmb-history.component').then(m => m.TmbHistoryComponent),
    canActivate: [authGuard]
  },
  {
    path: 'workout',
    loadComponent: () => import('./features/workout-builder/workout-builder.component').then(m => m.WorkoutBuilderComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
