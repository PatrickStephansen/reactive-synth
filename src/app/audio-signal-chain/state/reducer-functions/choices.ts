import { AudioSignalChainState } from '../audio-signal-chain.state';

export const addChoice = (state: AudioSignalChainState, action) => ({
  ...state,
  choiceParameters: [...state.choiceParameters, action.choice]
});

export const updateChoice = (state: AudioSignalChainState, { choice }) => {
  const updatedParameters = state.choiceParameters.map(c =>
    c.moduleId === choice.moduleId && c.name === choice.parameterName
      ? { ...c, selection: choice.value }
      : c
  );
  return { ...state, choiceParameters: updatedParameters };
};
