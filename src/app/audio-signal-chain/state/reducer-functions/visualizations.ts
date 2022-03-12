import { AudioSignalChainState } from '../audio-signal-chain.state';

export const setVisualizationActive = (state: AudioSignalChainState, { change }) => {
  const visualizations = state.visualizations.map(v =>
    v.moduleId === change.moduleId && v.name === change.name ? { ...v, isActive: change.show } : v
  );
  return { ...state, visualizations };
};

export const addVisualization = (state: AudioSignalChainState, { visualization }) => ({
  ...state,
  visualizations: [...state.visualizations, visualization]
});
