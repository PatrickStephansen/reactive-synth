import { getParameterValue } from './getParameterValue';

const getNextValue = (previousValue, stepMin, stepMax) => {
  const stepSize = Math.random() * (stepMax - stepMin) + stepMin;
  const preferUp = Math.random() > 0.5;
  if (preferUp) {
    return previousValue + stepSize > 1 ? previousValue - stepSize : previousValue + stepSize;
  } else {
    return previousValue - stepSize < -1 ? previousValue + stepSize : previousValue - stepSize;
  }
};

registerProcessor(
  'noise',
  class Noise extends AudioWorkletProcessor {
    static get parameterDescriptors() {
      return [
        {
          name: 'stepMax',
          defaultValue: 1,
          minValue: 0,
          maxValue: 1,
          automationRate: 'a-rate'
        },
        {
          name: 'stepMin',
          defaultValue: 0,
          minValue: 0,
          maxValue: 1,
          automationRate: 'a-rate'
        },
        {
          name: 'sampleHold',
          defaultValue: 1,
          minValue: 0,
          maxValue: 1000000,
          automationRate: 'a-rate'
        },
        {
          name: 'nextValueTrigger',
          defaultValue: 0,
          automationRate: 'a-rate'
        }
      ];
    }

    constructor() {
      super();
      // initializing to zero means max and min of 1 behaves differently on initial load
      // start unbalanced so there is only one option for next sample in that case
      this.previousValue = 0.1;
      this.samplesHeld = 0;
      this.isTriggerValueHigh = false;
      this.port.onmessage = this.handleMessage.bind(this);
      this.manualTriggerOn = false;
      this.triggerChangeMessage = { type: 'trigger-change', value: false };
    }

    handleMessage(event) {
      if (event.data && event.data.type === 'manual-trigger') {
        this.manualTriggerOn = event.data.value;
      }
    }

    process(inputs, outputs, parameters) {
      // Get the first output.
      let output = outputs[0];
      this.getStepMin = getParameterValue(parameters.stepMin, 0, 1);
      this.getStepMax = getParameterValue(parameters.stepMax, 0, 1);
      this.getSampleHold = getParameterValue(parameters.sampleHold, 0, 1000000);

      this.getNextValueTrigger = this.manualTriggerOn
        ? () => 1e9
        : getParameterValue(parameters.nextValueTrigger, 0, 1);

      for (let i = 0; i < output[0].length; ++i, ++this.samplesHeld) {
        // recover from overflow
        if (this.samplesHeld < 0) {
          this.samplesHeld = 0;
        }

        const sampleHold = this.getSampleHold(i);

        // keep playing previous sample forever if sampleHold < 1
        if (sampleHold >= 1 && this.samplesHeld >= sampleHold) {
          this.samplesHeld -= sampleHold;
          this.previousValue = getNextValue(
            this.previousValue,
            this.getStepMin(i),
            this.getStepMax(i)
          );
        }
        const triggerValue = this.getNextValueTrigger(i);
        if (this.isTriggerValueHigh != triggerValue > 0) {
          this.triggerChangeMessage.value = triggerValue > 0;
          this.port.postMessage(this.triggerChangeMessage);
        }
        if (!this.isTriggerValueHigh && triggerValue > 0) {
          this.previousValue = getNextValue(
            this.previousValue,
            this.getStepMin(i),
            this.getStepMax(i)
          );
        }
        this.isTriggerValueHigh = triggerValue > 0;
        for (let channel = 0; channel < output.length; ++channel) {
          output[channel][i] = this.previousValue;
        }
      }
      return true;
    }
  }
);
