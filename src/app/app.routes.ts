import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing-page.component').then((m) => m.CustomLandingPageComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
  },
  {
    path: 'shipments',
    loadComponent: () => import('./features/shipments/shipment-list.component').then((m) => m.ShipmentListComponent)
  },
  {
    path: 'tracking',
    loadComponent: () => import('./features/tracking/tracking.component').then((m) => m.TrackingComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
