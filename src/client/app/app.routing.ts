import { Routes } from '@angular/router';
import { AuthGuard } from './auth/services/auth-guard.service';
import { NotFoundPageComponent } from './core/containers/not-found-page.component';

import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  { path: '', redirectTo: '/about', pathMatch: 'full' },
  {
    path: 'about',
    component: AboutComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'functions',
    loadChildren: './functions/functions.module#FunctionsModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'environments',
    loadChildren: './environments/environments.module#EnvironmentsModule',
    canActivate: [AuthGuard],
  },
  { path: '**', component: NotFoundPageComponent },
];
