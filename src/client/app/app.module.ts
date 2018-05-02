// @angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
// @ngrx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DBModule } from '@ngrx/db';
import { NgxsModule } from 'ngxs';
// Vendor files
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
// App modules
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { FunctionsModule } from './functions/functions.module';
import { EnvironmentsModule } from './environments/environments.module';
// App Services
import { AboutComponent } from './about/about.component';
import { PingService } from './shared/services/ping.services';
// App Component
import { AppComponent } from './core/containers/app/app.component';
import { environment } from '../environments/environment';
import { states } from './app.state';
import { routes } from './app.routing';

const config: SocketIoConfig = { url: 'http://localhost:5400', options: {} };

@NgModule({
  declarations: [
    AboutComponent
  ],
  imports: [
    CommonModule,
    BrowserModule.withServerTransition({ appId: 'nestJS' }),
    BrowserAnimationsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    RouterModule.forRoot(routes, { useHash: true }),
    // Setup
    NgxsModule.forRoot(states),
    CoreModule.forRoot(),
    AuthModule.forRoot(),
  ],
  providers: [
    PingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
