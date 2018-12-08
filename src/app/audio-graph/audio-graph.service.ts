import { Injectable } from '@angular/core';
import { head, last } from 'ramda';

import { AudioNode as NodeModel } from './model/audio-node';
import { Parameter as ParameterModel } from './model/parameter';
import { ChoiceParameter as ChoiceParameterModel } from './model/choice-parameter';
import { AudioGraphState } from './state/audio-graph.state';
import { makeDistortionCurve } from './distortion-curve';
import { ConnectParameterEvent } from './model/connect-parameter-event';

let incrementingId = 0;

interface CompoundNode {
  internalNodes: AudioNode[];
  parameterMap?: Map<string, AudioParam>;
  choiceMap?: Map<string, [AudioNode, string]>;
}

@Injectable({
  providedIn: 'root'
})
export class AudioGraphService {
  private graph: Map<string, CompoundNode>;
  private context: AudioContext;

  private defaultGain = 0.1;

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
      this.graph = new Map([
        ['speakers-output', { internalNodes: [this.context.destination] }]
      ]);
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
        choiceParameters: [],
        visualizations: [],
        muted: false
      }));
    });
  }

  createOscillator(): [NodeModel, ParameterModel[], ChoiceParameterModel[]] {
    const nodeType = 'oscillator';
    const id = this.createId(nodeType);
    const oscillator = this.context.createOscillator();
    const volumeControl = this.context.createGain();
    volumeControl.gain.value = this.defaultGain;
    oscillator.connect(volumeControl);
    oscillator.start();
    const compoundNode = {
      internalNodes: [oscillator, volumeControl],
      parameterMap: new Map([
        ['frequency', oscillator.frequency],
        ['detune', oscillator.detune],
        ['output gain', volumeControl.gain]
      ]),
      choiceMap: new Map([
        ['waveform', [oscillator, 'type'] as [AudioNode, string]]
      ])
    };
    this.graph.set(id, compoundNode);
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
          units: 'hertz',
          nodeId: id,
          sourceIds: [],
          maxValue: oscillator.frequency.maxValue,
          minValue: oscillator.frequency.minValue,
          value: oscillator.frequency.defaultValue,
          stepSize: 1
        },
        {
          name: 'detune',
          units: 'cents',
          nodeId: id,
          sourceIds: [],
          maxValue: oscillator.detune.maxValue,
          minValue: oscillator.detune.minValue,
          value: oscillator.detune.defaultValue,
          stepSize: 1
        },
        {
          name: 'output gain',
          nodeId: id,
          sourceIds: [],
          maxValue: volumeControl.gain.maxValue,
          minValue: volumeControl.gain.minValue,
          stepSize: 0.01,
          value: this.defaultGain
        }
      ],
      [
        {
          name: 'waveform',
          nodeId: id,
          choices: ['sine', 'triangle', 'sawtooth', 'square'],
          selection: 'sine'
        }
      ]
    ];
  }

  createGainNode(): [NodeModel, ParameterModel[]] {
    const nodeType = 'gain';
    const id = this.createId(nodeType);
    const gain = this.context.createGain();
    gain.gain.value = this.defaultGain;
    const gainParameterKey = 'signal multiplier';
    const compoundNode = {
      internalNodes: [gain],
      parameterMap: new Map([[gainParameterKey, gain.gain]])
    };

    this.graph.set(id, compoundNode);
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
          name: gainParameterKey,
          nodeId: id,
          sourceIds: [],
          maxValue: gain.gain.maxValue,
          minValue: gain.gain.minValue,
          stepSize: 0.01,
          value: this.defaultGain
        }
      ]
    ];
  }

  createDelayNode(): [NodeModel, ParameterModel[]] {
    const nodeType = 'delay';
    const id = this.createId(nodeType);
    const delay = this.context.createDelay();
    const delayParameterKey = 'delay time';
    const compoundNode = {
      internalNodes: [delay],
      parameterMap: new Map([[delayParameterKey, delay.delayTime]])
    };

    this.graph.set(id, compoundNode);
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
          name: delayParameterKey,
          units: 'seconds',
          nodeId: id,
          sourceIds: [],
          maxValue: delay.delayTime.maxValue,
          minValue: delay.delayTime.minValue,
          stepSize: 0.01,
          value: delay.delayTime.value
        }
      ]
    ];
  }

  createFilterNode(): [NodeModel, ParameterModel[], ChoiceParameterModel[]] {
    const nodeType = 'filter';
    const id = this.createId(nodeType);
    const filter = this.context.createBiquadFilter();
    this.graph.set(id, {
      internalNodes: [filter],
      parameterMap: new Map([
        ['frequency', filter.frequency],
        ['quality factor', filter.Q],
        ['detune', filter.detune]
      ]),
      choiceMap: new Map([
        ['filter type', [filter, 'type'] as [AudioNode, string]]
      ])
    });
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
          name: 'frequency',
          units: 'hertz',
          nodeId: id,
          maxValue: filter.frequency.maxValue,
          minValue: filter.frequency.minValue,
          stepSize: 1,
          sourceIds: [],
          value: filter.frequency.value
        },
        {
          name: 'detune',
          units: 'cents',
          nodeId: id,
          sourceIds: [],
          maxValue: filter.detune.maxValue,
          minValue: filter.detune.minValue,
          value: filter.detune.defaultValue,
          stepSize: 1
        },
        {
          name: 'quality factor',
          nodeId: id,
          maxValue: filter.Q.maxValue,
          minValue: filter.Q.minValue,
          stepSize: 1,
          sourceIds: [],
          value: filter.Q.value
        }
      ],
      [
        {
          name: 'filter type',
          nodeId: id,
          choices: ['lowpass', 'highpass', 'bandpass', 'notch', 'allpass'],
          selection: filter.type
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
    this.graph.set(id, {
      internalNodes: [distortion]
    });
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

  createConstantSource(): [NodeModel, ParameterModel[]] {
    const nodeType = 'constant';
    const id = this.createId(nodeType);
    const constant = this.context.createConstantSource();
    constant.start();
    this.graph.set(id, {
      internalNodes: [constant],
      parameterMap: new Map([['output value', constant.offset]])
    });
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
          nodeId: id,
          sourceIds: [],
          name: 'output value',
          maxValue: constant.offset.maxValue,
          minValue: constant.offset.minValue,
          value: constant.offset.value,
          stepSize: 0.01
        }
      ]
    ];
  }

  connectNodes(sourceId: string, destinationId: string): void {
    if (this.graph.has(sourceId) && this.graph.has(destinationId)) {
      last(this.graph.get(sourceId).internalNodes).connect(
        head(this.graph.get(destinationId).internalNodes)
      );
    }
  }

  disconnectNodes(sourceId: string, destinationId: string): void {
    if (this.graph.has(sourceId) && this.graph.has(destinationId)) {
      last(this.graph.get(sourceId).internalNodes).disconnect(
        head(this.graph.get(destinationId).internalNodes)
      );
    }
  }

  connectParameter(event: ConnectParameterEvent): void {
    if (
      this.graph.has(event.sourceNodeId) &&
      this.graph.has(event.destinationNodeId) &&
      this.graph.get(event.destinationNodeId).parameterMap
    ) {
      const destinationParameter = this.graph
        .get(event.destinationNodeId)
        .parameterMap.get(event.destinationParameterName);
      if (
        destinationParameter &&
        destinationParameter.automationRate === 'a-rate'
      ) {
        last(this.graph.get(event.sourceNodeId).internalNodes).connect(
          destinationParameter
        );
      }
    }
  }

  disconnectParameter(event: ConnectParameterEvent): void {
    if (
      this.graph.has(event.sourceNodeId) &&
      this.graph.has(event.destinationNodeId) &&
      this.graph.get(event.destinationNodeId).parameterMap
    ) {
      const destinationParameter = this.graph
        .get(event.destinationNodeId)
        .parameterMap.get(event.destinationParameterName);
      if (
        destinationParameter &&
        destinationParameter.automationRate === 'a-rate'
      ) {
        last(this.graph.get(event.sourceNodeId).internalNodes).disconnect(
          destinationParameter
        );
      }
    }
  }

  changeParameterValue(
    nodeId: string,
    parameterName: string,
    value: number
  ): void {
    if (this.graph.has(nodeId) && this.graph.get(nodeId).parameterMap) {
      const param = this.graph.get(nodeId).parameterMap.get(parameterName);
      if (param && param.setTargetAtTime) {
        // don't change immediately as an anti-pop precaution
        param.setTargetAtTime(value, this.context.currentTime, 0.005);
      }
    }
  }

  makeChoice(nodeId: string, choiceName: string, value: string): void {
    if (this.graph.has(nodeId) && this.graph.get(nodeId).choiceMap) {
      const choice = this.graph.get(nodeId).choiceMap.get(choiceName);
      if (choice) {
        const [node, property] = choice;
        node[property] = value;
      }
    }
  }

  destroyNode(nodeId: string): void {
    if (this.graph.has(nodeId)) {
      this.graph.get(nodeId).internalNodes.forEach(node => {
        node.disconnect();
        if (node['stop']) {
          node['stop']();
        }
      });
      this.graph.delete(nodeId);
    }
  }
}
