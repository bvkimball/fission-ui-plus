import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, take, switchMap, tap, catchError } from 'rxjs/operators';

import { Store, Select } from 'ngxs';
import { FunctionState, FunctionNotFound, AddFunction } from '../functions.state';


/**
 * Guards are hooks into the route resolution process, providing an opportunity
 * to inform the router's navigation process whether the route should continue
 * to activate this route. Guards must return an observable of true or false.
 */
@Injectable()
export class FunctionExistsGuard implements CanActivate {
    @Select(FunctionState) functions$: Observable<any[]>;

  constructor(
    private store: Store,
    private http: HttpClient
  ) {}

  /**
   * This method creates an observable that waits for the `loaded` property
   * of the collection state to turn `true`, emitting one time once loading
   * has finished.
   */
  waitForCollectionToLoad(): Observable<any[]> {
    return this.functions$.pipe(take(1));
  }

  /**
   * This method checks if a book with the given ID is already registered
   * in the Store
   */
  hasFunctionInStore(name: string): Observable<boolean> {
    return this.functions$.pipe(
      map(entities => !!entities.find(entity => entity.metadata.name === name)),
      take(1)
    );
  }

  /**
   * This method loads a book with the given ID from the API and caches
   * it in the store, returning `true` or `false` if it was found.
   */
  hasFunctionInApi(name: string): Observable<boolean> {
    return this.http.get<any>(`/api/functions/${name}`).pipe(
      map(result => new AddFunction(result)),
      tap((action: AddFunction) => this.store.dispatch(action)),
      map(fn => !!fn),
      catchError(() => {
        this.store.dispatch(new FunctionNotFound(name));
        return of(false);
      })
    );
  }

  /**
   * `hasFunction` composes `hasFunctionInStore` and `hasFunctionInApi`. It first checks
   * if the book is in store, and if not it then checks if it is in the
   * API.
   */
  hasFunction(name: string): Observable<boolean> {
    return this.hasFunctionInStore(name).pipe(
      switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }

        return this.hasFunctionInApi(name);
      })
    );
  }

  /**
   * This is the actual method the router will call when our guard is run.
   *
   * Our guard waits for the collection to load, then it checks if we need
   * to request a book from the API or if we already have it in our cache.
   * If it finds it in the cache or in the API, it returns an Observable
   * of `true` and the route is rendered successfully.
   *
   * If it was unable to find it in our cache or in the API, this guard
   * will return an Observable of `false`, causing the router to move
   * on to the next candidate route. In this case, it will move on
   * to the 404 page.
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.hasFunction(route.params['name']);
  }
}
