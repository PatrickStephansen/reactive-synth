import { getParameterValue } from "./getParameterValue";

const getParamValue = getParameterValue;

registerProcessor(
  'inverse-gain',
  class InverseGain extends AudioWorkletProcessor {
    static get parameterDescriptors() {
      return [
        {
          name: 'divisor',
          defaultValue: 10,
          automationRate: 'a-rate'
        },
        {
          name: 'zeroDivisorFallback',
          defaultValue: 0,
          automationRate: 'a-rate'
        }
      ];
    }

    process(inputs, outputs, parameters) {
      // Only one input and output.
      let input = inputs[0];
      let output = outputs[0];
      this.getDivisor = getParamValue(parameters.divisor, -1e9, 1e9);
      this.getZeroDivisorOutput = getParamValue(parameters.zeroDivisorFallback, -1e9, 1e9);

      for (let channelIndex = 0; channelIndex < input.length; channelIndex++) {
        const inputChannel = input[channelIndex];
        const outputChannel = output[channelIndex];
        for (
          let sampleIndex = 0;
          sampleIndex < inputChannel.length;
          sampleIndex++
        ) {
          const inputSample = inputChannel[sampleIndex];
          const divisor = this.getDivisor(sampleIndex);
          if (divisor === 0) {
            outputChannel[sampleIndex] = this.getZeroDivisorOutput(sampleIndex);
          } else {
            outputChannel[sampleIndex] = inputSample / divisor;
          }
        }
      }
      return true;
    }
  }
);
