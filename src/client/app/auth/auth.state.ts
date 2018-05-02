import { Router } from '@angular/router';
import { State, Action, StateContext, Selector } from 'ngxs';
import { AuthService } from './services/auth.service';

export interface Credentials {
  username: string;
  password: string;
}

export interface User {
  name: string;
}

export interface AuthStateModel {
  isLoggedIn: boolean;
  user: User | null;
  error: string | null;
  pending: boolean;
}

export const initialState: AuthStateModel = {
  isLoggedIn: false,
  user: null,
  error: null,
  pending: false,
};


export class Login {
  constructor(public readonly payload: Credentials) {}
}

export class Logout {
  constructor() {}
}

export class LoginSuccess {
  constructor(public payload: User) {}
}

export class LoginFailure {
  constructor(public payload: string) {}
}

export class LoginRedirect {
}


@State<AuthStateModel>({
  name: 'auth',
  defaults: initialState
})
export class AuthState {
  constructor(private router: Router, private service: AuthService) {
    console.log('Got ROuter', this.router);
  }

  @Selector()
  static isLoggedIn(state: AuthStateModel) {
    return state.isLoggedIn;
  }

  @Selector()
  static isPending(state: AuthStateModel) {
    return state.pending;
  }
  @Selector()
  static isError(state: AuthStateModel) {
    return state.error;
  }

  @Action(Login)
  async doLogin({ getState, setState, dispatch }: StateContext<AuthStateModel>, { payload }: Login) {
    try {
      const state = getState();
      setState({
        ...state,
        error: null,
        pending: true,
      });
      const user = await this.service.login(payload);
      dispatch(new LoginSuccess(user));
    } catch (err) {
      dispatch(new LoginFailure(err));
    }
  }

  @Action(LoginSuccess)
  doLoginSuccess({ getState, setState }: StateContext<AuthStateModel>, { payload }: LoginSuccess) {
    const state = getState();
    setState({
      ...state,
      error: null,
      pending: false,
      isLoggedIn: true,
      user: payload,
    });
    this.router.navigate(['/']);
  }

  @Action(LoginFailure)
  doLoginFailure({ getState, setState }: StateContext<AuthStateModel>, { payload }: LoginFailure) {
    const state = getState();
    setState({
      ...state,
      error: payload,
      pending: false,
    });
    this.router.navigate(['/login']);
  }

  @Action(LoginRedirect)
  doLoginRedirect({ getState, setState }: StateContext<AuthStateModel>) {
    this.router.navigate(['/login']);
  }

  @Action(Logout)
  doLogout({ getState, setState }: StateContext<AuthStateModel>) {
    console.log('Got Logout');
    setState(initialState);
    this.router.navigate(['/login']);
  }
}
