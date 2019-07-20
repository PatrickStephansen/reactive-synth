import { getParameterValue } from './getParameterValue';
import { getEnvelopeValue } from './getEnvelopeValue';

registerProcessor(
  'envelope-generator',
  class EnvelopeGenerator extends AudioWorkletProcessor {
    static get parameterDescriptors() {
      return [
        {
          name: 'attackValue',
          defaultValue: 1,
          minValue: 0,
          maxValue: 1,
          automationRate: 'a-rate'
        },
        {
          name: 'attackTime',
          defaultValue: 0,
          minValue: 0,
          maxValue: 10,
          automationRate: 'a-rate'
        },
        {
          name: 'holdTime',
          minValue: 0,
          defaultValue: 0.0625,
          maxValue: 10,
          automationRate: 'a-rate'
        },
        {
          name: 'decayTime',
          defaultValue: 0.125,
          minValue: 0,
          maxValue: 10,
          automationRate: 'a-rate'
        },
        {
          name: 'sustainValue',
          defaultValue: 0.25,
          minValue: 0,
          maxValue: 1,
          automationRate: 'a-rate'
        },
        {
          name: 'releaseTime',
          defaultValue: 0.25,
          minValue: 0,
          maxValue: 10
        }
      ];
    }

    constructor(options) {
      super(options);
      this.stages = ['rest', 'attack', 'hold', 'decay', 'sustain', 'release'];
      this.stage = stages[0];
      // stageProgress advances from 0 to 1 to show progress of stage
      this.stageProgress = 0;
      this.secondsSinceStateTransition = 0;
      this.port.onmessage = this.handleMessage.bind(this);
      this.state = {
        attackTime: 0,
        attackValue: 1,
        holdTime: 0.0625,
        decayTime: 0.125,
        sustainValue: 0.25,
        releaseTime: 0.25
      };
      this.sampleRate = options.sampleRate || 44100;
      this.outputValue;
    }

    handleMessage(event) {
      if (event.data && event.data.type === 'getState') {
        this.port.postMessage({
          type: 'state',
          state: {
            stage: this.stage,
            stageProgress: this.stageProgress,
            outputValue: this.outputValue
          }
        });
      }
    }

    process(inputs, outputs, parameters) {
      // Only one input and output.
      let input = inputs[0];
      let output = outputs[0];
      const getAttackTime = getParameterValue(parameters.attackTime, 0, 10);
      const getAttackValue = getParameterValue(parameters.attackValue, 0, 1);
      const getHoldTime = getParameterValue(parameters.holdTime, 0, 10);
      const getDecayTime = getParameterValue(parameters.decayTime, 0, 10);
      const getSustainValue = getParameterValue(parameters.sustainValue, 0, 1);
      const getReleaseTime = getParameterValue(parameters.releaseTime, 0, 10);

      for (let sampleIndex = 0; sampleIndex < input[0].length; sampleIndex++) {
        this.state = {
          attackTime: getAttackTime(sampleIndex),
          attackValue: getAttackValue(sampleIndex),
          holdTime: getHoldTime(sampleIndex),
          decayTime: getDecayTime(sampleIndex),
          sustainValue: getSustainValue(sampleIndex),
          releaseTime: getReleaseTime(sampleIndex)
        };
        // only expecting one channel, but tolerating more in case
        const inputSample = input[0][0];
        const envelopeValue = getEnvelopeValue(
          this.sampleRate,
          this.state,
          this.secondsSinceStateTransition,
          this.stage,
          inputSample
        );
        this.stage = envelopeValue.stage;
        this.stageProgress = envelopeValue.stageProgress;
        this.secondsSinceStateTransition = envelopeValue.secondsSinceStateTransition;
        this.outputValue = envelopeValue.outputValue;

        for (
          let channelIndex = 0;
          channelIndex < input.length;
          channelIndex++
        ) {
          const outputChannel = output[channelIndex];

          outputChannel[sampleIndex] = this.outputValue;
        }
      }
      return true;
    }
  }
);
