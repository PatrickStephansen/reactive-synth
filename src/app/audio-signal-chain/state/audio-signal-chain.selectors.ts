import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AudioSignalChainState } from './audio-signal-chain.state';
import { ChoiceParameter } from '../model/choice-parameter';
import { Parameter } from '../model/parameter';
import { Visualization } from '../model/visualization/visualization';

import {
  applySpec,
  compose,
  map,
  omit,
  pick,
  prop
} from 'ramda';

const getSignalChainsFeatureState = createFeatureSelector<
  AudioSignalChainState
>('signalChain');
export const getSignalChainOutputActiveState = createSelector(
  getSignalChainsFeatureState,
  signalChain => !signalChain.muted
);
export const getModulesState = createSelector(
  getSignalChainsFeatureState,
  signalChain => signalChain.modules
);
export const getSourceModuleIds = createSelector(
  getModulesState,
  (modules, { moduleId }: { moduleId: string }) =>
    modules.filter(n => n.id !== moduleId && n.numberOutputs).map(n => n.id)
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

// This will crash if given bad arguments
export const getParametersForModuleState = createSelector(
  getParametersState,
  (parameters: Parameter[], { moduleId }: { moduleId: string }) =>
    parameters.filter(parameter => parameter.moduleId === moduleId)
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
    modules: compose(
      map(pick(['id', 'moduleType', 'sourceIds'])),
      prop('modules')
    ),
    choiceParameters: compose(
      map(omit(['choices'])),
      prop('choiceParameters')
    ),
    parameters: compose(
      map(pick(['name', 'moduleId', 'value', 'sourceIds'])),
      prop('parameters')
    )
  })
);
