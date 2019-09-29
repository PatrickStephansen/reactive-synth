import { AudioSignalChainState } from '../audio-signal-chain.state';

export const setViewMode = (state: AudioSignalChainState, action) => ({
  ...state,
  viewMode: action.viewMode
});

export const activateControlSurface = (state: AudioSignalChainState, action) => ({
  ...state,
  controlSurfaces: state.controlSurfaces.map(controlSurface => ({
    ...controlSurface,
    isActive: controlSurface.moduleId === action.activateControlSurfaceEvent.moduleId
  }))
});
