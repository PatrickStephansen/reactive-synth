import { AudioSignalChainState } from './audio-signal-chain.state';
import { ViewMode } from '../model/view-mode';

const appendDefaultTicksAfterResetParameter = state =>
  state.parameters.some(p => p.name === 'ticks on reset')
    ? state
    : {
        ...state,
        parameters: [
          ...state.parameters,
          ...state.parameters
            .filter(p => p.name === 'attack after ticks')
            .map(a => ({
              name: 'ticks on reset',
              moduleId: a.moduleId,
              value: a.value - 1,
              sources: [],
              canConnectSources: true
            }))
        ]
      };

export const upgradeAudioChainStateVersion = (state, version: number): AudioSignalChainState => {
  switch (version) {
    case 1:
      const upgradedState = {
        errors: [],
        muted: true,
        visualizations: [],
        modules: state.modules.map(m => ({
          id: m.id,
          moduleType: m.moduleType,
          name: m.name
        })),
        controlSurfaces: state.controlSurfaces || [],
        viewMode: ViewMode.Modules,
        choiceParameters: state.choiceParameters,
        outputs: state.modules
          .map(m => ({
            moduleId: m.id,
            name: 'output'
          }))
          .filter(m => m.name),
        inputs: state.modules
          .filter(m => m.sourceIds && m.sourceIds.length)
          .map(m => ({
            name: m.moduleType === 'output' ? 'audio to play' : 'input',
            moduleId: m.id,
            sources: m.sourceIds.map(s => ({
              moduleId: s,
              name: 'output'
            }))
          })),
        parameters: state.parameters.map(p => ({
          name: p.name,
          moduleId: p.moduleId,
          value: p.value,
          sources: p.sourceIds.map(s => ({
            moduleId: s,
            name: 'output'
          })),
          canConnectSources: p.canConnectSources === undefined ? true : p.canConnectSources
        }))
      };

      return appendDefaultTicksAfterResetParameter(upgradedState);

    default:
      return appendDefaultTicksAfterResetParameter(state);
  }
};
