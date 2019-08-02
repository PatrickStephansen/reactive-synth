import { createAction, props } from '@ngrx/store';

export enum AppActionTypes {
  ToggleHelp = '[App] Toggle Help'
}

export const appActions = {
  toggleHelp: createAction(AppActionTypes.ToggleHelp, props<{ showHelp: boolean }>())
};
