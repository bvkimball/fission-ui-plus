import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-environment-list',
  templateUrl: './environment-list.component.html',
  styleUrls: ['./environment-list.component.css']
})
export class EnvironmentListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  responseFromApi$: Observable<any>;
  displayedColumns = ['name', 'image', 'dateCreated', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.responseFromApi$ = this.httpClient.get<any>('/api/environments');
    this.responseFromApi$.subscribe((res) => {
      // Assign the data to the data source for the table to render
      console.log(res);
      this.dataSource.data = res;
    });
  }



  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
