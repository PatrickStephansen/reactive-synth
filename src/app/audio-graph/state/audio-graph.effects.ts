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
  ChangeParameter
} from './audio-graph.actions';
import { from, Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { ConnectNodesEvent } from '../connect-nodes-event';

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
        map(() => new ResetGraphSuccess())
      )
    )
  );

  @Effect()
  createOscillator$: Observable<AudioGraphAction> = this.actions$.pipe(
    ofType(AudioGraphActionTypes.CreateOscillator),
    map(() => new CreateOscillatorSuccess(this.graphService.createOscillator()))
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
}
