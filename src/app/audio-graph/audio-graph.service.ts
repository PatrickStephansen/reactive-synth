import { Injectable } from '@angular/core';
import { AudioNode as NodeModel } from './audio-node';
import { Parameter as ParameterModel } from './parameter';

let incrementingId = 0;

@Injectable({
  providedIn: 'root'
})
export class AudioGraphService {
  private graph: Map<string, AudioNode>;
  private context: AudioContext;

  constructor() {}

  private destroyContext() {
    if (this.context) {
      return this.context.close();
    }
    return Promise.resolve();
  }

  private createId(nodeType: string) {
    return `${nodeType}-${incrementingId++}`;
  }

  unmute(): Promise<void> {
    return this.context.resume();
  }

  mute(): Promise<void> {
    return this.context.suspend();
  }

  resetGraph(): Promise<void> {
    return this.destroyContext().then(() => {
      this.context = new AudioContext();
      this.graph = new Map([['speakers-output', this.context.destination]]);
    });
  }

  createOscillator(): [NodeModel, ParameterModel[]] {
    const nodeType = 'oscillator';
    const id = this.createId(nodeType);
    const oscillator = this.context.createOscillator();
    oscillator.start();
    this.graph.set(id, oscillator);
    return [
      { id, nodeType, numberInputs: 0, numberOutputs: 1, sourceIds: [] },
      [
        {
          name: 'frequency',
          nodeId: id,
          sourceIds: [],
          maxValue: oscillator.frequency.maxValue,
          minValue: oscillator.frequency.minValue,
          value: oscillator.frequency.defaultValue
        },
        {
          name: 'detune',
          nodeId: id,
          sourceIds: [],
          maxValue: oscillator.detune.maxValue,
          minValue: oscillator.detune.minValue,
          value: oscillator.detune.defaultValue
        }
      ]
    ];
  }

  createGainNode(): [NodeModel, ParameterModel[]] {
    const nodeType = 'volume';
    const id = this.createId(nodeType);
    const gain = this.context.createGain();
    this.graph.set(id, gain);
    return [
      { id, nodeType, numberInputs: 1, numberOutputs: 1, sourceIds: [] },
      [
        {
          name: 'gain',
          nodeId: id,
          sourceIds: [],
          maxValue: gain.gain.maxValue,
          minValue: gain.gain.minValue,
          value: gain.gain.defaultValue
        }
      ]
    ];
  }

  connectNodes(sourceId: string, destinationId: string): void {
    if (this.graph.has(sourceId) && this.graph.has(destinationId)) {
      this.graph.get(sourceId).connect(this.graph.get(destinationId));
    }
  }

  disconnectNodes(sourceId: string, destinationId: string): void {
    if (this.graph.has(sourceId) && this.graph.has(destinationId)) {
      this.graph.get(sourceId).disconnect(this.graph.get(destinationId));
    }
  }

  changeParameterValue(nodeId: string, parameterName: string, value): void {
    if (this.graph.has(nodeId)) {
      const param = this.graph.get(nodeId)[parameterName];
      if (param && param.setTargetAtTime) {
        // don't change immediately as an anti-pop precaution
        param.setTargetAtTime(value, this.context.currentTime, 0.0001);
      } else {
        // for cases like oscillator type, where the param is not numeric
        this.graph.get(nodeId)[parameterName] = value;
      }
    }
  }
}
