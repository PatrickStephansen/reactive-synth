import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AudioSignalChainState } from './audio-signal-chain.state';
import { ChoiceParameter } from '../model/choice-parameter';
import { Parameter } from '../model/parameter';
import { Visualization } from '../model/visualization/visualization';

import { always, applySpec, compose, map, omit, pick, prop } from 'ramda';
import { AudioModuleInput } from '../model/audio-module-input';

const getSignalChainsFeatureState = createFeatureSelector<AudioSignalChainState>('signalChain');
export const getSignalChainOutputActiveState = createSelector(
  getSignalChainsFeatureState,
  signalChain => !signalChain.muted
);
export const getModulesState = createSelector(
  getSignalChainsFeatureState,
  signalChain =>
    signalChain.modules.map(m => ({ ...m, name: m.name === undefined ? m.id : m.name }))
);
export const getOutputsState = createSelector(
  getSignalChainsFeatureState,
  signalChain => signalChain.outputs
);
export const getSources = createSelector(
  getOutputsState,
  (outputs, { moduleId }: { moduleId: string }) => outputs.filter(o => o.moduleId !== moduleId)
);

const getParametersState = createSelector(
  getSignalChainsFeatureState,
  signalChain => signalChain.parameters
);

const getChoiceParametersState = createSelector(
  getSignalChainsFeatureState,
  signalChain => signalChain.choiceParameters
);

const getVisualizationsState = createSelector(
  getSignalChainsFeatureState,
  signalChain => signalChain.visualizations
);

const getInputs = createSelector(
  getSignalChainsFeatureState,
  signalChain => signalChain.inputs
);

// This will crash if given bad arguments
export const getParametersForModuleState = createSelector(
  getParametersState,
  (parameters: Parameter[], { moduleId }: { moduleId: string }) =>
    parameters.filter(parameter => parameter.moduleId === moduleId)
);

export const getInputsForModuleState = createSelector(
  getInputs,
  (inputs: AudioModuleInput[], { moduleId }: { moduleId: string }) =>
    inputs.filter(input => input.moduleId === moduleId)
);

export const getChoiceParametersForModuleState = createSelector(
  getChoiceParametersState,
  (parameters: ChoiceParameter[], { moduleId }: { moduleId: string }) =>
    parameters.filter(parameter => parameter.moduleId === moduleId)
);

export const getVisualizationsForModuleState = createSelector(
  getVisualizationsState,
  (visualizations: Visualization[], { moduleId }: { moduleId: string }) =>
    visualizations.filter(v => v.moduleId === moduleId)
);

export const getSignalChainErrors = createSelector(
  getSignalChainsFeatureState,
  signalChain => signalChain.errors
);

export const getSignalChainStateForSave = createSelector(
  getSignalChainsFeatureState,
  applySpec({
    stateVersion: always(2),
    modules: compose(
      map(pick(['id', 'moduleType', 'name'])),
      prop('modules')
    ),
    inputs: prop('inputs'),
    outputs: prop('outputs'),
    choiceParameters: compose(
      map(omit(['choices'])),
      prop('choiceParameters')
    ),
    parameters: compose(
      map(pick(['name', 'moduleId', 'value', 'sources'])),
      prop('parameters')
    )
  })
);
