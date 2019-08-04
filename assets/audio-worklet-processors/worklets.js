!function(e){var t={};function a(r){if(t[r])return t[r].exports;var s=t[r]={i:r,l:!1,exports:{}};return e[r].call(s.exports,s,s.exports,a),s.l=!0,s.exports}a.m=e,a.c=t,a.d=function(e,t,r){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(a.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)a.d(r,s,function(t){return e[t]}.bind(null,s));return r},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="./assets/audio-worklet-processors",a(a.s=2)}([function(e,t,a){"use strict";function r(e){return null!=e&&"object"==typeof e&&!0===e["@@functional/placeholder"]}function s(e){return function t(a){return 0===arguments.length||r(a)?t:e.apply(this,arguments)}}function n(e){return function t(a,n){switch(arguments.length){case 0:return t;case 1:return r(a)?t:s(function(t){return e(a,t)});default:return r(a)&&r(n)?t:r(a)?s(function(t){return e(t,n)}):r(n)?s(function(t){return e(a,t)}):e(a,n)}}}function i(e){return function t(a,i,u){switch(arguments.length){case 0:return t;case 1:return r(a)?t:n(function(t,r){return e(a,t,r)});case 2:return r(a)&&r(i)?t:r(a)?n(function(t,a){return e(t,i,a)}):r(i)?n(function(t,r){return e(a,t,r)}):s(function(t){return e(a,i,t)});default:return r(a)&&r(i)&&r(u)?t:r(a)&&r(i)?n(function(t,a){return e(t,a,u)}):r(a)&&r(u)?n(function(t,a){return e(t,i,a)}):r(i)&&r(u)?n(function(t,r){return e(a,t,r)}):r(a)?s(function(t){return e(t,i,u)}):r(i)?s(function(t){return e(a,t,u)}):r(u)?s(function(t){return e(a,i,t)}):e(a,i,u)}}}var u=i(function(e,t,a){if(e>t)throw new Error("min must not be greater than max in clamp(min, max, value)");return a<e?e:a>t?t:a});t.a=u},,function(e,t,a){a(3),a(6),a(4),e.exports=a(5)},function(e,t,a){"use strict";a.r(t);var r=a(0);const s=Object(r.a)(0,1),n=Object(r.a)(0,1e6),i=Object(r.a)(0,1),u=(e,t,a)=>{const r=Math.random()*(a-t)+t;return Math.random()>.5?e+r>1?e-r:e+r:e-r<-1?e+r:e-r};registerProcessor("noise",class extends AudioWorkletProcessor{static get parameterDescriptors(){return[{name:"stepMax",defaultValue:1,minValue:0,maxValue:1,automationRate:"a-rate"},{name:"stepMin",defaultValue:0,minValue:0,maxValue:1,automationRate:"a-rate"},{name:"sampleHold",defaultValue:1,minValue:0,maxValue:1e6,automationRate:"a-rate"},{name:"nextValueTrigger",defaultValue:0,automationRate:"a-rate"}]}constructor(){super(),this.previousValue=.1,this.samplesHeld=0,this.isTriggerValueHigh=!1,this.port.onmessage=this.handleMessage.bind(this),this.manualTriggerOn=!1}handleMessage(e){e.data&&"manual-trigger"===e.data.type&&(this.manualTriggerOn=e.data.value)}process(e,t,a){let r=t[0],o=a.stepMin,l=o.length>1?e=>s(o[e]):()=>s(o[0]),c=a.stepMax,g=c.length>1?e=>s(c[e]):()=>s(c[0]),h=a.sampleHold,d=h.length>1?e=>n(h[e]):()=>n(h[0]),m=a.nextValueTrigger,f=m.length,p=this.manualTriggerOn?()=>1e9:f>1?e=>i(m[e]):()=>i(m[0]);for(let e=0;e<r[0].length;++e,++this.samplesHeld){this.samplesHeld<0&&(this.samplesHeld=0);const t=d(e);t>=1&&this.samplesHeld>=t&&(this.samplesHeld-=t,this.previousValue=u(this.previousValue,l(e),g(e)));const a=p(e);this.isTriggerValueHigh!=a>0&&this.port.postMessage({type:"trigger-change",value:a>0}),!this.isTriggerValueHigh&&a>0&&(this.previousValue=u(this.previousValue,l(e),g(e))),this.isTriggerValueHigh=a>0;for(let t=0;t<r.length;++t)r[t][e]=this.previousValue}return!0}})},function(e,t){registerProcessor("inverse-gain",class extends AudioWorkletProcessor{static get parameterDescriptors(){return[{name:"divisor",defaultValue:10,automationRate:"a-rate"},{name:"zeroDivisorFallback",defaultValue:0,automationRate:"a-rate"}]}process(e,t,a){let r=e[0],s=t[0],n=a.divisor,i=n.length>1?e=>n[e]:()=>n[0],u=a.zeroDivisorFallback.length>1?e=>a.zeroDivisorFallback[e]:()=>a.zeroDivisorFallback[0];for(let e=0;e<r.length;e++){const t=r[e],a=s[e];for(let e=0;e<t.length;e++){const r=t[e],s=i(e);a[e]=0===s?u(e):r/s}}return!0}})},function(e,t,a){"use strict";a.r(t);var r=a(0);const s=(e,t,a)=>s=>{const n=Object(r.a)(t,a);return e.length>1?n(e[s]):n(e[0])};function n(e,t,a,r,s){if(t>=r&&(t=r),s>=r)return a;if(s<=t)return e;return e+(s-t)*((a-e)/(r-t))}const i=(e,{attackTime:t,attackValue:a,holdTime:r,decayTime:s,sustainValue:i,releaseTime:u},o,l,c,g)=>{const h=1/e;let d,m,f=0,p=void 0,V=void 0;return"rest"===l&&(c<=0?(d="rest",m=o+h,V=0):h<t?(d="attack",f=(m=h)/t,p=0,V=n(0,0,a,t,m)):h-t<r?(d="hold",f=(m=h-t)/r,V=a):h-t-r<s?(d="decay",f=(m=h-t-r)/s,V=n(a,0,i,s,m)):(d="sustain",m=h-t-r-s,V=i)),"attack"===l&&(c<=0?h<u?(d="release",f=(m=h)/u,p=o<t?n(g||0,0,a,t,o):o-t<r?a:o-t-r<s?n(a,0,i,s,o-t-r):i,V=n(p,0,0,u,m)):(d="rest",m=h-u,V=0):o+h<t?(d="attack",f=(m=o+h)/t,p=g,V=n(g||0,0,a,t,m)):o+h-t<r?(d="hold",f=(m=o+h-t)/r,V=a):o+h-t-r<s?(d="decay",f=(m=o+h-t-r)/s,V=n(a,0,i,s,m)):(d="sustain",m=o+h-t-r-s,V=i)),"hold"===l&&(c<=0?h<u?(d="release",f=(m=h)/u,p=o<r?a:o-r<s?n(a,0,i,s,o-r):i,V=n(p,0,0,u,m)):(d="rest",m=h-u,V=0):o+h<r?(d="hold",f=(m=o+h)/r,V=a):o+h-r<s?(d="decay",f=(m=o+h-r)/s,V=n(a,0,i,s,m)):(d="sustain",m=o+h-r-s,V=i)),"decay"===l&&(c<=0?h<u?(d="release",f=(m=h)/u,p=o<s?n(a,0,i,s,o):i,V=n(p,0,0,u,m)):(d="rest",m=h-u,V=0):o+h<s?(d="decay",f=(m=o+h)/s,V=n(a,0,i,s,m)):(d="sustain",m=o+h-s,V=i)),"sustain"===l&&(c<=0?h<u?(d="release",f=(m=h)/u,V=n(p=i,0,0,u,m)):(d="rest",m=h-u,V=0):(d="sustain",m=o+h,V=i)),"release"===l&&(c<=0?o+h<u?(d="release",f=(m=o+h)/u,V=n(p=g,0,0,u,m)):(d="rest",m=o+h-u,V=0):h<t?(d="attack",f=(m=h)/t,p=n(g||0,0,0,u,o),V=n(p,0,a,t,m)):h-t<r?(d="hold",f=(m=h-t)/r,V=a):h-t-r<s?(d="decay",f=(m=h-t-r)/s,V=n(a,0,i,s,m)):(d="sustain",m=h-t-r-s,V=i)),{stage:d,stageProgress:f,secondsSinceStateTransition:m,valueOnTriggerChange:p,outputValue:V}};registerProcessor("envelope-generator",class extends AudioWorkletProcessor{static get parameterDescriptors(){return[{name:"trigger",defaultValue:0,automationRate:"a-rate"},{name:"attackValue",defaultValue:1,minValue:0,maxValue:1,automationRate:"a-rate"},{name:"attackTime",defaultValue:.001,minValue:0,maxValue:10,automationRate:"a-rate"},{name:"holdTime",minValue:0,defaultValue:.0625,maxValue:10,automationRate:"a-rate"},{name:"decayTime",defaultValue:.125,minValue:0,maxValue:10,automationRate:"a-rate"},{name:"sustainValue",defaultValue:.25,minValue:0,maxValue:1,automationRate:"a-rate"},{name:"releaseTime",defaultValue:.25,minValue:0,maxValue:10}]}constructor(e){super(e),this.stages=["rest","attack","hold","decay","sustain","release"],this.stage=this.stages[0],this.stageProgress=0,this.secondsSinceStateTransition=0,this.port.onmessage=this.handleMessage.bind(this),this.state={attackTime:.001,attackValue:1,holdTime:.0625,decayTime:.125,sustainValue:.25,releaseTime:.25},this.sampleRate=e.sampleRate||44100,this.outputValue,this.valueOnTriggerChange=void 0,this.manualTriggerOn=!1}handleMessage(e){e.data&&"getState"===e.data.type&&this.port.postMessage({type:"state",state:{stage:this.stage,stageProgress:this.stageProgress,outputValue:this.outputValue}}),e.data&&"manual-trigger"===e.data.type&&(this.manualTriggerOn=e.data.value)}process(e,t,a){let r=t[0];const n=this.manualTriggerOn?()=>1e9:s(a.trigger,-1e9,1e9),u=s(a.attackTime,0,10),o=s(a.attackValue,0,1),l=s(a.holdTime,0,10),c=s(a.decayTime,0,10),g=s(a.sustainValue,0,1),h=s(a.releaseTime,0,10);let d=0;for(let e=0;e<r[0].length;e++){this.state={attackTime:u(e),attackValue:o(e),holdTime:l(e),decayTime:c(e),sustainValue:g(e),releaseTime:h(e)};const t=n(e);t>0!=d>0&&this.port.postMessage({type:"trigger-change",value:t>0});const a=i(this.sampleRate,this.state,this.secondsSinceStateTransition,this.stage,t,this.valueOnTriggerChange);this.stage=a.stage,this.stageProgress=a.stageProgress,this.secondsSinceStateTransition=a.secondsSinceStateTransition,this.outputValue=a.outputValue,this.valueOnTriggerChange=a.valueOnTriggerChange,d=t;for(let t=0;t<r.length;t++){r[t][e]=this.outputValue}}return!0}})},function(e,t,a){"use strict";function r(e,t,a){t>32&&(t=32),t<1&&(t=1),"trve"===a&&(t=Math.floor(t));let r=2**t;"quantize-evenly"===a&&(r=Math.floor(r));const s=2/r,n=1-s;return e>=n?n:e<=-1?-1:Math.floor((1+e)/s)*s-1}a.r(t),registerProcessor("bit-crusher-fixed-point",class extends AudioWorkletProcessor{static get parameterDescriptors(){return[{name:"bitDepth",defaultValue:8,minValue:1,maxValue:32,automationRate:"a-rate"}]}constructor(){super(),this.fractionalBitDepthMode="quantize-evenly",this.port.onmessage=this.handleMessage.bind(this)}handleMessage(e){e.data&&"change-fractional-bit-depth-mode"===e.data.type&&(this.fractionalBitDepthMode=e.data.newMode)}process(e,t,a){let s=e[0],n=t[0],i=a.bitDepth,u=i.length>1?e=>i[e]:()=>i[0];for(let e=0;e<s.length;e++){const t=s[e],a=n[e];for(let e=0;e<t.length;e++){const s=t[e];a[e]=r(s,u(e),this.fractionalBitDepthMode)}}return!0}})}]);