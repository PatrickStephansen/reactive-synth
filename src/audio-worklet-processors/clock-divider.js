registerProcessor(
  'clock-divider',
  class ClockDivider extends AudioWorkletProcessor {
    static get parameterDescriptors() {
      return [
        {
          name: 'clockIn',
          defaultValue: 0,
          automationRate: 'a-rate'
        },
        {
          name: 'reset',
          defaultValue: 0,
          automationRate: 'a-rate'
        },
        {
          name: 'attackDivisor',
          defaultValue: 1,
          minValue: 1,
          maxValue: 1e12,
          automationRate: 'a-rate'
        },
        {
          name: 'releaseDivisor',
          defaultValue: 1,
          minValue: 1,
          maxValue: 1e12,
          automationRate: 'a-rate'
        }
      ];
    }
    constructor(options) {
      super(options);
    }

    process(inputs, outputs, parameters) {
      return true;
    }
  }
);
