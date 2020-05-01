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
      // Garbage collection still happens every ~5s clearing 1MB - even if the process function does nothing but return true.
      // The allocation of the inputs and parameters must be causing this, but it's surprising that they would be re-allocated every time.
      if (inputs[0][0].length && this.wasmModule) {
        this.float32WasmMemory.set(
          inputs[0][0],
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
          this.wasmModule.exports.process_quantum(
            this.internalProcessorPtr,
            inputs[0][0].length,
            parameters.divisor.length,
            parameters.zeroDivisorFallback.length
          ) / bytesPerSample;
        for (let channelIndex = 0; channelIndex < outputs[0].length; channelIndex++) {
          // TODO: can this not be done with some array util that's faster?
          for (let sample = 0; sample < outputs[0][channelIndex].length; sample++) {
            outputs[0][channelIndex][sample] = this.float32WasmMemory[outputPointer + sample];
          }
        }
      }
      return true;
    }
  }
);
