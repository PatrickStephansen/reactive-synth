!function(e){var t={};function a(r){if(t[r])return t[r].exports;var s=t[r]={i:r,l:!1,exports:{}};return e[r].call(s.exports,s,s.exports,a),s.l=!0,s.exports}a.m=e,a.c=t,a.d=function(e,t,r){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(a.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)a.d(r,s,function(t){return e[t]}.bind(null,s));return r},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="./assets/audio-worklet-processors",a(a.s=3)}([function(e,t,a){"use strict";a.d(t,"a",function(){return s});var r=a(1);const s=(e,t,a)=>s=>{const i=Object(r.a)(t,a);return e.length>1?i(e[s]):i(e[0])}},function(e,t,a){"use strict";function r(e){return null!=e&&"object"==typeof e&&!0===e["@@functional/placeholder"]}function s(e){return function t(a){return 0===arguments.length||r(a)?t:e.apply(this,arguments)}}function i(e){return function t(a,i){switch(arguments.length){case 0:return t;case 1:return r(a)?t:s(function(t){return e(a,t)});default:return r(a)&&r(i)?t:r(a)?s(function(t){return e(t,i)}):r(i)?s(function(t){return e(a,t)}):e(a,i)}}}function n(e){return function t(a,n,o){switch(arguments.length){case 0:return t;case 1:return r(a)?t:i(function(t,r){return e(a,t,r)});case 2:return r(a)&&r(n)?t:r(a)?i(function(t,a){return e(t,n,a)}):r(n)?i(function(t,r){return e(a,t,r)}):s(function(t){return e(a,n,t)});default:return r(a)&&r(n)&&r(o)?t:r(a)&&r(n)?i(function(t,a){return e(t,a,o)}):r(a)&&r(o)?i(function(t,a){return e(t,n,a)}):r(n)&&r(o)?i(function(t,r){return e(a,t,r)}):r(a)?s(function(t){return e(t,n,o)}):r(n)?s(function(t){return e(a,t,o)}):r(o)?s(function(t){return e(a,n,t)}):e(a,n,o)}}}var o=n(function(e,t,a){if(e>t)throw new Error("min must not be greater than max in clamp(min, max, value)");return a<e?e:a>t?t:a});t.a=o},,function(e,t,a){a(4),a(7),a(5),a(6),e.exports=a(8)},function(e,t,a){"use strict";a.r(t);var r=a(1);const s=Object(r.a)(0,1),i=Object(r.a)(0,1e6),n=Object(r.a)(0,1),o=(e,t,a)=>{const r=Math.random()*(a-t)+t;return Math.random()>.5?e+r>1?e-r:e+r:e-r<-1?e+r:e-r};registerProcessor("noise",class extends AudioWorkletProcessor{static get parameterDescriptors(){return[{name:"stepMax",defaultValue:1,minValue:0,maxValue:1,automationRate:"a-rate"},{name:"stepMin",defaultValue:0,minValue:0,maxValue:1,automationRate:"a-rate"},{name:"sampleHold",defaultValue:1,minValue:0,maxValue:1e6,automationRate:"a-rate"},{name:"nextValueTrigger",defaultValue:0,automationRate:"a-rate"}]}constructor(){super(),this.previousValue=.1,this.samplesHeld=0,this.isTriggerValueHigh=!1,this.port.onmessage=this.handleMessage.bind(this),this.manualTriggerOn=!1}handleMessage(e){e.data&&"manual-trigger"===e.data.type&&(this.manualTriggerOn=e.data.value)}process(e,t,a){let r=t[0],u=a.stepMin,l=u.length>1?e=>s(u[e]):()=>s(u[0]),c=a.stepMax,g=c.length>1?e=>s(c[e]):()=>s(c[0]),h=a.sampleHold,d=h.length>1?e=>i(h[e]):()=>i(h[0]),m=a.nextValueTrigger,p=m.length,f=this.manualTriggerOn?()=>1e9:p>1?e=>n(m[e]):()=>n(m[0]);for(let e=0;e<r[0].length;++e,++this.samplesHeld){this.samplesHeld<0&&(this.samplesHeld=0);const t=d(e);t>=1&&this.samplesHeld>=t&&(this.samplesHeld-=t,this.previousValue=o(this.previousValue,l(e),g(e)));const a=f(e);this.isTriggerValueHigh!=a>0&&this.port.postMessage({type:"trigger-change",value:a>0}),!this.isTriggerValueHigh&&a>0&&(this.previousValue=o(this.previousValue,l(e),g(e))),this.isTriggerValueHigh=a>0;for(let t=0;t<r.length;++t)r[t][e]=this.previousValue}return!0}})},function(e,t){registerProcessor("inverse-gain",class extends AudioWorkletProcessor{static get parameterDescriptors(){return[{name:"divisor",defaultValue:10,automationRate:"a-rate"},{name:"zeroDivisorFallback",defaultValue:0,automationRate:"a-rate"}]}process(e,t,a){let r=e[0],s=t[0],i=a.divisor,n=i.length>1?e=>i[e]:()=>i[0],o=a.zeroDivisorFallback.length>1?e=>a.zeroDivisorFallback[e]:()=>a.zeroDivisorFallback[0];for(let e=0;e<r.length;e++){const t=r[e],a=s[e];for(let e=0;e<t.length;e++){const r=t[e],s=n(e);a[e]=0===s?o(e):r/s}}return!0}})},function(e,t,a){"use strict";a.r(t);var r=a(0);const s=(e,t,{attackTime:a,attackValue:r,holdTime:s,decayTime:i,sustainValue:n,releaseTime:o},u,l,c,g)=>{const h=1/t;let d,m,p=0,f=void 0,T=void 0;return"rest"===l&&(c<=0?(d="rest",m=u+h,T=0):h<a?(d="attack",p=(m=h)/a,f=0,T=e(0,0,r,a,m)):h-a<s?(d="hold",p=(m=h-a)/s,T=r):h-a-s<i?(d="decay",p=(m=h-a-s)/i,T=e(r,0,n,i,m)):(d="sustain",m=h-a-s-i,T=n)),"attack"===l&&(c<=0?h<o?(d="release",p=(m=h)/o,f=u<a?e(g||0,0,r,a,u):u-a<s?r:u-a-s<i?e(r,0,n,i,u-a-s):n,T=e(f,0,0,o,m)):(d="rest",m=h-o,T=0):u+h<a?(d="attack",p=(m=u+h)/a,f=g,T=e(g||0,0,r,a,m)):u+h-a<s?(d="hold",p=(m=u+h-a)/s,T=r):u+h-a-s<i?(d="decay",p=(m=u+h-a-s)/i,T=e(r,0,n,i,m)):(d="sustain",m=u+h-a-s-i,T=n)),"hold"===l&&(c<=0?h<o?(d="release",p=(m=h)/o,f=u<s?r:u-s<i?e(r,0,n,i,u-s):n,T=e(f,0,0,o,m)):(d="rest",m=h-o,T=0):u+h<s?(d="hold",p=(m=u+h)/s,T=r):u+h-s<i?(d="decay",p=(m=u+h-s)/i,T=e(r,0,n,i,m)):(d="sustain",m=u+h-s-i,T=n)),"decay"===l&&(c<=0?h<o?(d="release",p=(m=h)/o,f=u<i?e(r,0,n,i,u):n,T=e(f,0,0,o,m)):(d="rest",m=h-o,T=0):u+h<i?(d="decay",p=(m=u+h)/i,T=e(r,0,n,i,m)):(d="sustain",m=u+h-i,T=n)),"sustain"===l&&(c<=0?h<o?(d="release",p=(m=h)/o,T=e(f=n,0,0,o,m)):(d="rest",m=h-o,T=0):(d="sustain",m=u+h,T=n)),"release"===l&&(c<=0?u+h<o?(d="release",p=(m=u+h)/o,T=e(f=g,0,0,o,m)):(d="rest",m=u+h-o,T=0):h<a?(d="attack",p=(m=h)/a,f=e(g||0,0,0,o,u),T=e(f,0,r,a,m)):h-a<s?(d="hold",p=(m=h-a)/s,T=r):h-a-s<i?(d="decay",p=(m=h-a-s)/i,T=e(r,0,n,i,m)):(d="sustain",m=h-a-s-i,T=n)),{stage:d,stageProgress:p,secondsSinceStateTransition:m,valueOnTriggerChange:f,outputValue:T}};function i(e,t,a,r,s){if(t>=r&&(t=r),s>=r)return a;if(s<=t)return e;return e+(s-t)*((a-e)/(r-t))}registerProcessor("envelope-generator",class extends AudioWorkletProcessor{static get parameterDescriptors(){return[{name:"trigger",defaultValue:0,automationRate:"a-rate"},{name:"attackValue",defaultValue:1,minValue:0,maxValue:1,automationRate:"a-rate"},{name:"attackTime",defaultValue:.001,minValue:0,maxValue:10,automationRate:"a-rate"},{name:"holdTime",minValue:0,defaultValue:.0625,maxValue:10,automationRate:"a-rate"},{name:"decayTime",defaultValue:.125,minValue:0,maxValue:10,automationRate:"a-rate"},{name:"sustainValue",defaultValue:.25,minValue:0,maxValue:1,automationRate:"a-rate"},{name:"releaseTime",defaultValue:.25,minValue:0,maxValue:10}]}constructor(e){super(e),this.stages=["rest","attack","hold","decay","sustain","release"],this.stage=this.stages[0],this.stageProgress=0,this.secondsSinceStateTransition=0,this.port.onmessage=this.handleMessage.bind(this),this.state={attackTime:.001,attackValue:1,holdTime:.0625,decayTime:.125,sustainValue:.25,releaseTime:.25},this.sampleRate=e.sampleRate||44100,this.outputValue,this.valueOnTriggerChange=void 0,this.manualTriggerOn=!1,this.previousTriggerValue=0}handleMessage(e){e.data&&"getState"===e.data.type&&this.port.postMessage({type:"state",state:{stage:this.stage,stageProgress:this.stageProgress,outputValue:this.outputValue}}),e.data&&"manual-trigger"===e.data.type&&(this.manualTriggerOn=e.data.value)}process(e,t,a){let n=t[0];const o=this.manualTriggerOn?()=>1e9:Object(r.a)(a.trigger,-1e9,1e9),u=Object(r.a)(a.attackTime,0,10),l=Object(r.a)(a.attackValue,0,1),c=Object(r.a)(a.holdTime,0,10),g=Object(r.a)(a.decayTime,0,10),h=Object(r.a)(a.sustainValue,0,1),d=Object(r.a)(a.releaseTime,0,10);for(let e=0;e<n[0].length;e++){this.state={attackTime:u(e),attackValue:l(e),holdTime:c(e),decayTime:g(e),sustainValue:h(e),releaseTime:d(e)};const t=o(e);t>0!=this.previousTriggerValue>0&&this.port.postMessage({type:"trigger-change",value:t>0});const a=s(i,this.sampleRate,this.state,this.secondsSinceStateTransition,this.stage,t,this.valueOnTriggerChange);this.stage=a.stage,this.stageProgress=a.stageProgress,this.secondsSinceStateTransition=a.secondsSinceStateTransition,this.outputValue=a.outputValue,this.valueOnTriggerChange=a.valueOnTriggerChange,this.previousTriggerValue=t;for(let t=0;t<n.length;t++){n[t][e]=this.outputValue}}return!0}})},function(e,t,a){"use strict";function r(e,t,a){t>32&&(t=32),t<1&&(t=1),"trve"===a&&(t=Math.floor(t));let r=2**t;"quantize-evenly"===a&&(r=Math.floor(r));const s=2/r,i=1-s;return e>=i?i:e<=-1?-1:Math.floor((1+e)/s)*s-1}a.r(t),registerProcessor("bit-crusher-fixed-point",class extends AudioWorkletProcessor{static get parameterDescriptors(){return[{name:"bitDepth",defaultValue:8,minValue:1,maxValue:32,automationRate:"a-rate"}]}constructor(){super(),this.fractionalBitDepthMode="quantize-evenly",this.port.onmessage=this.handleMessage.bind(this)}handleMessage(e){e.data&&"change-fractional-bit-depth-mode"===e.data.type&&(this.fractionalBitDepthMode=e.data.newMode)}process(e,t,a){let s=e[0],i=t[0],n=a.bitDepth,o=n.length>1?e=>n[e]:()=>n[0];for(let e=0;e<s.length;e++){const t=s[e],a=i[e];for(let e=0;e<t.length;e++){const s=t[e];a[e]=r(s,o(e),this.fractionalBitDepthMode)}}return!0}})},function(e,t,a){"use strict";a.r(t);const r={attack:1,high:2,release:3,low:4},s={tick:1,tock:0},i={reset:1,keepGoing:0};function n({stage:e,ticksPast:t,tocksPast:a},{attackAfterTicks:n,releaseAfterTocks:o},u,l){return l===i.reset&&(e=s.tock,a=0,t=n-1),u===r.attack&&e===s.tock&&++t>=n&&(e=s.tick,t-=n),u===r.release&&e===s.tick&&++a>=o&&(e=s.tock,a-=o),{stage:e,ticksPast:t,tocksPast:a}}var o=a(0);registerProcessor("clock-divider",class extends AudioWorkletProcessor{static get parameterDescriptors(){return[{name:"clockTrigger",defaultValue:0,automationRate:"a-rate"},{name:"resetTrigger",defaultValue:0,automationRate:"a-rate"},{name:"attackAfterTicks",defaultValue:1,minValue:1,maxValue:1e9,automationRate:"a-rate"},{name:"releaseAfterTocks",defaultValue:1,minValue:1,maxValue:1e9,automationRate:"a-rate"}]}constructor(e){super(e),this.state={stage:s.tock,ticksPast:0,tocksPast:0},this.initialReset=!0,this.port.onmessage=this.handleMessage.bind(this),this.manualClockTriggerOn=!1,this.manualResetTriggerOn=!1,this.clockTriggerOn=!1,this.resetTriggerOn=!1}handleMessage(e){e.data&&"manual-clock-trigger"===e.data.type&&(this.manualClockTriggerOn=e.data.value),e.data&&"manual-reset-trigger"===e.data.type&&(this.manualResetTriggerOn=e.data.value)}process(e,t,a){const s=t[0],u=this.manualClockTriggerOn?()=>1e9:Object(o.a)(a.clockTrigger,-1e9,1e9),l=this.manualResetTriggerOn||this.initialReset?()=>(this.initialReset=!1,1e9):Object(o.a)(a.resetTrigger,-1e9,1e9),c=Object(o.a)(a.attackAfterTicks,1,1e9),g=Object(o.a)(a.releaseAfterTocks,1,1e9);for(let e=0;e<s[0].length;e++){const t=u(e),a=l(e);let o;t>0?(this.clockTriggerOn?o=r.high:(o=r.attack,this.port.postMessage({type:"clock-trigger-change",value:!0})),this.clockTriggerOn=!0):(this.clockTriggerOn?(o=r.release,this.port.postMessage({type:"clock-trigger-change",value:!1})):o=r.low,this.clockTriggerOn=!1);let h=i.keepGoing;this.resetTriggerOn!==a>0&&this.port.postMessage({type:"reset-trigger-change",value:a>0}),a>0&&!this.resetTriggerOn&&(h=i.reset),this.resetTriggerOn=a>0,this.state=n(this.state,{attackAfterTicks:c(e),releaseAfterTocks:g(e)},o,h);for(let t=0;t<s.length;t++){s[t][e]=this.state.stage}}return!0}})}]);