import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AudioGraphState } from './audio-graph.state';

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

// This will crash if given bad arguments
export const getParametersForNodeState = createSelector(
  getParametersState,
  (parameters, { nodeId }: { nodeId: string }) =>
    parameters.filter(parameter => parameter.nodeId === nodeId)
);

export const getChoiceParametersForNodeState = createSelector(
  getChoiceParametersState,
  (parameters, { nodeId }: { nodeId: string }) =>
    parameters.filter(parameter => parameter.nodeId === nodeId)
);

export const getGraphErrors = createSelector(
  getGraphsFeatureState,
  graph => graph.errors
);
