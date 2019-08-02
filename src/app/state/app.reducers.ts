import { appActions } from './app.actions';
import { createReducer, on, Action } from '@ngrx/store';
import { AppState } from './app.state';

const initialState = { showHelp: false };

const setHelpVisibility = (state, action) => ({ ...state, showHelp: action.showHelp });
export const realReducer = createReducer(
  initialState,
  on(appActions.toggleHelp, setHelpVisibility)
);

export function reducer(state: AppState, action: Action) {
  return realReducer(state, action);
}
