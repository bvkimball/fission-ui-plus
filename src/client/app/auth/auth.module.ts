import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgxsModule } from 'ngxs';

import { MaterialModule } from '../material/material.module';
import { LoginPageComponent } from './containers/login-page.component';
import { LoginFormComponent } from './components/login-form.component';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { AuthState } from './auth.state';

export const COMPONENTS = [LoginPageComponent, LoginFormComponent];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RootAuthModule,
      providers: [AuthService, AuthGuard],
    };
  }
}

@NgModule({
  imports: [
    AuthModule,
    RouterModule.forChild([{ path: 'login', component: LoginPageComponent }]),
//    NgxsModule.forRoot([AuthState])
  ],
})
export class RootAuthModule {}
