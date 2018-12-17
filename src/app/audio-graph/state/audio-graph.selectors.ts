import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AudioGraphState } from './audio-graph.state';
import { ChoiceParameter } from '../model/choice-parameter';
import { Parameter } from '../model/parameter';
import { Visualization } from '../model/visualization/visualization';

const getGraphsFeatureState = createFeatureSelector<AudioGraphState>('graph');
export const getGraphOutputActiveState = createSelector(
  getGraphsFeatureState,
  graph => !graph.muted
);
export const getNodesState = createSelector(
  getGraphsFeatureState,
  graph => graph.nodes
);
export const getSourceNodeIds = createSelector(
  getNodesState,
  (nodes, { nodeId }: { nodeId: string }) =>
    nodes.filter(n => n.id !== nodeId && n.numberOutputs).map(n => n.id)
);

const getParametersState = createSelector(
  getGraphsFeatureState,
  graph => graph.parameters
);

const getChoiceParametersState = createSelector(
  getGraphsFeatureState,
  graph => graph.choiceParameters
);

const getVisualizationsState = createSelector(
  getGraphsFeatureState,
  graph => graph.visualizations
);

// This will crash if given bad arguments
export const getParametersForNodeState = createSelector(
  getParametersState,
  (parameters: Parameter[], { nodeId }: { nodeId: string }) =>
    parameters.filter(parameter => parameter.nodeId === nodeId)
);

export const getChoiceParametersForNodeState = createSelector(
  getChoiceParametersState,
  (parameters: ChoiceParameter[], { nodeId }: { nodeId: string }) =>
    parameters.filter(parameter => parameter.nodeId === nodeId)
);

export const getVisualizationsForNodeState = createSelector(
  getVisualizationsState,
  (visualizations: Visualization[], { nodeId }: { nodeId: string }) =>
    visualizations.filter(v => v.nodeId === nodeId)
);

export const getGraphErrors = createSelector(
  getGraphsFeatureState,
  graph => graph.errors
);
