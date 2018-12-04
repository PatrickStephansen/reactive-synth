import { Action } from '@ngrx/store';

export enum AppActionTypes {
  ToggleHelp = '[App] Toggle Help'
}

export class ToggleHelp implements Action {
  readonly type = AppActionTypes.ToggleHelp;

  constructor(public showHelp: boolean) {}
}

export type AppAction = ToggleHelp;
