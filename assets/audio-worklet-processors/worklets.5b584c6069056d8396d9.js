!function(e){var t={};function a(s){if(t[s])return t[s].exports;var r=t[s]={i:s,l:!1,exports:{}};return e[s].call(r.exports,r,r.exports,a),r.l=!0,r.exports}a.m=e,a.c=t,a.d=function(e,t,s){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(a.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(s,r,function(t){return e[t]}.bind(null,r));return s},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="./assets/audio-worklet-processors",a(a.s=1)}([function(e,t,a){"use strict";a.d(t,"a",function(){return s});const s=(e,t,a)=>s=>{const r=((e,t)=>a=>a<e?e:a>t?t:a)(t,a);return e.length>1?r(e[s]):r(e[0])}},function(e,t,a){a(2),a(5),a(3),a(4),e.exports=a(6)},function(e,t,a){"use strict";a.r(t);var s=a(0);const r=(e,t,a)=>{const s=Math.random()*(a-t)+t;return Math.random()>.5?e+s>1?e-s:e+s:e-s<-1?e+s:e-s};registerProcessor("noise",class extends AudioWorkletProcessor{static get parameterDescriptors(){return[{name:"stepMax",defaultValue:1,minValue:0,maxValue:1,automationRate:"a-rate"},{name:"stepMin",defaultValue:0,minValue:0,maxValue:1,automationRate:"a-rate"},{name:"sampleHold",defaultValue:1,minValue:0,maxValue:1e6,automationRate:"a-rate"},{name:"nextValueTrigger",defaultValue:0,automationRate:"a-rate"}]}constructor(){super(),this.previousValue=.1,this.samplesHeld=0,this.isTriggerValueHigh=!1,this.port.onmessage=this.handleMessage.bind(this),this.manualTriggerOn=!1,this.triggerChangeMessage={type:"trigger-change",value:!1}}handleMessage(e){e.data&&"manual-trigger"===e.data.type&&(this.manualTriggerOn=e.data.value)}process(e,t,a){let i=t[0];this.getStepMin=Object(s.a)(a.stepMin,0,1),this.getStepMax=Object(s.a)(a.stepMax,0,1),this.getSampleHold=Object(s.a)(a.sampleHold,0,1e6),this.getNextValueTrigger=this.manualTriggerOn?()=>1e9:Object(s.a)(a.nextValueTrigger,0,1);for(let e=0;e<i[0].length;++e,++this.samplesHeld){this.samplesHeld<0&&(this.samplesHeld=0);const t=this.getSampleHold(e);t>=1&&this.samplesHeld>=t&&(this.samplesHeld-=t,this.previousValue=r(this.previousValue,this.getStepMin(e),this.getStepMax(e)));const a=this.getNextValueTrigger(e);this.isTriggerValueHigh!=a>0&&(this.triggerChangeMessage.value=a>0,this.port.postMessage(this.triggerChangeMessage)),!this.isTriggerValueHigh&&a>0&&(this.previousValue=r(this.previousValue,this.getStepMin(e),this.getStepMax(e))),this.isTriggerValueHigh=a>0;for(let t=0;t<i.length;++t)i[t][e]=this.previousValue}return!0}})},function(e,t,a){"use strict";a.r(t);var s=a(0);registerProcessor("inverse-gain",class extends AudioWorkletProcessor{static get parameterDescriptors(){return[{name:"divisor",defaultValue:10,automationRate:"a-rate"},{name:"zeroDivisorFallback",defaultValue:0,automationRate:"a-rate"}]}process(e,t,a){let r=e[0],i=t[0];this.getDivisor=Object(s.a)(a.divisor,-1e9,1e9),this.getZeroDivisorOutput=Object(s.a)(a.zeroDivisorFallback,-1e9,1e9);for(let e=0;e<r.length;e++){const t=r[e],a=i[e];for(let e=0;e<t.length;e++){const s=t[e],r=this.getDivisor(e);a[e]=0===r?this.getZeroDivisorOutput(e):s/r}}return!0}})},function(e,t,a){"use strict";a.r(t);var s=a(0);const r=(e,t,{attackTime:a,attackValue:s,holdTime:r,decayTime:i,sustainValue:n,releaseTime:o},g,l,u,c)=>{const h=1/t;let m,d,p=0,T=void 0,k=void 0;return"rest"===l&&(u<=0?(m="rest",d=g+h,k=0):h<a?(m="attack",p=(d=h)/a,T=0,k=e(0,0,s,a,d)):h-a<r?(m="hold",p=(d=h-a)/r,k=s):h-a-r<i?(m="decay",p=(d=h-a-r)/i,k=e(s,0,n,i,d)):(m="sustain",d=h-a-r-i,k=n)),"attack"===l&&(u<=0?h<o?(m="release",p=(d=h)/o,T=g<a?e(c||0,0,s,a,g):g-a<r?s:g-a-r<i?e(s,0,n,i,g-a-r):n,k=e(T,0,0,o,d)):(m="rest",d=h-o,k=0):g+h<a?(m="attack",p=(d=g+h)/a,T=c,k=e(c||0,0,s,a,d)):g+h-a<r?(m="hold",p=(d=g+h-a)/r,k=s):g+h-a-r<i?(m="decay",p=(d=g+h-a-r)/i,k=e(s,0,n,i,d)):(m="sustain",d=g+h-a-r-i,k=n)),"hold"===l&&(u<=0?h<o?(m="release",p=(d=h)/o,T=g<r?s:g-r<i?e(s,0,n,i,g-r):n,k=e(T,0,0,o,d)):(m="rest",d=h-o,k=0):g+h<r?(m="hold",p=(d=g+h)/r,k=s):g+h-r<i?(m="decay",p=(d=g+h-r)/i,k=e(s,0,n,i,d)):(m="sustain",d=g+h-r-i,k=n)),"decay"===l&&(u<=0?h<o?(m="release",p=(d=h)/o,T=g<i?e(s,0,n,i,g):n,k=e(T,0,0,o,d)):(m="rest",d=h-o,k=0):g+h<i?(m="decay",p=(d=g+h)/i,k=e(s,0,n,i,d)):(m="sustain",d=g+h-i,k=n)),"sustain"===l&&(u<=0?h<o?(m="release",p=(d=h)/o,k=e(T=n,0,0,o,d)):(m="rest",d=h-o,k=0):(m="sustain",d=g+h,k=n)),"release"===l&&(u<=0?g+h<o?(m="release",p=(d=g+h)/o,k=e(T=c,0,0,o,d)):(m="rest",d=g+h-o,k=0):h<a?(m="attack",p=(d=h)/a,T=e(c||0,0,0,o,g),k=e(T,0,s,a,d)):h-a<r?(m="hold",p=(d=h-a)/r,k=s):h-a-r<i?(m="decay",p=(d=h-a-r)/i,k=e(s,0,n,i,d)):(m="sustain",d=h-a-r-i,k=n)),{stage:m,stageProgress:p,secondsSinceStateTransition:d,valueOnTriggerChange:T,outputValue:k}};function i(e,t,a,s,r){if(t>=s&&(t=s),r>=s)return a;if(r<=t)return e;return e+(r-t)*((a-e)/(s-t))}registerProcessor("envelope-generator",class extends AudioWorkletProcessor{static get parameterDescriptors(){return[{name:"trigger",defaultValue:0,automationRate:"a-rate"},{name:"attackValue",defaultValue:1,minValue:0,maxValue:1,automationRate:"a-rate"},{name:"attackTime",defaultValue:.001,minValue:0,maxValue:10,automationRate:"a-rate"},{name:"holdTime",minValue:0,defaultValue:.0625,maxValue:10,automationRate:"a-rate"},{name:"decayTime",defaultValue:.125,minValue:0,maxValue:10,automationRate:"a-rate"},{name:"sustainValue",defaultValue:.25,minValue:0,maxValue:1,automationRate:"a-rate"},{name:"releaseTime",defaultValue:.25,minValue:0,maxValue:10}]}constructor(e){super(e),this.stages=["rest","attack","hold","decay","sustain","release"],this.stage=this.stages[0],this.stageProgress=0,this.secondsSinceStateTransition=0,this.port.onmessage=this.handleMessage.bind(this),this.state={attackTime:.001,attackValue:1,holdTime:.0625,decayTime:.125,sustainValue:.25,releaseTime:.25},this.sampleRate=e.sampleRate||44100,this.outputValue=0,this.valueOnTriggerChange=void 0,this.manualTriggerOn=!1,this.previousTriggerValue=0,this.stateMessage={type:"state",state:{stage:this.stage,stageProgress:this.stageProgress,outputValue:this.outputValue}},this.triggerChangeMessage={type:"trigger-change",value:!1}}handleMessage(e){e.data&&"getState"===e.data.type&&(this.stateMessage.state.stage=this.stage,this.stateMessage.state.stageProgress=this.stageProgress,this.stateMessage.state.outputValue=this.outputValue,this.port.postMessage(this.stateMessage)),e.data&&"manual-trigger"===e.data.type&&(this.manualTriggerOn=e.data.value)}process(e,t,a){let n=t[0];this.getTriggerValue=this.manualTriggerOn?()=>1e9:Object(s.a)(a.trigger,-1e9,1e9),this.getAttackTime=Object(s.a)(a.attackTime,0,10),this.getAttackValue=Object(s.a)(a.attackValue,0,1),this.getHoldTime=Object(s.a)(a.holdTime,0,10),this.getDecayTime=Object(s.a)(a.decayTime,0,10),this.getSustainValue=Object(s.a)(a.sustainValue,0,1),this.getReleaseTime=Object(s.a)(a.releaseTime,0,10);for(let e=0;e<n[0].length;e++){this.state.attackTime=this.getAttackTime(e),this.state.attackValue=this.getAttackValue(e),this.state.holdTime=this.getHoldTime(e),this.state.decayTime=this.getDecayTime(e),this.state.sustainValue=this.getSustainValue(e),this.state.releaseTime=this.getReleaseTime(e);const t=this.getTriggerValue(e);t>0!=this.previousTriggerValue>0&&(this.triggerChangeMessage.value=t>0,this.port.postMessage(this.triggerChangeMessage));const a=r(i,this.sampleRate,this.state,this.secondsSinceStateTransition,this.stage,t,this.valueOnTriggerChange);this.stage=a.stage,this.stageProgress=a.stageProgress,this.secondsSinceStateTransition=a.secondsSinceStateTransition,this.outputValue=a.outputValue,this.valueOnTriggerChange=a.valueOnTriggerChange,this.previousTriggerValue=t;for(let t=0;t<n.length;t++){n[t][e]=this.outputValue}}return!0}})},function(e,t,a){"use strict";function s(e,t,a){t>32&&(t=32),t<1&&(t=1),"trve"===a&&(t=Math.floor(t));let s=2**t;"quantize-evenly"===a&&(s=Math.floor(s));const r=2/s,i=1-r;return e>=i?i:e<=-1?-1:Math.floor((1+e)/r)*r-1}a.r(t);var r=a(0);registerProcessor("bit-crusher-fixed-point",class extends AudioWorkletProcessor{static get parameterDescriptors(){return[{name:"bitDepth",defaultValue:8,minValue:1,maxValue:32,automationRate:"a-rate"}]}constructor(){super(),this.fractionalBitDepthMode="quantize-evenly",this.port.onmessage=this.handleMessage.bind(this)}handleMessage(e){e.data&&"change-fractional-bit-depth-mode"===e.data.type&&(this.fractionalBitDepthMode=e.data.newMode)}process(e,t,a){let i=e[0],n=t[0];this.getBitDepth=Object(r.a)(a.bitDepth,1,32);for(let e=0;e<i.length;e++){const t=i[e],a=n[e];for(let e=0;e<t.length;e++){const r=t[e];a[e]=s(r,this.getBitDepth(e),this.fractionalBitDepthMode)}}return!0}})},function(e,t,a){"use strict";a.r(t);const s={attack:1,high:2,release:3,low:4},r={tick:1,tock:0},i={reset:1,keepGoing:0};function n(e,{attackAfterTicks:t,releaseAfterTocks:a},n,o){return o===i.reset&&(e.stage=r.tock,e.tocksPast=0,e.ticksPast=t-1),n===s.attack&&e.stage===r.tock&&(e.ticksPast++,e.ticksPast>=t&&(e.stage=r.tick,e.ticksPast-=t)),n===s.release&&e.stage===r.tick&&(e.tocksPast++,e.tocksPast>=a&&(e.stage=r.tock,e.tocksPast-=a)),e}var o=a(0);registerProcessor("clock-divider",class extends AudioWorkletProcessor{static get parameterDescriptors(){return[{name:"clockTrigger",defaultValue:0,automationRate:"a-rate"},{name:"resetTrigger",defaultValue:0,automationRate:"a-rate"},{name:"attackAfterTicks",defaultValue:1,minValue:1,maxValue:1e9,automationRate:"a-rate"},{name:"releaseAfterTocks",defaultValue:1,minValue:1,maxValue:1e9,automationRate:"a-rate"}]}constructor(e){super(e),this.state={stage:r.tock,ticksPast:0,tocksPast:0},this.userParams={attackAfterTicks:0,releaseAfterTocks:0},this.initialReset=!0,this.port.onmessage=this.handleMessage.bind(this),this.manualClockTriggerOn=!1,this.manualResetTriggerOn=!1,this.clockTriggerOn=!1,this.resetTriggerOn=!1,this.clockTriggerChangeMessage={type:"clock-trigger-change",value:!1},this.resetTriggerChangeMessage={type:"reset-trigger-change",value:!1}}handleMessage(e){e.data&&"manual-clock-trigger"===e.data.type&&(this.manualClockTriggerOn=e.data.value),e.data&&"manual-reset-trigger"===e.data.type&&(this.manualResetTriggerOn=e.data.value)}process(e,t,a){const r=t[0];this.getClockTriggerValue=this.manualClockTriggerOn?()=>1e9:Object(o.a)(a.clockTrigger,-1e9,1e9),this.getResetTriggerValue=this.manualResetTriggerOn||this.initialReset?()=>(this.initialReset=!1,1e9):Object(o.a)(a.resetTrigger,-1e9,1e9),this.getAttackAfterTicks=Object(o.a)(a.attackAfterTicks,1,1e9),this.getReleaseAfterTocks=Object(o.a)(a.releaseAfterTocks,1,1e9);for(let e=0;e<r[0].length;e++){const t=this.getClockTriggerValue(e),a=this.getResetTriggerValue(e);let o;t>0?(this.clockTriggerOn?o=s.high:(o=s.attack,this.clockTriggerChangeMessage.value=!0,this.port.postMessage(this.clockTriggerChangeMessage)),this.clockTriggerOn=!0):(this.clockTriggerOn?(o=s.release,this.clockTriggerChangeMessage.value=!1,this.port.postMessage(this.clockTriggerChangeMessage)):o=s.low,this.clockTriggerOn=!1);let g=i.keepGoing;this.resetTriggerOn!==a>0&&(this.resetTriggerChangeMessage.value=a>0,this.port.postMessage(this.resetTriggerChangeMessage)),a>0&&!this.resetTriggerOn&&(g=i.reset),this.resetTriggerOn=a>0,this.userParams.attackAfterTicks=this.getAttackAfterTicks(e),this.userParams.releaseAfterTocks=this.getReleaseAfterTocks(e),n(this.state,this.userParams,o,g);for(let t=0;t<r.length;t++){r[t][e]=this.state.stage}}return!0}})}]);
//# sourceMappingURL=worklets.5b584c6069056d8396d9.js.map