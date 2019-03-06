registerProcessor(
  "noise",
  class Noise extends AudioWorkletProcessor {
    static get parameterDescriptors() {
      return [
        {
          name: "stepMax",
          defaultValue: 1,
          minValue: 0,
          maxValue: 1,
          automationRate: "a-rate"
        },
        {
          name: "stepMin",
          defaultValue: 0,
          minValue: 0,
          maxValue: 1,
          automationRate: "a-rate"
        }
      ];
    }
    constructor() {
      super();
      this.previousValue = 0;
    }
    process(inputs, outputs, parameters) {
      // Get the first output.
      let output = outputs[0];
      let stepMin = parameters.stepMin;
      let stepMinLength = stepMin.length;
      let getStepMin = stepMinLength > 1 ? i => stepMin[i] : () => stepMin[0];
      let stepMax = parameters.stepMax;
      let stepMaxLength = stepMax.length;
      let getStepMax = stepMaxLength > 1 ? i => stepMax[i] : () => stepMax[0];

      for (let channel = 0; channel < output.length; ++channel) {
        for (let i = 0; i < output[channel].length; ++i) {
          const stepSize =
            Math.random() * (getStepMax(i) - getStepMin(i)) + getStepMin(i);
          let next;
          const preferUp = Math.random() > 0.5;
          if (preferUp) {
            next =
              this.previousValue + stepSize > 1
                ? this.previousValue - stepSize
                : this.previousValue + stepSize;
          } else {
            next =
              this.previousValue - stepSize < -1
                ? this.previousValue + stepSize
                : this.previousValue - stepSize;
          }
          output[channel][i] = next;
          this.previousValue = next;
        }
      }
      return true;
    }
  }
);
