import { getValueAtTime } from './linear-change';

// ASSUMPTION: this will be called every sample, so it's safe to always advance time by one sample
export const getEnvelopeValue = (
  sampleRate,
  { attackTime, attackValue, holdTime, decayTime, sustainValue, releaseTime },
  secondsSinceStateTransition,
  stage,
  triggerValue
) => {
  let outputStage;
  const sampleTime = 1 / sampleRate;
  if (stage === 'rest') {
    if (triggerValue <= 0) {
      outputStage = 'rest';
    } else {
      if (sampleTime < attackTime) {
        outputStage = 'attack';
      } else if (sampleTime - attackTime < holdTime) {
        outputStage = 'hold';
      } else if (sampleTime - attackTime - holdTime < decayTime) {
        outputStage = 'decay';
      } else {
        outputStage = 'sustain';
      }
    }
  }
  if (stage === 'attack') {
    if (triggerValue <= 0) {
      if (releaseTime) {
        outputStage = 'release';
      } else {
        outputStage = 'rest';
      }
    } else {
      if (secondsSinceStateTransition + sampleTime < attackTime) {
        outputStage = 'attack';
      } else if (secondsSinceStateTransition + sampleTime - attackTime < holdTime) {
        outputStage = 'hold';
      } else if (
        secondsSinceStateTransition + sampleTime - attackTime - holdTime <
        decayTime
      ) {
        outputStage = 'decay';
      } else {
        outputStage = 'sustain';
      }
    }
  }
  if (stage === 'hold') {
    if (triggerValue <= 0) {
      if (releaseTime) {
        outputStage = 'release';
      } else {
        outputStage = 'rest';
      }
    } else {
      if (secondsSinceStateTransition + sampleTime < holdTime) {
        outputStage = 'hold';
      } else if (secondsSinceStateTransition + sampleTime - holdTime < decayTime) {
        outputStage = 'decay';
      } else {
        outputStage = 'sustain';
      }
    }
  }
  if (stage === 'decay') {
    if (triggerValue <= 0) {
      if (releaseTime) {
        outputStage = 'release';
      } else {
        outputStage = 'rest';
      }
    } else {
      if (secondsSinceStateTransition + sampleTime < decayTime) {
        outputStage = 'decay';
      } else {
        outputStage = 'sustain';
      }
    }
  }
  if (stage === 'sustain') {
    if (triggerValue <= 0) {
      if (releaseTime) {
        outputStage = 'release';
      } else {
        outputStage = 'rest';
      }
    } else {
      outputStage = 'sustain';
    }
  }
  if (stage === 'release') {
    if (triggerValue <= 0) {
      if (secondsSinceStateTransition + sampleTime < releaseTime) {
        outputStage = 'release';
      } else {
        outputStage = 'rest';
      }
    } else {
      if (attackTime) {
        outputStage = 'attack';
      } else if (holdTime) {
        outputStage = 'hold';
      } else if (decayTime) {
        outputStage = 'decay';
      } else {
        outputStage = 'sustain';
      }
    }
  }
  return {
    stage: outputStage,
    stageProgress: 0,
    secondsSinceStateTransition: 0,
    outputValue: 0
  };
};
