import {
  clockInTriggerStages,
  clockStages,
  divideClockTicks,
  resetTriggerStages
} from './divide-clock-ticks';
import { getParameterValue } from './getParameterValue';

registerProcessor(
  'clock-divider',
  class ClockDivider extends AudioWorkletProcessor {
    static get parameterDescriptors() {
      return [
        {
          name: 'clockTrigger',
          defaultValue: 0,
          automationRate: 'a-rate'
        },
        {
          name: 'resetTrigger',
          defaultValue: 0,
          automationRate: 'a-rate'
        },
        {
          name: 'attackAfterTicks',
          defaultValue: 1,
          minValue: 1,
          maxValue: 1e9,
          automationRate: 'a-rate'
        },
        {
          name: 'releaseAfterTocks',
          defaultValue: 1,
          minValue: 1,
          maxValue: 1e9,
          automationRate: 'a-rate'
        }
      ];
    }
    constructor(options) {
      super(options);
      this.state = {
        stage: clockStages.tock,
        // will be set according to params on reset
        ticksPast: 0,
        tocksPast: 0
      };
      this.userParams = { attackAfterTicks: 0, releaseAfterTocks: 0 };
      this.initialReset = true;
      this.port.onmessage = this.handleMessage.bind(this);
      this.manualClockTriggerOn = false;
      this.manualResetTriggerOn = false;
      this.clockTriggerOn = false;
      this.resetTriggerOn = false;
    }

    handleMessage(event) {
      if (event.data && event.data.type === 'manual-clock-trigger') {
        this.manualClockTriggerOn = event.data.value;
      }
      if (event.data && event.data.type === 'manual-reset-trigger') {
        this.manualResetTriggerOn = event.data.value;
      }
    }

    process(inputs, outputs, parameters) {
      const output = outputs[0];

      const getClockTriggerValue = this.manualClockTriggerOn
        ? () => 1e9
        : getParameterValue(parameters.clockTrigger, -1e9, 1e9);
      const getResetTriggerValue =
        this.manualResetTriggerOn || this.initialReset
          ? () => {
              this.initialReset = false;
              return 1e9;
            }
          : getParameterValue(parameters.resetTrigger, -1e9, 1e9);
      const getAttackAfterTicks = getParameterValue(parameters.attackAfterTicks, 1, 1e9);
      const getReleaseAfterTocks = getParameterValue(parameters.releaseAfterTocks, 1, 1e9);

      for (let sampleIndex = 0; sampleIndex < output[0].length; sampleIndex++) {
        const clockTriggerValue = getClockTriggerValue(sampleIndex);
        const resetTriggerValue = getResetTriggerValue(sampleIndex);
        let clockTriggerStage;
        if (clockTriggerValue > 0) {
          if (this.clockTriggerOn) {
            clockTriggerStage = clockInTriggerStages.high;
          } else {
            clockTriggerStage = clockInTriggerStages.attack;
            this.port.postMessage({ type: 'clock-trigger-change', value: true });
          }
          this.clockTriggerOn = true;
        } else {
          if (this.clockTriggerOn) {
            clockTriggerStage = clockInTriggerStages.release;
            this.port.postMessage({ type: 'clock-trigger-change', value: false });
          } else {
            clockTriggerStage = clockInTriggerStages.low;
          }
          this.clockTriggerOn = false;
        }
        let resetTriggerStage = resetTriggerStages.keepGoing;

        if (this.resetTriggerOn !== resetTriggerValue > 0) {
          this.port.postMessage({ type: 'reset-trigger-change', value: resetTriggerValue > 0 });
        }
        if (resetTriggerValue > 0 && !this.resetTriggerOn) {
          resetTriggerStage = resetTriggerStages.reset;
        }
        this.resetTriggerOn = resetTriggerValue > 0;

        this.userParams.attackAfterTicks = getAttackAfterTicks(sampleIndex);
        this.userParams.releaseAfterTocks = getReleaseAfterTocks(sampleIndex);

        // mutates this.state
        divideClockTicks(
          this.state,
          this.userParams,
          clockTriggerStage,
          resetTriggerStage
        );
        // only expecting one channel, but tolerating more in case
        for (let channelIndex = 0; channelIndex < output.length; channelIndex++) {
          const outputChannel = output[channelIndex];

          outputChannel[sampleIndex] = this.state.stage;
        }
      }
      return true;
    }
  }
);
