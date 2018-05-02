import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store, Select } from 'ngxs';
import { AuthState, Login, Credentials } from '../auth.state';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'fn-login-page',
  template: `
    <fn-login-form
      (submitted)="onSubmit($event)"
      [pending]="pending$ | async"
      [errorMessage]="error$ | async">
    </fn-login-form>
  `,
  styles: [],
})
export class LoginPageComponent implements OnInit {
  @Select(AuthState.isPending) pending$: Observable<boolean>;
  @Select(AuthState.isError) error$: Observable<string>;

  constructor(private store: Store, private service: AuthService) {}

  ngOnInit() {}

  onSubmit($event: Credentials) {
    this.store.dispatch(new Login($event));
  }
}
