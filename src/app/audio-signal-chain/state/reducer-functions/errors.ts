import { AudioSignalChainState } from '../audio-signal-chain.state';

export const addError = (state: AudioSignalChainState, { error }) => ({
  ...state,
  errors: [...state.errors, error]
});

export const removeError = (state: AudioSignalChainState, action) => {
  const remainingErrors = state.errors.filter(e => e.id !== action.id);
  return { ...state, errors: remainingErrors };
};

export const clearErrors = (state: AudioSignalChainState) => ({
  ...state,
  errors: []
});
