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
      console.log('binary', binary);
      console.log('compiled', compiledModule);
      this.wasmModule = (await WebAssembly.instantiate(compiledModule,{}));
      console.log('imported wasm', wasmModule);
    }

    process(inputs, outputs, parameters) {
      // Only one input and output.
      let input = inputs[0];
      let output = outputs[0];
      if (input[0].length && this.wasmModule) {
        // re-instantiating every time is probably a memory leak
        this.internalProcessor = new this.wasmModule.new(
          input[0],
          output[0],
          parameters.divisor,
          parameters.zeroDivisorFallback
        );
        this.internalProcessor.process();
        for (let channelIndex = 0; channelIndex < output.length; channelIndex++) {
          output[channelIndex] = new Float32Array(
            this.wasmModule.memory.buffer,
            this.internalProcessor.get_output(),
            128
          );
        }
      }
      return true;
    }
  }
);
