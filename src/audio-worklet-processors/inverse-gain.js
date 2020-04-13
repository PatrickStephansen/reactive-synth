const defaultMin = -1e9;
const defaultMax = 1e9;
const bytesPerSample = 4;

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

    constructor() {
      super();
      this.port.onmessage = event => {
        if (event.data.type === 'wasm') {
          this.initWasmModule(event.data.wasmBinary);
        }
      };
    }

    async initWasmModule(binary) {
      const compiledModule = await WebAssembly.compile(binary);
      this.wasmModule = await WebAssembly.instantiate(compiledModule, {
        console: { log: s => console.log('message from wasm', s) }
      });
      this.internalProcessorPtr = this.wasmModule.exports.init(
        defaultMin,
        defaultMax,
        defaultMin,
        defaultMax,
        defaultMin,
        defaultMax
      );
      this.float32WasmMemory = new Float32Array(this.wasmModule.exports.memory.buffer);
    }

    process(inputs, outputs, parameters) {
      // Only one input and output.
      let input = inputs[0];
      let output = outputs[0];
      if (input[0].length && this.wasmModule) {
        this.float32WasmMemory.set(
          input[0],
          this.wasmModule.exports.get_quotient_ptr(this.internalProcessorPtr) / bytesPerSample
        );
        this.float32WasmMemory.set(
          parameters.divisor,
          this.wasmModule.exports.get_divisor_ptr(this.internalProcessorPtr) / bytesPerSample
        );
        this.float32WasmMemory.set(
          parameters.zeroDivisorFallback,
          this.wasmModule.exports.get_divisor_fallback_ptr(this.internalProcessorPtr) /
            bytesPerSample
        );
        const outputPointer =
          this.wasmModule.exports.process_quantum(this.internalProcessorPtr) / bytesPerSample;
        const outArray = this.float32WasmMemory.slice(outputPointer, outputPointer + 128);
        for (let channelIndex = 0; channelIndex < output.length; channelIndex++) {
          for (let sample = 0; sample < output[channelIndex].length; sample++) {
            output[channelIndex][sample] = outArray[sample];
          }
        }
      }
      return true;
    }
  }
);
