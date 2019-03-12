import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { AudioGraphService } from '../audio-graph.service';
import {
  AudioSignalChainActionTypes,
  CreateModuleSuccess,
  AudioSignalChainAction,
  ResetSignalChainSuccess,
  ConnectModulesSuccess,
  ConnectModules,
  ChangeParameterSuccess,
  ChangeParameter,
  CreateParameterSuccess,
  ToggleSignalChainActive,
  ToggleSignalChainActiveSuccess,
  DisconnectModulesSuccess,
  DestroyModule,
  DestroyModuleSuccess,
  CreateChoiceParameterSuccess,
  ChangeChoiceParameter,
  ChangeChoiceParameterSuccess,
  ConnectParameter,
  ConnectParameterSuccess,
  DisconnectParameterSuccess,
  AddError
} from './audio-signal-chain.actions';
import { from, Observable, of, OperatorFunction } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

let errorId = 0;

@Injectable()
export class AudioSignalChainEffects {
  constructor(
    private graphService: AudioGraphService,
    private actions$: Actions
  ) {}

  private handleSignalChainChangeError: OperatorFunction<
    any,
    AudioSignalChainAction
  > = catchError(error =>
    of(
      new AddError({
        id: `signal-chain-error-${errorId++}`,
        errorMessage: error.message || error
      })
    )
  );

