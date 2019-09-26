import { crush } from './crush-bit-fixed-point';
import { getParameterValue } from './getParameterValue';

const getParamValue = getParameterValue;

registerProcessor(
  'bit-crusher-fixed-point',
  class Noise extends AudioWorkletProcessor {
    static get parameterDescriptors() {
      return [
        {
          name: 'bitDepth',
          defaultValue: 8,
          minValue: 1,
          maxValue: 32,
          automationRate: 'a-rate'
        }
      ];
    }

    constructor() {
      super();
      this.fractionalBitDepthMode = 'quantize-evenly';
      this.port.onmessage = this.handleMessage.bind(this);
    }

    handleMessage(event) {
      if (event.data && event.data.type === 'change-fractional-bit-depth-mode') {
        this.fractionalBitDepthMode = event.data.newMode;
      }
    }

    process(inputs, outputs, parameters) {
      // Only one input and output.
      let input = inputs[0];
      let output = outputs[0];
      this.getBitDepth = getParamValue(parameters.bitDepth, 1, 32);

      for (let channelIndex = 0; channelIndex < input.length; channelIndex++) {
        const inputChannel = input[channelIndex];
        const outputChannel = output[channelIndex];
        for (let sampleIndex = 0; sampleIndex < inputChannel.length; sampleIndex++) {
          const inputSample = inputChannel[sampleIndex];
          outputChannel[sampleIndex] = crush(
            inputSample,
            this.getBitDepth(sampleIndex),
            this.fractionalBitDepthMode
          );
        }
      }
      return true;
    }
  }
);
