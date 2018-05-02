import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EnvironmentListComponent } from './containers/environment-list/environment-list.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild([
      { path: '', component: EnvironmentListComponent },
    ]),
  ],
  declarations: [
    EnvironmentListComponent,
  ],
})
export class EnvironmentsModule {}
