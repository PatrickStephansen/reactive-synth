import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Actions, Effect, ofType, OnInitEffects } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
import { from, Observable, of, OperatorFunction, defer } from 'rxjs';
import { mergeMap, map, catchError, tap, filter, debounceTime, concatMap } from 'rxjs/operators';
import { compose, flatten, head, isNil, last, not, path } from 'ramda';

import { AudioGraphService } from '../audio-graph.service';
import { audioSignalActions, AudioSignalChainActionTypes } from './audio-signal-chain.actions';
import { CreateModuleResult } from '../model/create-module-result';
import { AudioSignalChainState } from './audio-signal-chain.state';
import { getSignalChainStateForSave } from './audio-signal-chain.selectors';
import { CreateModuleEvent } from '../model/create-module-event';
import { AudioModule } from '../model/audio-module';
import { upgradeAudioChainStateVersion } from './upgrade-audio-signal-chain-version';
import { ConnectParameterEvent } from '../model/connect-parameter-event';
import { ChangeParameterEvent } from '../model/change-parameter-event';
import { ChangeChoiceEvent } from '../model/change-choice-event';
import { ConnectModulesEvent } from '../model/connect-modules-event';
import { ControlSurfaceValueChangeEvent } from '../model/control-surface-value-change-event';
import { ControlSurfaceRangeChangeEvent } from '../model/control-surface-range-change-event';

let errorId = 0;

const hasSignificantState = path(['signalChain', 'modules', 'length']);

@Injectable()
export class AudioSignalChainEffects implements OnInitEffects {
  constructor(
    private graphService: AudioGraphService,
    private actions$: Actions,
    private store$: Store<AudioSignalChainState>,
    private locationService: Location
  ) {}

  private handleSignalChainChangeError: OperatorFunction<any, Action> = catchError(error => {
    const errorMessage = error.message || error;
    console.error(error);
    return of(
      audioSignalActions.addError({
        error: {
          id: `signal-chain-error-${errorId++}`,
          errorMessage
        }
      })
    );
  });

