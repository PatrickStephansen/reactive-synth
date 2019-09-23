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
    }

    handleMessage(event) {
      if (event.data && event.data.type === 'manual-trigger') {
        this.manualTriggerOn = event.data.value;
      }
    }

    process(inputs, outputs, parameters) {
      // Get the first output.
      let output = outputs[0];
      let getStepMin = getParameterValue(parameters.stepMin, 0, 1);
      let getStepMax = getParameterValue(parameters.stepMax, 0, 1);
      let getSampleHold = getParameterValue(parameters.sampleHold, 0, 1000000);

      let getNextValueTrigger = this.manualTriggerOn
        ? () => 1e9
        : getParameterValue(parameters.nextValueTrigger, 0, 1);

      for (let i = 0; i < output[0].length; ++i, ++this.samplesHeld) {
        // recover from overflow
        if (this.samplesHeld < 0) {
          this.samplesHeld = 0;
        }

        const sampleHold = getSampleHold(i);

        // keep playing previous sample forever if sampleHold < 1
        if (sampleHold >= 1 && this.samplesHeld >= sampleHold) {
          this.samplesHeld -= sampleHold;
          this.previousValue = getNextValue(this.previousValue, getStepMin(i), getStepMax(i));
        }
        const triggerValue = getNextValueTrigger(i);
        if (this.isTriggerValueHigh != triggerValue > 0) {
          this.port.postMessage({ type: 'trigger-change', value: triggerValue > 0 });
        }
        if (!this.isTriggerValueHigh && triggerValue > 0) {
          this.previousValue = getNextValue(this.previousValue, getStepMin(i), getStepMax(i));
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
