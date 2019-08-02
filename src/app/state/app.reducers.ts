import { appActions } from './app.actions';
import { createReducer, on } from '@ngrx/store';

const initialState = { showHelp: false };

const setHelpVisibility = (state, action) => ({ ...state, showHelp: action.showHelp });
export const reducer = createReducer(
  initialState,
  on(appActions.toggleHelp, setHelpVisibility)
);
