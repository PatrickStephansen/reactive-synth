registerProcessor(
  'inverse-gain',
  class Noise extends AudioWorkletProcessor {
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
      let divisor = parameters.divisor;
      let divisorLength = divisor.length;
      let getDivisor = divisorLength > 1 ? i => divisor[i] : () => divisor[0];
      let getZeroDivisorOutput =
        parameters.zeroDivisorFallback.length > 1
          ? i => parameters.zeroDivisorFallback[i]
          : () => parameters.zeroDivisorFallback[0];

      for (let channelIndex = 0; channelIndex < input.length; channelIndex++) {
        const inputChannel = input[channelIndex];
        const outputChannel = output[channelIndex];
        for (
          let sampleIndex = 0;
          sampleIndex < inputChannel.length;
          sampleIndex++
        ) {
          const inputSample = inputChannel[sampleIndex];
          const divisor = getDivisor(sampleIndex);
          if (divisor === 0) {
            outputChannel[sampleIndex] = getZeroDivisorOutput(sampleIndex);
          } else {
            outputChannel[sampleIndex] = inputSample / divisor;
          }
        }
      }
      return true;
    }
  }
);
