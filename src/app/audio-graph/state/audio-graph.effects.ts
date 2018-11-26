import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { AudioGraphService } from '../audio-graph.service';
import {
  AudioGraphActionTypes,
  CreateOscillatorSuccess,
  AudioGraphAction,
  ResetGraphSuccess,
  ConnectNodesSuccess,
  ConnectNodes,
  ChangeParameterSuccess,
  ChangeParameter,
  CreateParameterSuccess,
  ToggleGraphActive,
  ToggleGraphActiveSuccess,
  DisconnectNodesSuccess,
  DestroyNode,
  DestroyNodeSuccess,
  CreateChoiceParameterSuccess,
  ChangeChoiceParameter
} from './audio-graph.actions';
import { from, Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

@Injectable()
export class AudioGraphEffects {
  constructor(
    private graphService: AudioGraphService,
    private actions$: Actions
  ) {}

  @Effect()
  resetGraph$: Observable<ResetGraphSuccess> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.ResetGraph),
    mergeMap(() =>
      from(this.graphService.resetGraph()).pipe(
        map(graph => new ResetGraphSuccess(graph))
      )
    )
  );

  @Effect()
  createOscillator$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.CreateOscillator),
    mergeMap(() => {
      const [
        node,
        parameters,
        choiceParameters
      ] = this.graphService.createOscillator();
      return from([
        new CreateOscillatorSuccess(node),
        ...parameters.map(p => new CreateParameterSuccess(p)),
        ...choiceParameters.map(p => new CreateChoiceParameterSuccess(p))
      ]);
    })
  );

  @Effect()
  createGainNode$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.CreateGainNode),
    mergeMap(() => {
      const [node, parameters] = this.graphService.createGainNode();
      return from([
        new CreateOscillatorSuccess(node),
        ...parameters.map(p => new CreateParameterSuccess(p))
      ]);
    })
  );

  @Effect()
  createDistortionNode$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.CreateDistortionNode),
    mergeMap(() => {
      const [node, parameters] = this.graphService.createDistortionNode();
      return from([
        new CreateOscillatorSuccess(node),
        ...parameters.map(p => new CreateParameterSuccess(p))
      ]);
    })
  );

  @Effect()
  connectNodes$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.ConnectNodes),
    map(({ payload: event }: ConnectNodes) => {
      this.graphService.connectNodes(event.sourceId, event.destinationId);
      return new ConnectNodesSuccess(event);
    })
  );

  @Effect()
  disconnectNodes$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.DisconnectNodes),
    map(({ payload: event }: ConnectNodes) => {
      this.graphService.disconnectNodes(event.sourceId, event.destinationId);
      return new DisconnectNodesSuccess(event);
    })
  );

  @Effect()
  changeParameter$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.ChangeParameter),
    map(({ payload: event }: ChangeParameter) => {
      this.graphService.changeParameterValue(
        event.nodeId,
        event.parameterName,
        event.value
      );
      return new ChangeParameterSuccess(event);
    })
  );

  @Effect()
  changeChoiceParameter$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.ChangeChoiceParameter),
    map(({ payload: event }: ChangeChoiceParameter) => {
      this.graphService.changeParameterValue(
        event.nodeId,
        event.parameterName,
        event.value
      );
      return new ChangeParameterSuccess(event);
    })
  );

  @Effect()
  toggleGraphActive$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.ToggleGraphActive),
    mergeMap(({ payload: activate }: ToggleGraphActive) => {
      const servicePromise = activate
        ? this.graphService.unmute()
        : this.graphService.mute();

      return of(servicePromise).pipe(
        map(() => new ToggleGraphActiveSuccess(activate))
      );
    })
  );

  @Effect()
  destroyNode$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.DestroyNode),
    map(({ nodeId }: DestroyNode) => {
      this.graphService.destroyNode(nodeId);
      return new DestroyNodeSuccess(nodeId);
    })
  );
}
