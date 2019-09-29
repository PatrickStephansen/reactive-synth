import { AudioSignalChainState } from './audio-signal-chain.state';
import { ViewMode } from '../model/view-mode';

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

      return upgradedState;

    default:
      return state;
  }
};
