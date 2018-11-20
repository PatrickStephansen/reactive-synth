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

  resetGraph(): Promise<void> {
    return this.destroyContext().then(() => {
      this.context = new AudioContext();
      this.graph = new Map([['spreakers-output', this.context.destination]]);
    });
  }

  createOscillator(): [NodeModel, ParameterModel[]] {
    const nodeType = 'oscillator';
    const id = this.createId(nodeType);
    const oscillator = this.context.createOscillator();
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
        },
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
