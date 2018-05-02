import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';

import { Store, Select } from 'ngxs';
import { FunctionState, LoadFunctions, CreateFunction } from '../../functions.state';
import { TriggerState, LoadTriggers } from '../../triggers.state';
import { FunctionAddComponent } from '../function-add/function-add.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-function-list',
  templateUrl: './function-list.component.html',
  styleUrls: ['./function-list.component.css']
})
export class FunctionListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  responseFromApi$: Observable<any>;
  displayedColumns = ['name', 'env', 'dateCreated', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  subscriptions: Subscription[] = [];
  @Select(FunctionState) functions$: Observable<any[]>;

  constructor(private store: Store, public dialog: MatDialog) {
    store.dispatch(new LoadFunctions());
    store.dispatch(new LoadTriggers());
  }

  ngOnInit() {
    // this.responseFromApi$ = this.httpClient.get<any>('/api/functions');
    const s = this.functions$.subscribe((res) => {
      console.log('RES', res);
      // Assign the data to the data source for the table to render
      this.dataSource.data = res;
    });
    this.subscriptions.push(s);
  }
  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  openAddFunction(): void {
    const dialogRef: any = this.dialog.open(FunctionAddComponent, {
      width: '450px',
      data: { name: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      result.literal = btoa('// Add your code here...');
      this.store.dispatch(new CreateFunction(result));
    });
  }
}
