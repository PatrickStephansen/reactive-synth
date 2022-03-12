import { Injectable, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { identity, isNil, last } from 'ramda';

import { AudioSignalChainState } from './state/audio-signal-chain.state';
import { ConnectParameterEvent } from './model/connect-parameter-event';
import { ModuleSignalStage } from './model/module-signal-stage';
import {
  linearScalingStrategy,
  logarithmicScalingStrategy
} from './model/visualization/scaling-strategy';
import { AudioModuleType } from './model/audio-module-type';
import { CreateModuleResult } from './model/create-module-result';
import { ConnectModulesEvent } from './model/connect-modules-event';
import { Subscription } from 'rxjs';
import {
  workletUrl,
  bitcrusherWasmUrl,
  inverseGainWasmUrl,
  noiseGeneratorWasmUrl,
  clockDividerWasmUrl,
  envelopeGeneratorWasmUrl
} from '../cache-hack/cache';
import { ModuleImplementation } from './audio-modules/module-implementation';
import { AUDIO_MODULE_FACTORY, AudioModuleFactory } from './audio-modules/audio-module-factory';
import { ViewMode } from './model/view-mode';

let incrementingId = 0;

@Injectable({
  providedIn: 'root'
})
export class AudioGraphService {
  private graph: Map<string, ModuleImplementation>;
  private context: AudioContext;

  private defaultGain = 0.1;

  private moduleFactoryMap: Map<AudioModuleType, AudioModuleFactory>;
  private subscriptions: Subscription[] = [];
  private moduleBinaryMap: Map<AudioModuleType, ArrayBuffer>;

  private parameterMax(parameter: AudioParam) {
    return Math.min(parameter.maxValue, 1000000000);
  }

  private parameterMin(parameter: AudioParam) {
    return Math.max(parameter.minValue, -1000000000);
  }

  constructor(
    private locationService: Location,
    @Inject(AUDIO_MODULE_FACTORY) moduleFactories: AudioModuleFactory[]
  ) {
    this.moduleFactoryMap = new Map(moduleFactories.map(factory => [factory.ModuleType, factory]));
  }

  private destroyContext() {
    if (this.context) {
      return this.context.close();
    }
    return Promise.resolve();
  }

  private createModuleId(moduleType: string, id?: string) {
    if (isNil(id)) {
      return `${moduleType}-${incrementingId++}`;
    }
    incrementingId = Number.parseInt(last(id.split('-')), 10) + 1;
    return id;
  }

  unmute(): Promise<void> {
    return this.context ? this.context.resume() : Promise.reject('No audio context to resume');
  }

  mute(): Promise<void> {
    return this.context ? this.context.suspend() : Promise.reject('No audio context to suspend');
  }

  endSubscriptions(): void {
    while (this.subscriptions.length) {
      const sub = this.subscriptions.pop();
      sub.unsubscribe();
    }
  }

  resetGraph(outputModuleName?: string): Promise<AudioSignalChainState> {
    const subscriptionsPromise = new Promise(resolve => resolve(this.endSubscriptions()));
    return subscriptionsPromise
      .then(() => this.destroyContext())
      .then(() => {
        if (typeof AudioContext !== 'function') {
          throw new Error(
            `Your browser is not supported because it does not implement the Web Audio API.
              Try reloading the page in a newer browser.
              If you're using iOS, none of them will work due to Apple store policy restrictions.`
          );
        }
        this.context = new AudioContext();
        incrementingId = 0;

        const visualizer = this.context.createAnalyser();
        visualizer.connect(this.context.destination);
        this.graph = new Map([
          [
            'Output to Speakers',
            {
              internalNodes: [visualizer, this.context.destination],
              inputMap: new Map([['audio to play', visualizer]])
            }
          ]
        ]);
        return this.context.audioWorklet
          .addModule(this.locationService.prepareExternalUrl(workletUrl))
          .then(() =>
            Promise.all([
              fetch(this.locationService.prepareExternalUrl(bitcrusherWasmUrl)),
              fetch(this.locationService.prepareExternalUrl(inverseGainWasmUrl)),
              fetch(this.locationService.prepareExternalUrl(noiseGeneratorWasmUrl)),
              fetch(this.locationService.prepareExternalUrl(clockDividerWasmUrl)),
              fetch(this.locationService.prepareExternalUrl(envelopeGeneratorWasmUrl)),
            ])
          )
          .then(wasmResponses =>
            Promise.all(wasmResponses.map(wasm => wasm.arrayBuffer()))
          )
          .then(
            ([
              bitcrusherWasmBinary,
              inverseGainBinary,
              noiseGeneratorBinary,
              clockDividerBinary,
              envelopeGeneratorBinary
            ]) => {
              this.moduleBinaryMap = new Map([
                [AudioModuleType.InverseGain, inverseGainBinary],
                [AudioModuleType.BitCrusher, bitcrusherWasmBinary],
                [AudioModuleType.NoiseGenerator, noiseGeneratorBinary],
                [AudioModuleType.ClockDivider, clockDividerBinary],
                [AudioModuleType.EnvelopeGenerator, envelopeGeneratorBinary]
              ]);
            }
          )
          .then(() => ({
            modules: [
              {
                id: 'Output to Speakers',
                name: outputModuleName,
                moduleType: AudioModuleType.Output,
                canDelete: false,
                helpText: `Signals must be connected to this module to be audible.
              Incoming signals are summed and clamped to the range [-1, 1].
              Click the visualizations to pause them. Click their headings to hide them to save space.`
              }
            ],
            controlSurfaces: [],
            viewMode: ViewMode.Modules,
            inputs: [
              {
                moduleId: 'Output to Speakers',
                name: 'audio to play',
                sources: []
              }
            ],
            outputs: [],
            parameters: [],
            choiceParameters: [],
            visualizations: [
              {
                moduleId: 'Output to Speakers',
                name: 'waveform',
                dataLength: visualizer.fftSize,
                visualizationType: 'line-graph',
                visualizationStage: ModuleSignalStage.input,
                renderingStrategyPerAxis: [linearScalingStrategy, linearScalingStrategy],
                isActive: true,
                getVisualizationData: data => visualizer.getByteTimeDomainData(data),
                createVisualizationPipeline: identity
              },
              {
                moduleId: 'Output to Speakers',
                name: 'spectrum - log',
                dataLength: visualizer.frequencyBinCount,
                visualizationType: 'line-graph',
                visualizationStage: ModuleSignalStage.input,
                renderingStrategyPerAxis: [logarithmicScalingStrategy, linearScalingStrategy],
                isActive: false,
                getVisualizationData: data => visualizer.getByteFrequencyData(data),
                createVisualizationPipeline: identity
              },
              {
                moduleId: 'Output to Speakers',
                name: 'spectrum - linear',
                dataLength: visualizer.frequencyBinCount,
                visualizationType: 'line-graph',
                visualizationStage: ModuleSignalStage.input,
                renderingStrategyPerAxis: [linearScalingStrategy, linearScalingStrategy],
                isActive: false,
                getVisualizationData: data => visualizer.getByteFrequencyData(data),
                createVisualizationPipeline: identity
              }
            ],
            muted: this.context.state && this.context.state === 'suspended',
            errors: []
          }));
      });
  }

  createModule(
    moduleType: AudioModuleType,
    id?: string,
    name?: string
  ): Promise<CreateModuleResult> {
    const matchingFactory = this.moduleFactoryMap.get(moduleType);
    if (matchingFactory) {
      return Promise.resolve(
        matchingFactory.CreateAudioModule(
          this.context,
          this.graph,
          this.defaultGain,
          this.parameterMax,
          this.parameterMin,
          this.createModuleId,
          this.subscriptions,
          id,
          name,
          this.moduleBinaryMap.get(moduleType)
        )
      );
    }
    return Promise.resolve(null);
  }

  connectModules({
    sourceId,
    sourceOutputName,
    destinationId,
    destinationInputName
  }: ConnectModulesEvent): void {
    if (
      this.graph.has(sourceId) &&
      this.graph.has(destinationId) &&
      this.graph.get(sourceId).outputMap &&
      this.graph.get(sourceId).outputMap.has(sourceOutputName) &&
      this.graph.get(destinationId).inputMap &&
      this.graph.get(destinationId).inputMap.has(destinationInputName)
    ) {
      const sourceNode = this.graph.get(sourceId).outputMap.get(sourceOutputName);
      const destinationNode = this.graph.get(destinationId).inputMap.get(destinationInputName);
      sourceNode.connect(destinationNode);
    } else {
      console.warn('attempted to connect modules that do not exist', sourceId, destinationId);
    }
  }

  disconnectModules({
    sourceId,
    sourceOutputName,
    destinationId,
    destinationInputName
  }: ConnectModulesEvent): void {
    if (
      this.graph.has(sourceId) &&
      this.graph.has(destinationId) &&
      this.graph.get(sourceId).outputMap &&
      this.graph.get(sourceId).outputMap.has(sourceOutputName) &&
      this.graph.get(destinationId).inputMap &&
      this.graph.get(destinationId).inputMap.has(destinationInputName)
    ) {
      const sourceNode = this.graph.get(sourceId).outputMap.get(sourceOutputName);
      const destinationNode = this.graph.get(destinationId).inputMap.get(destinationInputName);
      sourceNode.disconnect(destinationNode);
    }
  }

  connectParameter(event: ConnectParameterEvent): void {
    if (
      this.graph.has(event.sourceModuleId) &&
      this.graph.get(event.sourceModuleId).outputMap &&
      this.graph.get(event.sourceModuleId).outputMap.has(event.sourceOutputName) &&
      this.graph.has(event.destinationModuleId) &&
      this.graph.get(event.destinationModuleId).parameterMap &&
      this.graph.get(event.destinationModuleId).parameterMap.has(event.destinationParameterName)
    ) {
      this.graph
        .get(event.sourceModuleId)
        .outputMap.get(event.sourceOutputName)
        .connect(
          this.graph.get(event.destinationModuleId).parameterMap.get(event.destinationParameterName)
        );
    } else {
      console.warn(
        'attempted to connect parameters that do not exist',
        event.sourceModuleId,
        event.sourceOutputName,
        event.destinationModuleId,
        event.destinationParameterName
      );
    }
  }

  disconnectParameter(event: ConnectParameterEvent): void {
    if (
      this.graph.has(event.sourceModuleId) &&
      this.graph.get(event.sourceModuleId).outputMap &&
      this.graph.get(event.sourceModuleId).outputMap.has(event.sourceOutputName) &&
      this.graph.has(event.destinationModuleId) &&
      this.graph.get(event.destinationModuleId).parameterMap &&
      this.graph.get(event.destinationModuleId).parameterMap.has(event.destinationParameterName)
    ) {
      this.graph
        .get(event.sourceModuleId)
        .outputMap.get(event.sourceOutputName)
        .disconnect(
          this.graph.get(event.destinationModuleId).parameterMap.get(event.destinationParameterName)
        );
    }
  }

  changeParameterValue(
    moduleId: string,
    parameterName: string,
    value: number,
    setImmediately?: boolean
  ): void {
    if (this.graph.has(moduleId) && this.graph.get(moduleId).parameterMap) {
      const param = this.graph.get(moduleId).parameterMap.get(parameterName);
      if (param && param.setTargetAtTime && !setImmediately) {
        // don't change immediately as an anti-pop precaution
        param.setTargetAtTime(value, this.context.currentTime, 0.005);
      } else {
        param.value = value;
      }
    }
  }

  makeChoice(moduleId: string, choiceName: string, value: string): void {
    if (this.graph.has(moduleId) && this.graph.get(moduleId).choiceMap) {
      const choice = this.graph.get(moduleId).choiceMap.get(choiceName);
      if (choice) {
        choice(value);
      }
    }
  }

  destroyModule(moduleId: string): void {
    if (this.graph.has(moduleId)) {
      this.graph.get(moduleId).internalNodes.forEach(module => {
        module.disconnect();
        if (module['stop']) {
          module['stop']();
        }
      });
      this.graph.delete(moduleId);
    }
  }

  async loadState(graphState: AudioSignalChainState): Promise<AudioSignalChainState> {
    const errors = [];
    let errorMessageId = 1;
    const createError = e => ({
      id: `signal-chain-error-${errorMessageId++}`,
      errorMessage: e.toString()
    });
    const resetState = await this.resetGraph(
      graphState.modules.find(module => module.id === 'Output to Speakers')?.name
    );
    await this.mute();
    const newModules: CreateModuleResult[] = await Promise.all(
      graphState.modules.map(m =>
        this.createModule(m.moduleType, m.id, m.name).catch(e => {
          errors.push(createError(e));
          return null;
        })
      )
    );
    graphState.inputs.forEach(input =>
      input.sources.forEach(source => {
        this.connectModules({
          sourceId: source.moduleId,
          sourceOutputName: source.name,
          destinationId: input.moduleId,
          destinationInputName: input.name
        });
      })
    );
    graphState.parameters.forEach(param =>
      param.sources.forEach(source => {
        this.connectParameter({
          sourceModuleId: source.moduleId,
          sourceOutputName: source.name,
          destinationModuleId: param.moduleId,
          destinationParameterName: param.name
        });
      })
    );
    graphState.parameters.forEach(param =>
      this.changeParameterValue(param.moduleId, param.name, param.value, true)
    );
    graphState.choiceParameters.forEach(param =>
      this.makeChoice(param.moduleId, param.name, param.selection)
    );

    return {
      modules: resetState.modules.concat(newModules.flatMap(m => m?.module).filter(identity)),
      errors,
      inputs: resetState.inputs
        .concat(newModules.flatMap(m => m?.inputs).filter(identity))
        .map(input => ({
          ...input,
          sources: [
            ...input.sources,
            ...(graphState.inputs?.find(i => i.moduleId === input.moduleId && i.name === input.name)
              ?.sources ?? [])
          ]
        })),
      viewMode: resetState.viewMode,
      muted: this.context.state === 'suspended',
      outputs: newModules.flatMap(m => m?.outputs).filter(identity),
      parameters: newModules
        .flatMap(m => m?.parameters)
        .filter(identity)
        .map(param => ({
          ...param,
          sources: [
            ...param.sources,
            ...(graphState.parameters.find(
              p => p.moduleId === param.moduleId && p.name === param.name
            )?.sources ?? [])
          ],
          minShownValue: graphState.parameters.find(
            p => p.moduleId === param.moduleId && p.name === param.name
          )?.minShownValue,
          maxShownValue: graphState.parameters.find(
            p => p.moduleId === param.moduleId && p.name === param.name
          )?.maxShownValue,
          value: graphState.parameters.find(
            p => p.moduleId === param.moduleId && p.name === param.name
          )?.value
        })),
      choiceParameters: newModules
        .flatMap(m => m?.choiceParameters)
        .filter(identity)
        .map(choice => ({
          ...choice,
          selection: graphState.choiceParameters.find(
            c => c.moduleId === choice.moduleId && c.name === choice.name
          )?.selection
        })),
      // this will need revision when more visuals are added
      visualizations: [...resetState.visualizations, ...newModules.flatMap(m => m?.visualizations).filter(identity)],
      activeControlSurfaceId: resetState.activeControlSurfaceId
    };
  }
}
