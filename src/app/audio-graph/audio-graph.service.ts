import { Injectable } from '@angular/core';
import { AudioNode as NodeModel } from './model/audio-node';
import { Parameter as ParameterModel } from './model/parameter';
import { Visualization as VisualizationModel } from './model/visualization';
import { AudioGraphState } from './state/audio-graph.state';

let incrementingId = 0;

// based on https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode
function makeDistortionCurve(amount = 50) {
  const n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180;
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

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

  resetGraph(): Promise<AudioGraphState> {
    return this.destroyContext().then(() => {
      this.context = new AudioContext();
      this.graph = new Map([['speakers-output', this.context.destination]]);
      return this.context.resume().then(() => ({
        nodes: [
          {
            id: 'speakers-output',
            nodeType: 'graph output',
            numberInputs: 1,
            numberOutputs: 0,
            sourceIds: [],
            canDelete: false
          }
        ],
        parameters: [],
        visualizations: [],
        muted: false
      }));
    });
  }

  createOscillator(): [NodeModel, ParameterModel[]] {
    const nodeType = 'oscillator';
    const id = this.createId(nodeType);
    const oscillator = this.context.createOscillator();
    oscillator.start();
    this.graph.set(id, oscillator);
    return [
      {
        id,
        nodeType,
        numberInputs: 0,
        numberOutputs: 1,
        sourceIds: [],
        canDelete: true
      },
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
      {
        id,
        nodeType,
        numberInputs: 1,
        numberOutputs: 1,
        sourceIds: [],
        canDelete: true
      },
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

  createDistortionNode(): [NodeModel, ParameterModel[]] {
    const nodeType = 'distortion';
    const id = this.createId(nodeType);
    const distortion = this.context.createWaveShaper();
    distortion.curve = makeDistortionCurve();
    distortion.oversample = '4x';
    this.graph.set(id, distortion);
    return [
      {
        id,
        nodeType,
        numberInputs: 1,
        numberOutputs: 1,
        sourceIds: [],
        canDelete: true
      },
      []
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
        param.setTargetAtTime(value, this.context.currentTime, 0.005);
      } else {
        // for cases like oscillator type, where the param is not numeric
        this.graph.get(nodeId)[parameterName] = value;
      }
    }
  }

  destroyNode(nodeId: string): void {
    if (this.graph.has(nodeId)) {
      this.graph.get(nodeId).disconnect();
      this.graph.delete(nodeId);
    }
  }
}
