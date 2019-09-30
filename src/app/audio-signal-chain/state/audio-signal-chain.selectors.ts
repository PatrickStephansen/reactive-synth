import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AudioSignalChainState } from './audio-signal-chain.state';
import { ChoiceParameter } from '../model/choice-parameter';
import { Parameter } from '../model/parameter';
import { Visualization } from '../model/visualization/visualization';

import { always, applySpec, compose, map, omit, pick, prop } from 'ramda';
import { AudioModuleInput } from '../model/audio-module-input';
import { AudioModuleOutput } from '../model/audio-module-output';
import { AudioModuleType } from '../model/audio-module-type';

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
  signalChain =>
    signalChain.outputs.map(o => ({
      ...o,
      moduleName: signalChain.modules.find(m => m.id === o.moduleId).name
    }))
);
export const getSources = createSelector(
  getOutputsState,
  (outputs: AudioModuleOutput[], { moduleId }: { moduleId: string }) =>
    outputs.filter(o => o.moduleId !== moduleId)
);
export const getControlSurfaces = createSelector(
  getModulesState,
  modules => modules.filter(module => module.moduleType === AudioModuleType.ControlSurface)
);
const getActiveControlSurfaceId = createSelector(
  getSignalChainsFeatureState,
  signalChain => signalChain.activeControlSurfaceId
);
const moduleToControlSurface = module => (module ? { moduleId: module.id, isActive: true } : null);
export const getActiveControlSurface = createSelector(
  getControlSurfaces,
  getActiveControlSurfaceId,
  (controlSurfaces, activeControlSurfaceId) =>
    moduleToControlSurface(
      controlSurfaces.find(controlSurface => controlSurface.id === activeControlSurfaceId)
    )
);
export const getViewMode = createSelector(
  getSignalChainsFeatureState,
  signalChain => signalChain.viewMode
);

const getParametersState = createSelector(
  getSignalChainsFeatureState,
  (signalChain: AudioSignalChainState) =>
    signalChain.parameters.map(p => ({
      ...p,
      sources: p.sources.map(
        s =>
          ({
            ...s,
            moduleName: signalChain.modules.find(m => m.id === s.moduleId).name
          } as AudioModuleOutput)
      ),
      maxShownValue: p.maxShownValue === undefined ? p.maxValue : p.maxShownValue,
      minShownValue: p.maxShownValue === undefined ? p.minValue : p.minShownValue
    }))
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
  signalChain =>
    signalChain.inputs.map(input => ({
      ...input,
      sources: input.sources.map(source => ({
        ...source,
        moduleName: signalChain.modules.find(module => module.id === source.moduleId).name
      }))
    }))
);

// This will crash if given bad arguments
export const getParametersForModuleState = createSelector(
  getParametersState,
  (parameters: Parameter[], { moduleId }: { moduleId: string }) =>
    parameters.filter(parameter => parameter.moduleId === moduleId)
);

export const getParameterState = createSelector(
  getParametersState,
  (
    parameters: Parameter[],
    { moduleId, parameterName }: { moduleId: string; parameterName: string }
  ) =>
    parameters.find(
      parameter => parameter.moduleId === moduleId && parameter.name === parameterName
    )
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
      map(pick(['name', 'moduleId', 'value', 'sources', 'canConnectSources'])),
      prop('parameters')
    )
  })
);
