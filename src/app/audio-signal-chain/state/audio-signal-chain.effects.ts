import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Actions, Effect, ofType, OnInitEffects } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { from, Observable, of, OperatorFunction } from 'rxjs';
import { mergeMap, map, catchError, tap, filter, debounceTime } from 'rxjs/operators';
import { compose, flatten, head, isNil, last, not, path } from 'ramda';

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
  AddError,
  CreateModule,
  LoadSignalChainState,
  ResetSignalChain
} from './audio-signal-chain.actions';
import { CreateModuleResult } from '../model/create-module-result';
import { AudioSignalChainState } from './audio-signal-chain.state';
import { getSignalChainStateForSave } from './audio-signal-chain.selectors';
import { CreateModuleEvent } from '../model/create-module-event';
import { AudioModule } from '../model/audio-module';

let errorId = 0;

const hasSignificantState = path(['modules', 'length']);

@Injectable()
export class AudioSignalChainEffects implements OnInitEffects {
  constructor(
    private graphService: AudioGraphService,
    private actions$: Actions,
    private store$: Store<AudioSignalChainState>,
    private locationService: Location
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
  loadSignalChainState$: Observable<
    AudioSignalChainAction
  > = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.LoadSignalChainState),
    mergeMap(({ signalChain }: LoadSignalChainState) =>
      from(this.graphService.resetGraph()).pipe(
        map(newState => new ResetSignalChainSuccess(newState)),
        mergeMap(resetSuccess => {
          const events = [
            resetSuccess,
            ...signalChain.modules.map(
              (audioModule: AudioModule) =>
                new CreateModule(
                  new CreateModuleEvent(audioModule.moduleType, audioModule.id)
                )
            ),
            ...flatten(
              signalChain.modules.map(audioModule =>
                audioModule.sourceIds.map(
                  sourceId =>
                    new ConnectModules({
                      sourceId,
                      destinationId: audioModule.id
                    })
                )
              )
            ),
            ...signalChain.parameters.map(
              parameter =>
                new ChangeParameter({
                  moduleId: parameter.moduleId,
                  parameterName: parameter.name,
                  value: parameter.value
                })
            ),
            ...signalChain.choiceParameters.map(
              parameter =>
                new ChangeChoiceParameter({
                  moduleId: parameter.moduleId,
                  parameterName: parameter.name,
                  value: parameter.selection
                })
            ),
            ...flatten(
              signalChain.parameters.map(parameter =>
                parameter.sourceIds.map(
                  sourceModuleId =>
                    new ConnectParameter({
                      sourceModuleId,
                      destinationModuleId: parameter.moduleId,
                      destinationParameterName: parameter.name
                    })
                )
              )
            )
          ];
          console.log('restoring state', events);
          return from(events);
        }),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  CreateModule$: Observable<AudioSignalChainAction> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.CreateModule),
    mergeMap(({ payload }: CreateModule) =>
      of(() =>
        this.graphService.createModule(payload.moduleType, payload.id)
      ).pipe(
        map(serviceMethod => serviceMethod()),
        filter(
          compose(
            not,
            isNil
          )
        ),
        mergeMap((result: CreateModuleResult) =>
          from([
            new CreateModuleSuccess(result.module),
            ...result.parameters.map(p => new CreateParameterSuccess(p)),
            ...result.choiceParameters.map(
              p => new CreateChoiceParameterSuccess(p)
            )
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
  changeChoiceParameter$: Observable<
    AudioSignalChainAction
  > = this.actions$.pipe(
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
  toggleSignalChainActive$: Observable<
    AudioSignalChainAction
  > = this.actions$.pipe(
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

  @Effect({ dispatch: false })
  stateToQueryString$: Observable<AudioSignalChainState> = this.store$.pipe(
    select(getSignalChainStateForSave),
    debounceTime(1000),
    filter(hasSignificantState),
    tap((state: AudioSignalChainState) =>
      this.locationService.replaceState(
        head(this.locationService.path(true).split('#')),
        `#${encodeURIComponent(JSON.stringify(state))}`
      )
    )
  );

  ngrxOnInitEffects(): AudioSignalChainAction {
    if (this.locationService.path(true).includes('#')) {
      const state = JSON.parse(
        decodeURIComponent(
          last(this.locationService.path(true).split('#'))
        )
      );
      return new LoadSignalChainState(state);
    }
    return new ResetSignalChain();
  }
}
