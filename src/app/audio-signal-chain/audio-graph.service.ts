import { Injectable, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { isNil, last } from 'ramda';
import { AudioContext, IAudioParam } from 'standardized-audio-context';

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
import { workletUrl } from '../cache-hack/cache';
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
  private pocWasmBinary: ArrayBuffer;

  private parameterMax(parameter: IAudioParam) {
    return Math.min(parameter.maxValue, 1000000000);
  }

  private parameterMin(parameter: IAudioParam) {
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
          .then(() => fetch(this.locationService.prepareExternalUrl('/assets/audio-worklet-processors/wasm_audio_nodes_bg.wasm')))
          .then(wasmData => wasmData.arrayBuffer())
          .then(wasmBinary => {
            this.pocWasmBinary = wasmBinary;
          })
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
                getVisualizationData: data => visualizer.getByteTimeDomainData(data)
              },
              {
                moduleId: 'Output to Speakers',
                name: 'spectrum - log',
                dataLength: visualizer.frequencyBinCount,
                visualizationType: 'line-graph',
                visualizationStage: ModuleSignalStage.input,
                renderingStrategyPerAxis: [logarithmicScalingStrategy, linearScalingStrategy],
                isActive: false,
                getVisualizationData: data => visualizer.getByteFrequencyData(data)
              },
              {
                moduleId: 'Output to Speakers',
                name: 'spectrum - linear',
                dataLength: visualizer.frequencyBinCount,
                visualizationType: 'line-graph',
                visualizationStage: ModuleSignalStage.input,
                renderingStrategyPerAxis: [linearScalingStrategy, linearScalingStrategy],
                isActive: false,
                getVisualizationData: data => visualizer.getByteFrequencyData(data)
              }
            ],
            muted: this.context.state && this.context.state === 'suspended',
            errors: []
          }));
      });
  }

  createModule(moduleType: AudioModuleType, id?: string, name?: string): CreateModuleResult {
    const matchingFactory = this.moduleFactoryMap.get(moduleType);
    if (matchingFactory) {
      return matchingFactory.CreateAudioModule(
        this.context,
        this.graph,
        this.defaultGain,
        this.parameterMax,
        this.parameterMin,
        this.createModuleId,
        this.subscriptions,
        id,
        name,
        this.pocWasmBinary
      );
    }
    return null;
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
}