  @Effect()
  resetSignalChain$: Observable<Action> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.ResetSignalChain),
    mergeMap(() => {
      this.locationService.go(this.locationService.path(false));
      return from(this.graphService.resetGraph()).pipe(
        map(signalChain => audioSignalActions.resetSignalChainSuccess({ signalChain })),
        this.handleSignalChainChangeError
      );
    })
  );

  @Effect()
  loadSignalChainStateFailure$: Observable<Action> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.LoadSignalChainStateFailure),
    mergeMap(({ reason }) =>
      from(this.graphService.resetGraph()).pipe(
        mergeMap(signalChain => [
          audioSignalActions.resetSignalChainSuccess({ signalChain }),
          audioSignalActions.addError({
            error: {
              id: `signal-chain-error-${errorId++}`,
              errorMessage: reason
            }
          })
        ]),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  loadSignalChainState$: Observable<Action> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.LoadSignalChainState),
    mergeMap(({ signalChain }) =>
      from(this.graphService.loadState(signalChain)).pipe(
        mergeMap(newState => {
          const actions = [
            audioSignalActions.resetSignalChainSuccess({ signalChain: newState })
          ] as Action[];
          if (newState.muted) {
            actions.push(audioSignalActions.toggleSignalChainActive({ isActive: true }));
          }
          return actions;
        }),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  CreateModule$: Observable<Action> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.CreateModule),
    mergeMap(({ module }: { module: CreateModuleEvent }) =>
      defer(() => this.graphService.createModule(module.moduleType, module.id, module.name)).pipe(
        filter(compose(not, isNil)),
        mergeMap((result: CreateModuleResult) =>
          from([
            audioSignalActions.createModuleSuccess({ module: result.module }),
            ...result.inputs.map(input => audioSignalActions.createInputSuccess({ input })),
            ...result.outputs.map(output => audioSignalActions.createOutputSuccess({ output })),
            ...result.parameters.map(parameter =>
              audioSignalActions.createParameterSuccess({ parameter })
            ),
            ...result.choiceParameters.map(choice =>
              audioSignalActions.createChoiceParameterSuccess({ choice })
            ),
            ...result.visualizations.map(visualization =>
              audioSignalActions.createVisualizationSuccess({ visualization })
            )
          ])
        ),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  connectModules$: Observable<Action> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.ConnectModules),
    mergeMap(({ connection }: { connection: ConnectModulesEvent }) =>
      of(() => this.graphService.connectModules(connection)).pipe(
        map(serviceMethod => serviceMethod()),
        map(() => audioSignalActions.connectModulesSuccess({ connection })),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  disconnectModules$: Observable<Action> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.DisconnectModules),
    mergeMap(({ connection }: { connection: ConnectModulesEvent }) =>
      of(() => this.graphService.disconnectModules(connection)).pipe(
        map(serviceMethod => serviceMethod()),
        map(() => audioSignalActions.disconnectModulesSuccess({ connection })),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  connectParameter$: Observable<Action> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.ConnectParameter),
    mergeMap(({ connection }: { connection: ConnectParameterEvent }) =>
      of(() => this.graphService.connectParameter(connection)).pipe(
        map(serviceMethod => serviceMethod()),
        map(() => audioSignalActions.connectParameterSuccess({ connection })),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  disconnectParameter$: Observable<Action> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.DisconnectParameter),
    mergeMap(({ connection }: { connection: ConnectParameterEvent }) =>
      of(() => this.graphService.disconnectParameter(connection)).pipe(
        map(serviceMethod => serviceMethod()),
        map(() => audioSignalActions.disconnectParameterSuccess({ connection })),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  changeParameter$: Observable<Action> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.ChangeParameter),
    mergeMap(({ parameter }: { parameter: ChangeParameterEvent }) =>
      of(() =>
        this.graphService.changeParameterValue(
          parameter.moduleId,
          parameter.parameterName,
          parameter.value,
          parameter.setImmediately
        )
      ).pipe(
        map(serviceMethod => serviceMethod()),
        map(() => audioSignalActions.changeParameterSuccess({ parameter })),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  changeControlSurfaceValue$: Observable<Action> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.UpdateControlSurfaceCoordinates),
    mergeMap(({ change }: { change: ControlSurfaceValueChangeEvent }) =>
      from([
        audioSignalActions.changeParameter({
          parameter: {
            moduleId: change.moduleId,
            parameterName: 'x',
            setImmediately: false,
            value: change.x
          }
        }),
        audioSignalActions.changeParameter({
          parameter: {
            moduleId: change.moduleId,
            parameterName: 'y',
            setImmediately: false,
            value: change.y
          }
        })
      ])
    )
  );

  @Effect()
  changeControlSurfaceRange$: Observable<Action> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.UpdateControlSurfaceRange),
    mergeMap(({ change }: { change: ControlSurfaceRangeChangeEvent }) =>
      from([
        audioSignalActions.changeParameterBounds({
          change: {
            moduleId: change.moduleId,
            parameterName: 'x',
            newMinValue: change.shownMinX,
            newMaxValue: change.shownMaxX
          }
        }),
        audioSignalActions.changeParameterBounds({
          change: {
            moduleId: change.moduleId,
            parameterName: 'y',
            newMinValue: change.shownMinY,
            newMaxValue: change.shownMaxY
          }
        })
      ])
    )
  );

  @Effect()
  changeChoiceParameter$: Observable<Action> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.ChangeChoiceParameter),
    mergeMap(({ choice }: { choice: ChangeChoiceEvent }) =>
      of(() =>
        this.graphService.makeChoice(choice.moduleId, choice.parameterName, choice.value)
      ).pipe(
        map(serviceMethod => serviceMethod()),
        map(() => audioSignalActions.changeChoiceParameterSuccess({ choice })),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect()
  toggleSignalChainActive$: Observable<Action> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.ToggleSignalChainActive),
    mergeMap(({ isActive }) => {
      const servicePromise = isActive ? this.graphService.unmute() : this.graphService.mute();

      return from(servicePromise).pipe(
        map(() => audioSignalActions.toggleSignalChainActiveSuccess({ isActive })),
        this.handleSignalChainChangeError
      );
    })
  );

  @Effect()
  destroyModule$: Observable<Action> = this.actions$.pipe(
    ofType(AudioSignalChainActionTypes.DestroyModule),
    mergeMap(({ moduleId }) =>
      of(() => this.graphService.destroyModule(moduleId)).pipe(
        map(serviceMethod => serviceMethod()),
        map(() => audioSignalActions.destroyModuleSuccess({ moduleId })),
        this.handleSignalChainChangeError
      )
    )
  );

  @Effect({ dispatch: false })
  stateToQueryString$: Observable<AudioSignalChainState> = this.store$.pipe(
    debounceTime(1000),
    filter(hasSignificantState),
    select(getSignalChainStateForSave),
    tap((state: AudioSignalChainState) =>
      this.locationService.replaceState(
        head(this.locationService.path(true).split('#')),
        `#${JSON.stringify(state)}`
      )
    )
  );

  private tryLoadState(unparsedState: string): Action {
    try {
      const state = JSON.parse(decodeURIComponent(unparsedState));
      return audioSignalActions.loadSignalChainState({
        signalChain: upgradeAudioChainStateVersion(state, state.stateVersion || 1)
      });
    } catch (error) {
      return audioSignalActions.loadSignalChainStateFailure({
        reason: `Error restoring state. Defaulting to new patch. ${error.message || error}`
      });
    }
  }

  ngrxOnInitEffects(): Action {
    this.locationService.subscribe((stateEvent: PopStateEvent) => {
      if (stateEvent.type === 'popstate' && this.locationService.path(true).includes('#')) {
        this.store$.dispatch(this.tryLoadState(last(this.locationService.path(true).split('#'))));
      }
    });
    if (this.locationService.path(true).includes('#')) {
      return this.tryLoadState(last(this.locationService.path(true).split('#')));
    }
    return audioSignalActions.resetSignalChain();
  }
}
