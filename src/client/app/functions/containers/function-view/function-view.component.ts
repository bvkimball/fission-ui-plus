import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { map, take } from 'rxjs/operators';
import { Store, Select } from 'ngxs';
import * as YAML from 'js-yaml';

import 'brace/theme/clouds';
import 'brace/mode/javascript';
import 'brace/mode/typescript';
import 'brace/mode/sh';
import 'brace/mode/yaml';

import { AppState } from '../../../app.state';
import { FunctionState, SaveFunction } from '../../functions.state';
import { TriggerState, TestTrigger } from '../../triggers.state';
import { TriggerAddComponent } from '../trigger-add/trigger-add.component';

@Component({
  selector: 'app-function-view',
  templateUrl: './function-view.component.html',
  styleUrls: ['./function-view.component.css']
})
export class FunctionViewComponent implements OnInit, AfterViewInit {

  responseFromApi$: Observable<any>;
  text = '';
  workflow: any;
  options: any = {maxLines: 1000, printMargin: false};
  @Select(AppState) isLoggedIn$: Observable<boolean>;
  @Select(FunctionState) functions$: Observable<any[]>;
  @Select(TriggerState) triggers$: Observable<any[]>;

  function$: Observable<any>;
  trigger$: Observable<any>;
  testResult: any;

  tasks = [];
  task: any;

  constructor(private store: Store, private httpClient: HttpClient, private route: ActivatedRoute, private dialog: MatDialog) {
    // this.responseFromApi$.subscribe((res) => {
    //   // Assign the data to the data source for the table to render
    //   console.log(res);
    //   this.dataSource.data = res;
    // });
  }

  ngOnInit() {
    const name = this.route.snapshot.params.name;
    this.function$ = this.functions$.pipe(
      map(entities => entities.find(entity => entity.metadata.name === name)),
      take(1)
    );
    this.trigger$ = this.triggers$.pipe(
      map(entities => entities.find(entity => entity.spec.functionref.name === name)),
      take(1)
    );
  }

  ngAfterViewInit() {
    const name = this.route.snapshot.params.name;
    console.log('INITED');
    console.log('route', name);
    this.responseFromApi$ = this.httpClient.get(`/api/functions/${name}/raw`);
    this.responseFromApi$.subscribe((res) => {
      if (res.spec.deployment && res.spec.deployment.literal) {
        this.text = atob(res.spec.deployment.literal);
      } else if (res.spec.source && res.spec.source.literal) {
        this.text = atob(res.spec.source.literal);
      }
      if (res.spec.environment.name === 'workflow') {
        this.workflow = YAML.load(this.text);
      }
    });
  }

  onChange(code) {
    console.log('new code', code);
  }

  saveFunction(fn) {
    const item: any = {
      name: fn.metadata.name,
      environment: fn.spec.environment.name,
      version: fn.metadata.resourceVersion,
      literal: btoa(this.text)
    };
    this.store.dispatch(new SaveFunction(item));
  }

  getMode(env: string) {
    switch (env) {
      case 'nodejs':
        return 'typescript';
      case 'binary':
        return 'sh';
      case 'workflow':
        return 'yaml';
      default:
        return 'javascript';
    }
  }

  showTask(task) {
    this.task = task;
  }

  openAddTrigger(): void {
    const dialogRef: any = this.dialog.open(TriggerAddComponent, {
      width: '450px',
      data: { name: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      result.literal = btoa('// Add your code here...');
      // this.store.dispatch(new CreateFunction(result));
    });
  }

  testFn(ht) {
    this.store.dispatch(new TestTrigger(ht));
  }
}
