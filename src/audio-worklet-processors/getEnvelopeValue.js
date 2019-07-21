import { getValueAtTime } from './linear-change';

// ASSUMPTION: this will be called every sample, so it's safe to always advance time by one sample
// returns the value at end of the sample, so if attack time is 0, attack value will be returned on the sample of the recieved trigger
export const getEnvelopeValue = (
  sampleRate,
  { attackTime, attackValue, holdTime, decayTime, sustainValue, releaseTime },
  secondsSinceStateTransition,
  stage,
  triggerValue
) => {
  let outputStage;
  const sampleTime = 1 / sampleRate;
  let secondsSinceStateTransitionOutput =
    secondsSinceStateTransition + sampleTime;
  if (stage === 'rest') {
    if (triggerValue <= 0) {
      outputStage = 'rest';
    } else {
      if (sampleTime < attackTime) {
        outputStage = 'attack';
        secondsSinceStateTransitionOutput = sampleTime;
      } else if (sampleTime - attackTime < holdTime) {
        outputStage = 'hold';
        secondsSinceStateTransitionOutput = sampleTime - attackTime;
      } else if (sampleTime - attackTime - holdTime < decayTime) {
        outputStage = 'decay';
        secondsSinceStateTransitionOutput = sampleTime - attackTime - holdTime;
      } else {
        outputStage = 'sustain';
        secondsSinceStateTransitionOutput =
          sampleTime - attackTime - holdTime - decayTime;
      }
    }
  }
  if (stage === 'attack') {
    if (triggerValue <= 0) {
      if (sampleTime < releaseTime) {
        outputStage = 'release';
        secondsSinceStateTransitionOutput = sampleTime;
      } else {
        outputStage = 'rest';
        secondsSinceStateTransitionOutput = sampleTime - releaseTime;
      }
    } else {
      if (secondsSinceStateTransition + sampleTime < attackTime) {
        outputStage = 'attack';
      } else if (
        secondsSinceStateTransition + sampleTime - attackTime <
        holdTime
      ) {
        outputStage = 'hold';
        secondsSinceStateTransitionOutput =
          secondsSinceStateTransition + sampleTime - attackTime;
      } else if (
        secondsSinceStateTransition + sampleTime - attackTime - holdTime <
        decayTime
      ) {
        outputStage = 'decay';
        secondsSinceStateTransitionOutput =
          secondsSinceStateTransition + sampleTime - attackTime - holdTime;
      } else {
        outputStage = 'sustain';
        secondsSinceStateTransitionOutput =
          secondsSinceStateTransition +
          sampleTime -
          attackTime -
          holdTime -
          decayTime;
      }
    }
  }
  if (stage === 'hold') {
    if (triggerValue <= 0) {
      if (sampleTime < releaseTime) {
        outputStage = 'release';
        secondsSinceStateTransitionOutput = sampleTime;
      } else {
        outputStage = 'rest';
        secondsSinceStateTransitionOutput = sampleTime - releaseTime;
      }
    } else {
      if (secondsSinceStateTransition + sampleTime < holdTime) {
        outputStage = 'hold';
      } else if (
        secondsSinceStateTransition + sampleTime - holdTime <
        decayTime
      ) {
        outputStage = 'decay';
        secondsSinceStateTransitionOutput =
          secondsSinceStateTransition + sampleTime - holdTime;
      } else {
        outputStage = 'sustain';
        secondsSinceStateTransitionOutput =
          secondsSinceStateTransition + sampleTime - holdTime - decayTime;
      }
    }
  }
  if (stage === 'decay') {
    if (triggerValue <= 0) {
      if (sampleTime < releaseTime) {
        outputStage = 'release';
        secondsSinceStateTransitionOutput = sampleTime;
      } else {
        outputStage = 'rest';
        secondsSinceStateTransitionOutput = sampleTime - releaseTime;
      }
    } else {
      if (secondsSinceStateTransition + sampleTime < decayTime) {
        outputStage = 'decay';
      } else {
        outputStage = 'sustain';
        secondsSinceStateTransitionOutput =
          secondsSinceStateTransition + sampleTime - decayTime;
      }
    }
  }
  if (stage === 'sustain') {
    if (triggerValue <= 0) {
      if (sampleTime < releaseTime) {
        outputStage = 'release';
        secondsSinceStateTransitionOutput = sampleTime;
      } else {
        outputStage = 'rest';
        secondsSinceStateTransitionOutput = sampleTime - releaseTime;
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
        secondsSinceStateTransitionOutput =
          secondsSinceStateTransition + sampleTime - releaseTime;
      }
    } else {
      if (sampleTime < attackTime) {
        outputStage = 'attack';
        secondsSinceStateTransitionOutput = sampleTime;
      } else if (sampleTime - attackTime < holdTime) {
        outputStage = 'hold';
        secondsSinceStateTransitionOutput = sampleTime - attackTime;
      } else if (sampleTime - attackTime - holdTime < decayTime) {
        outputStage = 'decay';
        secondsSinceStateTransitionOutput = sampleTime - attackTime - holdTime;
      } else {
        outputStage = 'sustain';
        secondsSinceStateTransitionOutput =
          sampleTime - attackTime - holdTime - decayTime;
      }
    }
  }
  return {
    stage: outputStage,
    stageProgress: undefined,
    secondsSinceStateTransition: secondsSinceStateTransitionOutput,
    outputValue: undefined
  };
};
