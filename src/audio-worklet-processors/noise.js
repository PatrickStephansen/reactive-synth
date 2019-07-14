import { clamp } from 'ramda';

const clampStep = clamp(0, 1);
const clampSampleHold = clamp(0, 1000000);
const clampTrigger = clamp(0, 1);

const getNextValue = (previousValue, stepMin, stepMax) => {
  const stepSize = Math.random() * (stepMax - stepMin) + stepMin;
  const preferUp = Math.random() > 0.5;
  if (preferUp) {
    return previousValue + stepSize > 1
      ? previousValue - stepSize
      : previousValue + stepSize;
  } else {
    return previousValue - stepSize < -1
      ? previousValue + stepSize
      : previousValue - stepSize;
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
          minValue: 0,
          maxValue: 1,
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
    }
    process(inputs, outputs, parameters) {
      // Get the first output.
      let output = outputs[0];
      let stepMin = parameters.stepMin;
      let stepMinLength = stepMin.length;
      let getStepMin =
        stepMinLength > 1
          ? i => clampStep(stepMin[i])
          : () => clampStep(stepMin[0]);
      let stepMax = parameters.stepMax;
      let stepMaxLength = stepMax.length;
      let getStepMax =
        stepMaxLength > 1
          ? i => clampStep(stepMax[i])
          : () => clampStep(stepMax[0]);
      let sampleHold = parameters.sampleHold;
      let sampleHoldLength = sampleHold.length;
      let getSampleHold =
        sampleHoldLength > 1
          ? i => clampSampleHold(sampleHold[i])
          : () => clampSampleHold(sampleHold[0]);
      let nextValueTrigger = parameters.nextValueTrigger;
      let nextValueTriggerLength = nextValueTrigger.length;
      let getNextValueTrigger =
        nextValueTriggerLength > 1
          ? i => clampTrigger(nextValueTrigger[i])
          : () => clampTrigger(nextValueTrigger[0]);

      for (let i = 0; i < output[0].length; ++i, ++this.samplesHeld) {
        // recover from overflow
        if (this.samplesHeld < 0) {
          this.samplesHeld = 0;
        }

        const sampleHold = getSampleHold(i);

        // keep playing previous sample forever if sampleHold < 1
        if (sampleHold >= 1 && this.samplesHeld >= sampleHold) {
          this.samplesHeld -= sampleHold;
          this.previousValue = getNextValue(
            this.previousValue,
            getStepMin(i),
            getStepMax(i)
          );
        }
        if (!this.isTriggerValueHigh && getNextValueTrigger(i) > 0) {
          this.previousValue = getNextValue(
            this.previousValue,
            getStepMin(i),
            getStepMax(i)
          );
        }
        this.isTriggerValueHigh = getNextValueTrigger(i) > 0;
        for (let channel = 0; channel < output.length; ++channel) {
          output[channel][i] = this.previousValue;
        }
      }
      return true;
    }
  }
);
