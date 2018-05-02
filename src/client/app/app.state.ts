import { State, Selector } from 'ngxs';
import { FissionObject } from './shared/models/fission.models';
import { AuthState, AuthStateModel } from './auth/auth.state';
import { FunctionState } from './functions/functions.state';
import { TriggerState } from './functions/triggers.state';

export interface AppStateModel {
  auth: AuthStateModel;
  functions: FissionObject[];
  triggers: FissionObject[];
}

@State<AppStateModel>({
  name: 'app',
  children: [AuthState, FunctionState, TriggerState]
})
export class AppState {
  @Selector()
  static functions(state: AppStateModel): FissionObject[] {
    return state.functions;
  }

}


export const states = [AppState, AuthState, FunctionState, TriggerState];
