import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AceEditorModule } from 'ng2-ace-editor';

import { MaterialModule } from '../material/material.module';
import { FunctionListComponent } from './containers/function-list/function-list.component';
import { FunctionViewComponent } from './containers/function-view/function-view.component';
import { FunctionAddComponent } from './containers/function-add/function-add.component';
import { TriggerAddComponent } from './containers/trigger-add/trigger-add.component';

import { FunctionExistsGuard } from './services/function-exists.service';
import { GraphComponent } from './components/graph/graph.component';
import { CytoscapeComponent } from './components/cytoscape/cytoscape.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    AceEditorModule,
    RouterModule.forChild([
      {
        path: ':name',
        component: FunctionViewComponent,
        canActivate: [FunctionExistsGuard],
      },
      { path: '', component: FunctionListComponent },
    ]),
  ],
  declarations: [
    FunctionListComponent,
    FunctionViewComponent,
    GraphComponent,
    CytoscapeComponent,
    FunctionAddComponent,
    TriggerAddComponent
  ],
  entryComponents: [FunctionAddComponent, TriggerAddComponent],
  providers: [FunctionExistsGuard],
})
export class FunctionsModule {}