  @Effect()
  resetSignalChain$: Observable<AudioSignalChainAction> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.ResetSignalChain),
    mergeMap(() =>
      from(this.graphService.resetGraph()).pipe(
        map(signalChain => new ResetSignalChainSuccess(signalChain)),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  createOscillator$: Observable<AudioSignalChainAction> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.CreateOscillator),
    mergeMap(() =>
      of(() => this.graphService.createOscillator()).pipe(
        map(serviceMethod => serviceMethod()),
        mergeMap(([module, parameters, choiceParameters]) =>
          from([
            new CreateModuleSuccess(module),
            ...parameters.map(p => new CreateParameterSuccess(p)),
            ...choiceParameters.map(p => new CreateChoiceParameterSuccess(p))
          ])
        ),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  createNoiseGenerator$: Observable<AudioSignalChainAction> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.CreateNoiseGenerator),
    mergeMap(() =>
      of(() => this.graphService.createNoiseGenerator()).pipe(
        map(serviceMethod => serviceMethod()),
        mergeMap(([module, parameters]) =>
          from([
            new CreateModuleSuccess(module),
            ...parameters.map(p => new CreateParameterSuccess(p))
          ])
        ),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  createGainModule$: Observable<AudioSignalChainAction> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.CreateGainModule),
    mergeMap(() =>
      of(() => this.graphService.createGainModule()).pipe(
        map(serviceMethod => serviceMethod()),
        mergeMap(([module, parameters]) => [
          new CreateModuleSuccess(module),
          ...parameters.map(p => new CreateParameterSuccess(p))
        ]),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  createBitCrusherFixedPointModule$: Observable<AudioSignalChainAction> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.CreateBitCrusherFixedPointModule),
    mergeMap(() =>
      of(() => this.graphService.createBitCrusherFixedPointModule()).pipe(
        map(serviceMethod => serviceMethod()),
        mergeMap(([module, parameters]) => [
          new CreateModuleSuccess(module),
          ...parameters.map(p => new CreateParameterSuccess(p))
        ]),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  createDelayModule$: Observable<AudioSignalChainAction> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.CreateDelayModule),
    mergeMap(() =>
      of(() => this.graphService.createDelayModule()).pipe(
        map(serviceMethod => serviceMethod()),
        mergeMap(([module, parameters]) =>
          from([
            new CreateModuleSuccess(module),
            ...parameters.map(p => new CreateParameterSuccess(p))
          ])
        ),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  createDistortionModule$: Observable<AudioSignalChainAction> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.CreateDistortionModule),
    mergeMap(() =>
      of(() => this.graphService.createDistortionModule()).pipe(
        map(serviceMethod => serviceMethod()),
        mergeMap(([module, parameters]) =>
          from([
            new CreateModuleSuccess(module),
            ...parameters.map(p => new CreateParameterSuccess(p))
          ])
        ),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  createRectifierModule$: Observable<AudioSignalChainAction> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.CreateRectifierModule),
    mergeMap(() =>
      of(() => this.graphService.createRectifierModule()).pipe(
        map(serviceMethod => serviceMethod()),
        mergeMap(([module, parameters]) =>
          from([
            new CreateModuleSuccess(module),
            ...parameters.map(p => new CreateParameterSuccess(p))
          ])
        ),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  createConstantSource$: Observable<AudioSignalChainAction> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.CreateConstantSource),
    mergeMap(() =>
      of(() => this.graphService.createConstantSource()).pipe(
        map(serviceMethod => serviceMethod()),
        mergeMap(([module, parameters]) =>
          from([
            new CreateModuleSuccess(module),
            ...parameters.map(p => new CreateParameterSuccess(p))
          ])
        ),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  createFilterModule$: Observable<AudioSignalChainAction> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.CreateFilterModule),
    mergeMap(() =>
      of(() => this.graphService.createFilterModule()).pipe(
        map(serviceMethod => serviceMethod()),
        mergeMap(([module, parameters, choiceParameters]) =>
          from([
            new CreateModuleSuccess(module),
            ...parameters.map(p => new CreateParameterSuccess(p)),
            ...choiceParameters.map(p => new CreateChoiceParameterSuccess(p))
          ])
        ),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  connectModules$: Observable<AudioSignalChainAction> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.ConnectModules),
    mergeMap(({ payload: event }: ConnectModules) =>
      of(() =>
        this.graphService.connectModules(event.sourceId, event.destinationId)
      ).pipe(
        map(serviceMethod => serviceMethod()),
        map(() => new ConnectModulesSuccess(event)),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  disconnectModules$: Observable<AudioSignalChainAction> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.DisconnectModules),
    mergeMap(({ payload: event }: ConnectModules) =>
      of(() =>
        this.graphService.disconnectModules(event.sourceId, event.destinationId)
      ).pipe(
        map(serviceMethod => serviceMethod()),
        map(() => new DisconnectModulesSuccess(event)),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  connectParameter$: Observable<AudioSignalChainAction> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.ConnectParameter),
    mergeMap(({ payload: event }: ConnectParameter) =>
      of(() => this.graphService.connectParameter(event)).pipe(
        map(serviceMethod => serviceMethod()),
        map(() => new ConnectParameterSuccess(event)),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  disconnectParameter$: Observable<AudioSignalChainAction> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.DisconnectParameter),
    mergeMap(({ payload: event }: ConnectParameter) =>
      of(() => this.graphService.disconnectParameter(event)).pipe(
        map(serviceMethod => serviceMethod()),
        map(() => new DisconnectParameterSuccess(event)),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  changeParameter$: Observable<AudioSignalChainAction> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.ChangeParameter),
    mergeMap(({ payload: event }: ChangeParameter) =>
      of(() =>
        this.graphService.changeParameterValue(
          event.moduleId,
          event.parameterName,
          event.value
        )
      ).pipe(
        map(serviceMethod => serviceMethod()),
        map(() => new ChangeParameterSuccess(event)),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  changeChoiceParameter$: Observable<AudioSignalChainAction> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.ChangeChoiceParameter),
    mergeMap(({ payload: event }: ChangeChoiceParameter) =>
      of(() =>
        this.graphService.makeChoice(
          event.moduleId,
          event.parameterName,
          event.value
        )
      ).pipe(
        map(serviceMethod => serviceMethod()),
        map(() => new ChangeChoiceParameterSuccess(event)),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  toggleSignalChainActive$: Observable<AudioSignalChainAction> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.ToggleSignalChainActive),
    mergeMap(({ payload: activate }: ToggleSignalChainActive) => {
      const servicePromise = activate
        ? this.graphService.unmute()
        : this.graphService.mute();

      return from(servicePromise).pipe(
        map(() => new ToggleSignalChainActiveSuccess(activate)),
        this.handleSignalChainChangeError
      );
    })
  );

  @Effect()
  destroyModule$: Observable<AudioSignalChainAction> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.DestroyModule),
    mergeMap(({ moduleId }: DestroyModule) =>
      of(() => this.graphService.destroyModule(moduleId)).pipe(
        map(serviceMethod => serviceMethod()),
        map(() => new DestroyModuleSuccess(moduleId)),
        this.handleSignalChainChangeError
      )
    )
  );
}
