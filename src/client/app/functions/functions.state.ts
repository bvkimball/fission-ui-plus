import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { State, Action, StateContext, Selector } from 'ngxs';
import { FissionObject } from '../shared/models/fission.models';

export class LoadFunctions {
  constructor() {}
}

export class LoadFunction {
  constructor(public readonly payload: string) {}
}

export class CreateFunction {
  constructor(public readonly payload: any) {}
}
export class SaveFunction {
  constructor(public readonly payload: any) {}
}

export class AddFunction {
  constructor(public readonly payload: FissionObject) {}
}

export class RemoveFunction {
  constructor(public readonly payload: string) {}
}
export class FunctionNotFound {
  constructor(public readonly payload?: string) {}
}

@State<FissionObject[]>({
  name: 'functions',
  defaults: []
})
export class FunctionState {
  constructor(private router: Router, private http: HttpClient) { }

  @Action(LoadFunctions)
  loadFunctions({ getState, setState }: StateContext<FissionObject[]>) {
    this.http.get('/api/functions').subscribe((results: FissionObject[]) => {
      setState([...results]);
    });
  }

  @Action(CreateFunction)
  createFunction({ getState, setState }: StateContext<FissionObject[]>, { payload }: CreateFunction) {
    this.http.post(`/api/functions`, payload).subscribe((results: FissionObject[]) => {
      console.log('created', results);
      // setState([...results]);
    });
  }

  @Action(SaveFunction)
  saveFunction({ getState, setState }: StateContext<FissionObject[]>, { payload }: SaveFunction) {
    this.http.put(`/api/functions/${payload.name}`, payload).subscribe((results: any) => {
      console.log('save', results);
      const state = getState();
      const idx: number = state.findIndex(i => i.metadata.name === results.name);
      state[idx].metadata.resourceVersion = results.resourceVersion;
      setState([...state]);
    });
  }

  @Action(LoadFunction)
  loadFunction({ getState, setState }: StateContext<FissionObject[]>, { payload }: LoadFunction) {
    this.http.get(`/api/functions/${payload}`).subscribe((results: FissionObject[]) => {
      setState([...results]);
    });
  }

  @Action(AddFunction)
  addFunction({ getState, setState }: StateContext<FissionObject[]>, { payload }: AddFunction) {
    setState([...getState(), payload]);
  }

  @Action(RemoveFunction)
  removeFunction({ getState, setState }: StateContext<FissionObject[]>, { payload }: RemoveFunction) {
    setState(getState().filter((_, i) => _.metadata.uid !== payload));
  }

  @Action(FunctionNotFound)
  fnNotFound({ getState, setState }: StateContext<FissionObject[]>, { payload }: FunctionNotFound) {
    this.router.navigate(['/404']);
  }

}
