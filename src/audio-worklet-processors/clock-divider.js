import {
  clockInTriggerStages,
  clockStages,
  divideClockTicks,
  resetTriggerStages
} from './divide-clock-ticks';
import { getParameterValue } from './getParameterValue';

// Webpack turns function imports into object constructor calls
// local assignment prevents many object constructor calls
const getParamValue = getParameterValue;

registerProcessor(
  'reactive-synth-clock-divider',
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
        },
        {
          name: 'ticksOnReset',
          defaultValue: 0,
          minValue: -1e9,
          maxValue: 1e9,
          automationRate: 'a-rate'
        },
        {
          name: 'tocksOnReset',
          defaultValue: 0,
          minValue: -1e9,
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
      this.userParams = {
        attackAfterTicks: 0,
        releaseAfterTocks: 0,
        ticksOnReset: 0,
        tocksOnReset: 0
      };
      this.initialReset = true;
      this.port.onmessage = this.handleMessage.bind(this);
      this.manualClockTriggerOn = false;
      this.manualResetTriggerOn = false;
      this.clockTriggerOn = false;
      this.resetTriggerOn = false;
      this.clockTriggerChangeMessage = { type: 'clock-trigger-change', value: false };
      this.resetTriggerChangeMessage = { type: 'reset-trigger-change', value: false };
    }

    handleMessage(event) {
      if (event.data && event.data.type === 'manual-clock-trigger') {
        this.manualClockTriggerOn = event.data.value;
      }
      if (event.data && event.data.type === 'manual-reset-trigger') {
        this.manualResetTriggerOn = event.data.value;
      }
      if (event.data && event.data.type === 'wasm') {
        this.port.postMessage({ type: 'module-ready', value: true });
      }
    }

    process(inputs, outputs, parameters) {
      const output = outputs[0];

      this.getClockTriggerValue = this.manualClockTriggerOn
        ? () => 1e9
        : getParamValue(parameters.clockTrigger, -1e9, 1e9);
      this.getResetTriggerValue =
        this.manualResetTriggerOn || this.initialReset
          ? () => {
              this.initialReset = false;
              return 1e9;
            }
          : getParamValue(parameters.resetTrigger, -1e9, 1e9);
      this.getAttackAfterTicks = getParamValue(parameters.attackAfterTicks, 1, 1e9);
      this.getReleaseAfterTocks = getParamValue(parameters.releaseAfterTocks, 1, 1e9);
      this.getTicksOnReset = getParamValue(parameters.ticksOnReset, -1e9, 1e9);
      this.getTocksOnReset = getParamValue(parameters.tocksOnReset, -1e9, 1e9);

      for (let sampleIndex = 0; sampleIndex < output[0].length; sampleIndex++) {
        const clockTriggerValue = this.getClockTriggerValue(sampleIndex);
        const resetTriggerValue = this.getResetTriggerValue(sampleIndex);
        let clockTriggerStage;
        if (clockTriggerValue > 0) {
          if (this.clockTriggerOn) {
            clockTriggerStage = clockInTriggerStages.high;
          } else {
            clockTriggerStage = clockInTriggerStages.attack;
            this.clockTriggerChangeMessage.value = true;
            this.port.postMessage(this.clockTriggerChangeMessage);
          }
          this.clockTriggerOn = true;
        } else {
          if (this.clockTriggerOn) {
            clockTriggerStage = clockInTriggerStages.release;
            this.clockTriggerChangeMessage.value = false;
            this.port.postMessage(this.clockTriggerChangeMessage);
          } else {
            clockTriggerStage = clockInTriggerStages.low;
          }
          this.clockTriggerOn = false;
        }
        let resetTriggerStage = resetTriggerStages.keepGoing;

        if (this.resetTriggerOn !== resetTriggerValue > 0) {
          this.resetTriggerChangeMessage.value = resetTriggerValue > 0;
          this.port.postMessage(this.resetTriggerChangeMessage);
        }
        if (resetTriggerValue > 0 && !this.resetTriggerOn) {
          resetTriggerStage = resetTriggerStages.reset;
        }
        this.resetTriggerOn = resetTriggerValue > 0;

        this.userParams.attackAfterTicks = this.getAttackAfterTicks(sampleIndex);
        this.userParams.releaseAfterTocks = this.getReleaseAfterTocks(sampleIndex);
        this.userParams.ticksOnReset = this.getTicksOnReset(sampleIndex);
        this.userParams.tocksOnReset = this.getTocksOnReset(sampleIndex);

        // mutates this.state
        divideClockTicks(this.state, this.userParams, clockTriggerStage, resetTriggerStage);
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
