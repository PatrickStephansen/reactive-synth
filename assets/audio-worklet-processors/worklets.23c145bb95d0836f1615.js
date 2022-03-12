!function(){const e=Float32Array.BYTES_PER_ELEMENT,t={0:"rest",1:"attack",2:"hold",3:"decay",4:"sustain",5:"release"};registerProcessor("reactive-synth-envelope-generator",class extends AudioWorkletProcessor{static get parameterDescriptors(){return[{name:"trigger",defaultValue:0,automationRate:"a-rate"},{name:"attackValue",defaultValue:1,minValue:0,maxValue:1,automationRate:"a-rate"},{name:"attackTime",defaultValue:.001,minValue:0,maxValue:10,automationRate:"a-rate"},{name:"holdTime",minValue:0,defaultValue:.0625,maxValue:10,automationRate:"a-rate"},{name:"decayTime",defaultValue:.125,minValue:0,maxValue:10,automationRate:"a-rate"},{name:"sustainValue",defaultValue:.25,minValue:0,maxValue:1,automationRate:"a-rate"},{name:"releaseTime",defaultValue:.25,minValue:0,maxValue:10}]}constructor(e){super(e),this.port.onmessage=this.handleMessage.bind(this),this.sampleRate=e.sampleRate||44100,this.triggerChangeMessage={type:"trigger-change",value:!1},this.stateMessage={type:"state",state:{stage:"rest",stageProgress:0,outputValue:0}},this.manualTriggerOn=!1,this.manualTriggerOnParameter=[1]}handleMessage(e){e.data&&"get-state"===e.data.type&&this.wasmModule&&this.wasmModule.exports.publish_state(this.internalProcessorPtr),e.data&&"manual-trigger"===e.data.type&&(this.manualTriggerOn=e.data.value),e.data&&"wasm"===e.data.type&&this.initWasmModule(e.data.wasmModule).then((()=>this.port.postMessage({type:"module-ready",value:!0})))}async initWasmModule(e){e=await WebAssembly.compile(e),this.wasmModule=await WebAssembly.instantiate(e,{imports:{triggerChange:e=>{this.triggerChangeMessage.value=e,this.port.postMessage(this.triggerChangeMessage)},shareState:(e,a,s,r,i,o,l,n,m)=>{this.stateMessage.state.stage=t[e],this.stateMessage.state.stageProgress=a,this.stateMessage.state.outputValue=s,this.stateMessage.state.parameters={attackValue:r,attackTime:i,holdTime:o,decayTime:l,sustainValue:n,releaseTime:m},this.port.postMessage(this.stateMessage)}}}),this.internalProcessorPtr=this.wasmModule.exports.init(128,this.sampleRate),this.float32WasmMemory=new Float32Array(this.wasmModule.exports.memory.buffer)}process(t,a,s){if(this.wasmModule){this.float32WasmMemory.set(this.manualTriggerOn?this.manualTriggerOnParameter:s.trigger,this.wasmModule.exports.get_input_gate_ptr(this.internalProcessorPtr)/e),this.float32WasmMemory.set(s.attackValue,this.wasmModule.exports.get_attack_value_ptr(this.internalProcessorPtr)/e),this.float32WasmMemory.set(s.attackTime,this.wasmModule.exports.get_attack_time_ptr(this.internalProcessorPtr)/e),this.float32WasmMemory.set(s.holdTime,this.wasmModule.exports.get_hold_time_ptr(this.internalProcessorPtr)/e),this.float32WasmMemory.set(s.decayTime,this.wasmModule.exports.get_decay_time_ptr(this.internalProcessorPtr)/e),this.float32WasmMemory.set(s.sustainValue,this.wasmModule.exports.get_sustain_value_ptr(this.internalProcessorPtr)/e),this.float32WasmMemory.set(s.releaseTime,this.wasmModule.exports.get_release_time_ptr(this.internalProcessorPtr)/e);const t=this.wasmModule.exports.process_quantum(this.internalProcessorPtr,this.manualTriggerOn?this.manualTriggerOnParameter.length:s.trigger.length,s.attackValue.length,s.attackTime.length,s.holdTime.length,s.decayTime.length,s.sustainValue.length,s.releaseTime.length)/e;for(let e=0;e<a[0].length;e++)for(let s=0;s<a[0][e].length;s++)a[0][e][s]=this.float32WasmMemory[t+s]}return!0}})}(),function(){const e=Float32Array.BYTES_PER_ELEMENT;registerProcessor("reactive-synth-clock-divider",class extends AudioWorkletProcessor{static get parameterDescriptors(){return[{name:"clockTrigger",defaultValue:0,automationRate:"a-rate"},{name:"resetTrigger",defaultValue:0,automationRate:"a-rate"},{name:"attackAfterTicks",defaultValue:1,minValue:1,maxValue:1e9,automationRate:"a-rate"},{name:"releaseAfterTocks",defaultValue:1,minValue:1,maxValue:1e9,automationRate:"a-rate"},{name:"ticksOnReset",defaultValue:0,minValue:-1e9,maxValue:1e9,automationRate:"a-rate"},{name:"tocksOnReset",defaultValue:0,minValue:-1e9,maxValue:1e9,automationRate:"a-rate"}]}constructor(e){super(e),this.port.onmessage=this.handleMessage.bind(this),this.clockTriggerChangeMessage={type:"clock-trigger-change",value:!1},this.resetTriggerChangeMessage={type:"reset-trigger-change",value:!1},this.manualClockTriggerOn=!1,this.manualResetTriggerOn=!1,this.initialReset=!0,this.manualTriggerOnParameter=[1]}handleMessage(e){e.data&&"manual-clock-trigger"===e.data.type&&(this.manualClockTriggerOn=e.data.value),e.data&&"manual-reset-trigger"===e.data.type&&(this.manualResetTriggerOn=e.data.value),e.data&&"wasm"===e.data.type&&this.initWasmModule(e.data.wasmModule).then((()=>this.port.postMessage({type:"module-ready",value:!0})))}async initWasmModule(e){e=await WebAssembly.compile(e),this.wasmModule=await WebAssembly.instantiate(e,{imports:{clockChange:e=>{this.clockTriggerChangeMessage.value=e,this.port.postMessage(this.clockTriggerChangeMessage)},resetChange:e=>{this.resetTriggerChangeMessage.value=e,this.port.postMessage(this.resetTriggerChangeMessage)}}}),this.internalProcessorPtr=this.wasmModule.exports.init(128),this.float32WasmMemory=new Float32Array(this.wasmModule.exports.memory.buffer)}process(t,a,s){if(this.wasmModule){this.float32WasmMemory.set(this.manualClockTriggerOn?this.manualTriggerOnParameter:s.clockTrigger,this.wasmModule.exports.get_clock_gate_ptr(this.internalProcessorPtr)/e),this.float32WasmMemory.set(this.manualResetTriggerOn||this.initialReset?this.manualTriggerOnParameter:s.resetTrigger,this.wasmModule.exports.get_reset_gate_ptr(this.internalProcessorPtr)/e),this.float32WasmMemory.set(s.attackAfterTicks,this.wasmModule.exports.get_open_after_ticks_ptr(this.internalProcessorPtr)/e),this.float32WasmMemory.set(s.releaseAfterTocks,this.wasmModule.exports.get_close_after_tocks_ptr(this.internalProcessorPtr)/e),this.float32WasmMemory.set(s.ticksOnReset,this.wasmModule.exports.get_ticks_on_reset_ptr(this.internalProcessorPtr)/e),this.float32WasmMemory.set(s.tocksOnReset,this.wasmModule.exports.get_tocks_on_reset_ptr(this.internalProcessorPtr)/e);const t=this.wasmModule.exports.process_quantum(this.internalProcessorPtr,this.manualClockTriggerOn?this.manualTriggerOnParameter.length:s.clockTrigger.length,this.manualResetTriggerOn||this.initialReset?this.manualTriggerOnParameter.length:s.resetTrigger.length,s.attackAfterTicks.length,s.releaseAfterTocks.length,s.ticksOnReset.length,s.tocksOnReset.length)/e;this.initialReset&&(this.initialReset=!1);for(let e=0;e<a[0].length;e++)for(let s=0;s<a[0][e].length;s++)a[0][e][s]=this.float32WasmMemory[t+s]}return!0}})}(),registerProcessor("reactive-synth-noise-generator",class extends AudioWorkletProcessor{static get parameterDescriptors(){return[{name:"stepMax",defaultValue:1,minValue:0,maxValue:1,automationRate:"a-rate"},{name:"stepMin",defaultValue:0,minValue:0,maxValue:1,automationRate:"a-rate"},{name:"sampleHold",defaultValue:1,minValue:0,maxValue:1e6,automationRate:"a-rate"},{name:"nextValueTrigger",defaultValue:0,automationRate:"a-rate"}]}constructor(){super(),this.port.onmessage=this.handleMessage.bind(this),this.triggerChangeMessage={type:"trigger-change",value:!1},this.manualTriggerOn=!1,this.manualTriggerOnParameter=[1]}handleMessage(e){e.data&&"manual-trigger"===e.data.type&&(this.manualTriggerOn=e.data.value),e.data&&"wasm"===e.data.type&&this.initWasmModule(e.data.wasmModule).then((()=>this.port.postMessage({type:"module-ready",value:!0})))}async initWasmModule(e){e=await WebAssembly.compile(e),this.wasmModule=await WebAssembly.instantiate(e,{imports:{change:e=>{this.triggerChangeMessage.value=e,this.port.postMessage(this.triggerChangeMessage)},random:Math.random}}),this.internalProcessorPtr=this.wasmModule.exports.init(128),this.float32WasmMemory=new Float32Array(this.wasmModule.exports.memory.buffer)}process(e,t,a){if(this.wasmModule){this.float32WasmMemory.set(a.stepMin,this.wasmModule.exports.get_step_minimum_ptr(this.internalProcessorPtr)/4),this.float32WasmMemory.set(a.stepMax,this.wasmModule.exports.get_step_maximum_ptr(this.internalProcessorPtr)/4),this.float32WasmMemory.set(a.sampleHold,this.wasmModule.exports.get_sample_hold_ptr(this.internalProcessorPtr)/4),this.float32WasmMemory.set(this.manualTriggerOn?this.manualTriggerOnParameter:a.nextValueTrigger,this.wasmModule.exports.get_next_value_trigger_ptr(this.internalProcessorPtr)/4);const e=this.wasmModule.exports.process_quantum(this.internalProcessorPtr,a.stepMin.length,a.stepMax.length,a.sampleHold.length,this.manualTriggerOn?this.manualTriggerOnParameter.length:a.nextValueTrigger.length)/4;for(let a=0;a<t[0].length;a++)for(let s=0;s<t[0][a].length;s++)t[0][a][s]=this.float32WasmMemory[e+s]}return!0}}),registerProcessor("reactive-synth-bitcrusher",class extends AudioWorkletProcessor{static get parameterDescriptors(){return[{name:"bitDepth",defaultValue:8,minValue:1,maxValue:32,automationRate:"a-rate"}]}constructor(){super(),this.fractionalBitDepthMode="quantize-evenly",this.port.onmessage=this.handleMessage.bind(this),this.fractionalBitDepthModes={trve:0,"quantize-evenly":1,continuous:2}}handleMessage(e){e.data&&"change-fractional-bit-depth-mode"===e.data.type&&(this.fractionalBitDepthMode=e.data.newMode,this.wasmModule.exports.set_mode(this.internalProcessorPtr,this.fractionalBitDepthModes[this.fractionalBitDepthMode])),e.data&&"wasm"===e.data.type&&this.initWasmModule(e.data.wasmModule).then((()=>this.port.postMessage({type:"module-ready",value:!0})))}async initWasmModule(e){e=await WebAssembly.compile(e),this.wasmModule=await WebAssembly.instantiate(e,{}),this.internalProcessorPtr=this.wasmModule.exports.init(128,this.fractionalBitDepthModes[this.fractionalBitDepthMode]),this.float32WasmMemory=new Float32Array(this.wasmModule.exports.memory.buffer)}process(e,t,a){if(e[0]&&e[0][0]&&e[0][0].length&&this.wasmModule){this.float32WasmMemory.set(e[0][0],this.wasmModule.exports.get_input_ptr(this.internalProcessorPtr)/4),this.float32WasmMemory.set(a.bitDepth,this.wasmModule.exports.get_bit_depth_ptr(this.internalProcessorPtr)/4);const s=this.wasmModule.exports.process_quantum(this.internalProcessorPtr,e[0][0].length,a.bitDepth.length)/4;for(let e=0;e<t[0].length;e++)for(let a=0;a<t[0][e].length;a++)t[0][e][a]=this.float32WasmMemory[s+a]}return!0}}),function(){const e=-1e9,t=1e9;registerProcessor("reactive-synth-inverse-gain",class extends AudioWorkletProcessor{static get parameterDescriptors(){return[{name:"divisor",defaultValue:10,automationRate:"a-rate"},{name:"zeroDivisorFallback",defaultValue:0,automationRate:"a-rate"}]}constructor(){super(),this.defaultInput=[0],this.port.onmessage=e=>{"wasm"===e.data.type&&this.initWasmModule(e.data.wasmModule).then((()=>this.port.postMessage({type:"module-ready",value:!0})))}}async initWasmModule(a){a=await WebAssembly.compile(a),this.wasmModule=await WebAssembly.instantiate(a,{}),this.internalProcessorPtr=this.wasmModule.exports.init(e,t,e,t,e,t),this.float32WasmMemory=new Float32Array(this.wasmModule.exports.memory.buffer)}process(e,t,a){if(this.wasmModule){this.float32WasmMemory.set(e&&e[0]&&e[0][0]||this.defaultInput,this.wasmModule.exports.get_quotient_ptr(this.internalProcessorPtr)/4),this.float32WasmMemory.set(a.divisor,this.wasmModule.exports.get_divisor_ptr(this.internalProcessorPtr)/4),this.float32WasmMemory.set(a.zeroDivisorFallback,this.wasmModule.exports.get_divisor_fallback_ptr(this.internalProcessorPtr)/4);const s=this.wasmModule.exports.process_quantum(this.internalProcessorPtr,(e&&e[0]&&e[0][0]||this.defaultInput).length,a.divisor.length,a.zeroDivisorFallback.length)/4;for(let e=0;e<t[0].length;e++)for(let a=0;a<t[0][e].length;a++)t[0][e][a]=this.float32WasmMemory[s+a]}return!0}})}();
//# sourceMappingURL=worklets.23c145bb95d0836f1615.js.map