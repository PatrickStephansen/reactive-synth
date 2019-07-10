import { crush } from './crush-bit-fixed-point';

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
      if (
        event.data &&
        event.data.type === 'change-fractional-bit-depth-mode'
      ) {
        this.fractionalBitDepthMode = event.data.newMode;
      }
    }

    process(inputs, outputs, parameters) {
      // Only one input and output.
      let input = inputs[0];
      let output = outputs[0];
      let bitDepth = parameters.bitDepth;
      let bitDepthLength = bitDepth.length;
      let getBitDepth =
        bitDepthLength > 1 ? i => bitDepth[i] : () => bitDepth[0];

      for (let channelIndex = 0; channelIndex < input.length; channelIndex++) {
        const inputChannel = input[channelIndex];
        const outputChannel = output[channelIndex];
        for (
          let sampleIndex = 0;
          sampleIndex < inputChannel.length;
          sampleIndex++
        ) {
          const inputSample = inputChannel[sampleIndex];
          outputChannel[sampleIndex] = crush(
            inputSample,
            getBitDepth(sampleIndex),
            this.fractionalBitDepthMode
          );
        }
      }
      return true;
    }
  }
);
