import { getParameterValue } from './getParameterValue';
import { getEnvelopeValue, restStage } from './getEnvelopeValue';
import { getValueAtTime } from './linear-change';

const getParamValue = getParameterValue;

registerProcessor(
  'envelope-generator',
  class EnvelopeGenerator extends AudioWorkletProcessor {
    static get parameterDescriptors() {
      return [
        {
          name: 'trigger',
          defaultValue: 0,
          automationRate: 'a-rate'
        },
        {
          name: 'attackValue',
          defaultValue: 1,
          minValue: 0,
          maxValue: 1,
          automationRate: 'a-rate'
        },
        {
          name: 'attackTime',
          defaultValue: 0.001,
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
      this.stage = restStage;
      // stageProgress advances from 0 to 1 to show progress of stage
      this.stageProgress = 0;
      this.secondsSinceStateTransition = 0;
      this.port.onmessage = this.handleMessage.bind(this);
      this.state = {
        attackTime: 0.001,
        attackValue: 1,
        holdTime: 0.0625,
        decayTime: 0.125,
        sustainValue: 0.25,
        releaseTime: 0.25
      };
      this.sampleRate = options.sampleRate || 44100;
      this.outputValue = 0;
      this.valueOnTriggerChange = undefined;
      this.manualTriggerOn = false;
      this.previousTriggerValue = 0;
      this.stateMessage = {
        type: 'state',
        state: {
          stage: this.stage,
          stageProgress: this.stageProgress,
          outputValue: this.outputValue
        }
      };
      this.triggerChangeMessage = { type: 'trigger-change', value: false };
      this.outputCache = {
        stage: undefined,
        secondsSinceStateTransition: undefined,
        stageProgress: 0,
        valueOnTriggerChange: undefined,
        outputValue: undefined
      };
    }

    handleMessage(event) {
      if (event.data && event.data.type === 'getState') {
        this.stateMessage.state.stage = this.stage;
        this.stateMessage.state.stageProgress = this.stageProgress;
        this.stateMessage.state.outputValue = this.outputValue;
        this.port.postMessage(this.stateMessage);
      }
      if (event.data && event.data.type === 'manual-trigger') {
        this.manualTriggerOn = event.data.value;
      }
    }

    process(inputs, outputs, parameters) {
      // Only one output.
      let output = outputs[0];
      this.getTriggerValue = this.manualTriggerOn
        ? () => 1e9
        : getParamValue(parameters.trigger, -1e9, 1e9);
      this.getAttackTime = getParamValue(parameters.attackTime, 0, 10);
      this.getAttackValue = getParamValue(parameters.attackValue, 0, 1);
      this.getHoldTime = getParamValue(parameters.holdTime, 0, 10);
      this.getDecayTime = getParamValue(parameters.decayTime, 0, 10);
      this.getSustainValue = getParamValue(parameters.sustainValue, 0, 1);
      this.getReleaseTime = getParamValue(parameters.releaseTime, 0, 10);

      for (let sampleIndex = 0; sampleIndex < output[0].length; sampleIndex++) {
        this.state.attackTime = this.getAttackTime(sampleIndex);
        this.state.attackValue = this.getAttackValue(sampleIndex);
        this.state.holdTime = this.getHoldTime(sampleIndex);
        this.state.decayTime = this.getDecayTime(sampleIndex);
        this.state.sustainValue = this.getSustainValue(sampleIndex);
        this.state.releaseTime = this.getReleaseTime(sampleIndex);
        const triggerValue = this.getTriggerValue(sampleIndex);

        if (triggerValue > 0 != this.previousTriggerValue > 0) {
          this.triggerChangeMessage.value = triggerValue > 0;
          this.port.postMessage(this.triggerChangeMessage);
        }

        // mutates this.outputCache
        getEnvelopeValue(
          getValueAtTime,
          this.sampleRate,
          this.state,
          this.secondsSinceStateTransition,
          this.stage,
          triggerValue,
          this.valueOnTriggerChange,
          this.outputCache
        );
        this.stage = this.outputCache.stage;
        this.stageProgress = this.outputCache.stageProgress;
        this.secondsSinceStateTransition = this.outputCache.secondsSinceStateTransition;
        this.outputValue = this.outputCache.outputValue;
        this.valueOnTriggerChange = this.outputCache.valueOnTriggerChange;
        this.previousTriggerValue = triggerValue;

        // only expecting one channel, but tolerating more in case
        for (let channelIndex = 0; channelIndex < output.length; channelIndex++) {
          output[channelIndex][sampleIndex] = this.outputValue;
        }
      }
      return true;
    }
  }
);
