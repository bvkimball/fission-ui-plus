import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map, take } from 'rxjs/operators';

import { Store, Select } from 'ngxs';
import { AuthState, LoginRedirect } from '../auth.state';

@Injectable()
export class AuthGuard implements CanActivate {
  @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<boolean>;

  constructor(private store: Store) {}

  canActivate(): Observable<boolean> {
    return this.isLoggedIn$.pipe(
      map(authed => {
        if (!authed) {
          this.store.dispatch(new LoginRedirect());
          return false;
        }
        return true;
      }),
      take(1)
    );
  }
}
