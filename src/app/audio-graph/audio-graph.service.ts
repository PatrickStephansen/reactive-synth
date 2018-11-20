import { Injectable } from '@angular/core';
import * as model from './audio-node';

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

  createOscillator(): model.AudioNode {
    const nodeType = 'oscillator';
    const id = this.createId(nodeType);
    this.graph.set(id, this.context.createOscillator());
    return { id, nodeType, numberInputs: 0, numberOutputs: 1, sourceIds: [] };
  }

  connectNodes(sourceId: string, destinationId: string): void {
    if (this.graph.has(sourceId) && this.graph.has(destinationId)) {
      this.graph[sourceId].connect(this.graph[destinationId]);
    }
  }

  disconnectNodes(sourceId: string, destinationId: string): void {
    if (this.graph.has(sourceId) && this.graph.has(destinationId)) {
      this.graph[sourceId].disconnect(this.graph[destinationId]);
    }
  }

  changeParameterValue(nodeId: string, parameterName: string, value): void {
    if (this.graph.has(nodeId)) {
      const param = this.graph[nodeId][parameterName];
      if (param && param.setTargetAtTime) {
        // don't change immediately as an anti-pop precaution
        param.setTargetAtTime(value, this.context.currentTime, 0.0001);
      } else {
        // for cases like oscillator type, where the param is not numeric
        this.graph[nodeId][parameterName] = value;
      }
    }
  }
}
