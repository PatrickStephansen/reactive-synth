import { AppState } from './app.state';

import { AppAction, AppActionTypes } from './app.actions';

const initialState = { showHelp: false };

export function reducer(state: AppState = initialState, action: AppAction) {
  switch (action.type) {
    case AppActionTypes.ToggleHelp:
      return { ...state, showHelp: action.showHelp };

    default:
      return state;
  }
}
