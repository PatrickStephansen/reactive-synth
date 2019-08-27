import { AudioSignalChainState } from '../audio-signal-chain.state';
import { statement } from '@babel/template';
import { ChangeModuleNameEvent } from '../../model/change-module-name-event';

export const connectModules = (state: AudioSignalChainState, { connection }) => {
  const updatedInputs = state.inputs.map(i =>
    i.moduleId === connection.destinationId && i.name === connection.destinationInputName
      ? {
          ...i,
          sources: [
            ...i.sources,
            {
              moduleId: connection.sourceId,
              name: connection.sourceOutputName
            }
          ]
        }
      : i
  );
  return { ...state, inputs: updatedInputs };
};

export const disconnectModules = (state: AudioSignalChainState, { connection }) => {
  const updatedInputs = state.inputs.map(i =>
    i.moduleId === connection.destinationId && i.name === connection.destinationInputName
      ? {
          ...i,
          sources: i.sources.filter(
            s => !(s.moduleId === connection.sourceId && s.name === connection.sourceOutputName)
          )
        }
      : i
  );
  return { ...state, inputs: updatedInputs };
};

export const addModule = (state: AudioSignalChainState, action) => ({
  ...state,
  modules: [...state.modules, action.module]
});

export const removeModule = (state: AudioSignalChainState, { moduleId }) => {
  const remainingModules = state.modules.filter(m => m.id !== moduleId);
  const remainingOutputs = state.outputs.filter(o => o.moduleId !== moduleId);
  const remainingInputs = state.inputs
    .filter(i => i.moduleId !== moduleId)
    .map(i => ({
      ...i,
      sources: i.sources.filter(s => s.moduleId !== moduleId)
    }));
  const remainingParameters = state.parameters
    .filter(p => p.moduleId !== moduleId)
    .map(p => ({
      ...p,
      sources: p.sources.filter(s => s.moduleId !== moduleId)
    }));
  const remainingChoiceParameters = state.choiceParameters.filter(p => p.moduleId !== moduleId);
  return {
    ...state,
    modules: remainingModules,
    inputs: remainingInputs,
    outputs: remainingOutputs,
    parameters: remainingParameters,
    choiceParameters: remainingChoiceParameters
  };
};

export const changeModuleName = (
  state: AudioSignalChainState,
  { nameChange: { moduleId, name } }
) => {
  return { ...state, modules: state.modules.map(m => (m.id === moduleId ? { ...m, name } : m)) };
};
