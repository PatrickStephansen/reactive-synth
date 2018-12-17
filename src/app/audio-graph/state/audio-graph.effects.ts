import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { AudioGraphService } from '../audio-graph.service';
import {
  AudioGraphActionTypes,
  CreateNodeSuccess,
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
  ChangeChoiceParameter,
  ChangeChoiceParameterSuccess,
  ConnectParameter,
  ConnectParameterSuccess,
  DisconnectParameterSuccess,
  AddError
} from './audio-graph.actions';
import { from, Observable, of, OperatorFunction } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

let errorId = 0;

@Injectable()
export class AudioGraphEffects {
  constructor(
    private graphService: AudioGraphService,
    private actions$: Actions
  ) {}

  private handleGraphChangeError: OperatorFunction<
    any,
    AudioGraphAction
  > = catchError(error =>
    of(
      new AddError({
        id: `graph-error-${errorId++}`,
        errorMessage: error.message || error
      })
    )
  );

  @Effect()
  resetGraph$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.ResetGraph),
    mergeMap(() =>
      from(this.graphService.resetGraph()).pipe(
        map(graph => new ResetGraphSuccess(graph)),
        this.handleGraphChangeError
      )
    )
  );

  @Effect()
  createOscillator$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.CreateOscillator),
    mergeMap(() =>
      of(() => this.graphService.createOscillator()).pipe(
        map(serviceMethod => serviceMethod()),
        mergeMap(([node, parameters, choiceParameters]) =>
          from([
            new CreateNodeSuccess(node),
            ...parameters.map(p => new CreateParameterSuccess(p)),
            ...choiceParameters.map(p => new CreateChoiceParameterSuccess(p))
          ])
        ),
        this.handleGraphChangeError
      )
    )
  );

  @Effect()
  createGainNode$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.CreateGainNode),
    mergeMap(() =>
      of(() => this.graphService.createGainNode()).pipe(
        map(serviceMethod => serviceMethod()),
        mergeMap(([node, parameters]) => [
          new CreateNodeSuccess(node),
          ...parameters.map(p => new CreateParameterSuccess(p))
        ]),
        this.handleGraphChangeError
      )
    )
  );

  @Effect()
  createDelayNode$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.CreateDelayNode),
    mergeMap(() =>
      of(() => this.graphService.createDelayNode()).pipe(
        map(serviceMethod => serviceMethod()),
        mergeMap(([node, parameters]) =>
          from([
            new CreateNodeSuccess(node),
            ...parameters.map(p => new CreateParameterSuccess(p))
          ])
        ),
        this.handleGraphChangeError
      )
    )
  );

  @Effect()
  createDistortionNode$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.CreateDistortionNode),
    mergeMap(() =>
      of(() => this.graphService.createDistortionNode()).pipe(
        map(serviceMethod => serviceMethod()),
        mergeMap(([node, parameters]) =>
          from([
            new CreateNodeSuccess(node),
            ...parameters.map(p => new CreateParameterSuccess(p))
          ])
        ),
        this.handleGraphChangeError
      )
    )
  );

  @Effect()
  createRectifierNode$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.CreateRectifierNode),
    mergeMap(() =>
      of(() => this.graphService.createRectifierNode()).pipe(
        map(serviceMethod => serviceMethod()),
        mergeMap(([node, parameters]) =>
          from([
            new CreateNodeSuccess(node),
            ...parameters.map(p => new CreateParameterSuccess(p))
          ])
        ),
        this.handleGraphChangeError
      )
    )
  );

  @Effect()
  createConstantSource$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.CreateConstantSource),
    mergeMap(() =>
      of(() => this.graphService.createConstantSource()).pipe(
        map(serviceMethod => serviceMethod()),
        mergeMap(([node, parameters]) =>
          from([
            new CreateNodeSuccess(node),
            ...parameters.map(p => new CreateParameterSuccess(p))
          ])
        ),
        this.handleGraphChangeError
      )
    )
  );

  @Effect()
  createFilterNode$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.CreateFilterNode),
    mergeMap(() =>
      of(() => this.graphService.createFilterNode()).pipe(
        map(serviceMethod => serviceMethod()),
        mergeMap(([node, parameters, choiceParameters]) =>
          from([
            new CreateNodeSuccess(node),
            ...parameters.map(p => new CreateParameterSuccess(p)),
            ...choiceParameters.map(p => new CreateChoiceParameterSuccess(p))
          ])
        ),
        this.handleGraphChangeError
      )
    )
  );

  @Effect()
  connectNodes$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.ConnectNodes),
    mergeMap(({ payload: event }: ConnectNodes) =>
      of(() =>
        this.graphService.connectNodes(event.sourceId, event.destinationId)
      ).pipe(
        map(serviceMethod => serviceMethod()),
        map(() => new ConnectNodesSuccess(event)),
        this.handleGraphChangeError
      )
    )
  );

  @Effect()
  disconnectNodes$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.DisconnectNodes),
    mergeMap(({ payload: event }: ConnectNodes) =>
      of(() =>
        this.graphService.disconnectNodes(event.sourceId, event.destinationId)
      ).pipe(
        map(serviceMethod => serviceMethod()),
        map(() => new DisconnectNodesSuccess(event)),
        this.handleGraphChangeError
      )
    )
  );

  @Effect()
  connectParameter$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.ConnectParameter),
    mergeMap(({ payload: event }: ConnectParameter) =>
      of(() => this.graphService.connectParameter(event)).pipe(
        map(serviceMethod => serviceMethod()),
        map(() => new ConnectParameterSuccess(event)),
        this.handleGraphChangeError
      )
    )
  );

  @Effect()
  disconnectParameter$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.DisconnectParameter),
    mergeMap(({ payload: event }: ConnectParameter) =>
      of(() => this.graphService.disconnectParameter(event)).pipe(
        map(serviceMethod => serviceMethod()),
        map(() => new DisconnectParameterSuccess(event)),
        this.handleGraphChangeError
      )
    )
  );

  @Effect()
  changeParameter$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.ChangeParameter),
    mergeMap(({ payload: event }: ChangeParameter) =>
      of(() =>
        this.graphService.changeParameterValue(
          event.nodeId,
          event.parameterName,
          event.value
        )
      ).pipe(
        map(serviceMethod => serviceMethod()),
        map(() => new ChangeParameterSuccess(event)),
        this.handleGraphChangeError
      )
    )
  );

  @Effect()
  changeChoiceParameter$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.ChangeChoiceParameter),
    mergeMap(({ payload: event }: ChangeChoiceParameter) =>
      of(() =>
        this.graphService.makeChoice(
          event.nodeId,
          event.parameterName,
          event.value
        )
      ).pipe(
        map(serviceMethod => serviceMethod()),
        map(() => new ChangeChoiceParameterSuccess(event)),
        this.handleGraphChangeError
      )
    )
  );

  @Effect()
  toggleGraphActive$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.ToggleGraphActive),
    mergeMap(({ payload: activate }: ToggleGraphActive) => {
      const servicePromise = activate
        ? this.graphService.unmute()
        : this.graphService.mute();

      return from(servicePromise).pipe(
        map(() => new ToggleGraphActiveSuccess(activate)),
        this.handleGraphChangeError
      );
    })
  );

  @Effect()
  destroyNode$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.DestroyNode),
    mergeMap(({ nodeId }: DestroyNode) =>
      of(() => this.graphService.destroyNode(nodeId)).pipe(
        map(serviceMethod => serviceMethod()),
        map(() => new DestroyNodeSuccess(nodeId)),
        this.handleGraphChangeError
      )
    )
  );
}
