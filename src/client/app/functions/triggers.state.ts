import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { State, Action, StateContext, Selector } from 'ngxs';
import { FissionObject, TriggerSpec } from '../shared/models/fission.models';

export class LoadTriggers {
  constructor() {}
}

export class LoadTrigger {
  constructor(public readonly payload: string) {}
}

export class AddTrigger {
  constructor(public readonly payload: FissionObject) {}
}

export class RemoveTrigger {
  constructor(public readonly payload: string) {}
}

export class TriggerNotFound {
  constructor(public readonly payload?: string) {}
}

export class TestTrigger {
  constructor(public readonly payload: FissionObject) {}
}

@State<FissionObject[]>({
  name: 'triggers',
  defaults: []
})
export class TriggerState {
  constructor(private router: Router, private http: HttpClient) { }

  @Action(LoadTriggers)
  loadTriggers({ getState, setState }: StateContext<FissionObject[]>) {
    this.http.get('/api/triggers').subscribe((results: FissionObject[]) => {
      setState([...results]);
    });
  }

  @Action(LoadTrigger)
  loadTrigger({ getState, setState }: StateContext<FissionObject[]>, { payload }: LoadTrigger) {
    this.http.get(`/api/triggers/${payload}`).subscribe((results: FissionObject[]) => {
      setState([...results]);
    });
  }

  @Action(AddTrigger)
  addTrigger({ getState, setState }: StateContext<FissionObject[]>, { payload }: AddTrigger) {
    setState([...getState(), payload]);
  }

  @Action(RemoveTrigger)
  removeTrigger({ getState, setState }: StateContext<FissionObject[]>, { payload }: RemoveTrigger) {
    setState(getState().filter((_, i) => _.metadata.uid !== payload));
  }

  @Action(TriggerNotFound)
  fnNotFound({ getState, setState }: StateContext<FissionObject[]>, { payload }: TriggerNotFound) {
    this.router.navigate(['/404']);
  }

  @Action(TestTrigger)
  testTrigger({ getState, setState }: StateContext<FissionObject[]>, { payload }: TestTrigger) {
    this.http.get(`/api/testing${(payload.spec as TriggerSpec).relativeurl}`, { responseType: 'text' }).subscribe((results: any) => {
      const state = getState();
      const idx: number = state.findIndex(i => i.metadata.name === payload.metadata.name);
      state[idx].testResults = results;
      setState([...results]);
    });
  }


}
