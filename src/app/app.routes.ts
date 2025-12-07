import { Routes } from '@angular/router';

import { adminGuard } from './admin-guard';
import { InicioComponent } from './inicio-component/inicio-component';
import { authGuard } from './auth-guard';
import { LoginComponent } from './login-component/login-component';
import { ClientesComponent } from './clientes-component/clientes-component';
import { ProductosComponent } from './productos-component/productos-component';
import { DashboardComponent } from './dashboard-admin/dashboard-admin';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'productos', component: ProductosComponent },
  {
    path: 'dashboard',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./dashboard-admin/dashboard-admin').then(m => m.DashboardComponent),
  },
  { path: '**', redirectTo: ''}    
];

