import { AudioSignalChainState } from '../audio-signal-chain.state';
import { ChangeParameterBoundsEvent } from '../../model/change-parameter-bounds-event';

export const updateParameter = (state: AudioSignalChainState, { parameter }) => {
  const updatedParameters = state.parameters.map(p =>
    p.moduleId === parameter.moduleId && p.name === parameter.parameterName
      ? { ...p, value: parameter.value }
      : p
  );
  return { ...state, parameters: updatedParameters };
};

export const disconnectParameter = (state: AudioSignalChainState, { connection }) => {
  const updatedParameters = state.parameters.map(p =>
    p.moduleId === connection.destinationModuleId && p.name === connection.destinationParameterName
      ? {
          ...p,
          sources: p.sources.filter(
            s =>
              !(connection.sourceModuleId === s.moduleId && connection.sourceOutputName === s.name)
          )
        }
      : p
  );
  return { ...state, parameters: updatedParameters };
};

export const connectParameter = (state: AudioSignalChainState, { connection }) => {
  const updatedParameters = state.parameters.map(p =>
    p.moduleId === connection.destinationModuleId && p.name === connection.destinationParameterName
      ? {
          ...p,
          sources: [
            ...p.sources,
            {
              moduleId: connection.sourceModuleId,
              name: connection.sourceOutputName
            }
          ]
        }
      : p
  );
  return { ...state, parameters: updatedParameters };
};

export const addParameter = (state: AudioSignalChainState, action) => ({
  ...state,
  parameters: [...state.parameters, action.parameter]
});

export const changeParameterBounds = (
  state: AudioSignalChainState,
  { change }: { change: ChangeParameterBoundsEvent }
) => ({
  ...state,
  parameters: state.parameters.map(parameter =>
    parameter.moduleId === change.moduleId && parameter.name === change.parameterName
      ? {
          ...parameter,
          minShownValue: Math.max(
            parameter.minValue,
            Math.min(change.newMaxValue, change.newMinValue)
          ),
          maxShownValue: Math.min(
            parameter.maxValue,
            Math.max(change.newMaxValue, change.newMinValue)
          )
        }
      : parameter
  )
});
