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
  const sampleTime = 1 / sampleRate;
  let outputStage;
  let secondsSinceStateTransitionOutput;
  let stageProgressOutput = 0;
  if (stage === 'rest') {
    if (triggerValue <= 0) {
      outputStage = 'rest';
      secondsSinceStateTransitionOutput =
        secondsSinceStateTransition + sampleTime;
    } else {
      if (sampleTime < attackTime) {
        outputStage = 'attack';
        secondsSinceStateTransitionOutput = sampleTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / attackTime;
      } else if (sampleTime - attackTime < holdTime) {
        outputStage = 'hold';
        secondsSinceStateTransitionOutput = sampleTime - attackTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / holdTime;
      } else if (sampleTime - attackTime - holdTime < decayTime) {
        outputStage = 'decay';
        secondsSinceStateTransitionOutput = sampleTime - attackTime - holdTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / decayTime;
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
        stageProgressOutput = secondsSinceStateTransitionOutput / releaseTime;
      } else {
        outputStage = 'rest';
        secondsSinceStateTransitionOutput = sampleTime - releaseTime;
      }
    } else {
      if (secondsSinceStateTransition + sampleTime < attackTime) {
        outputStage = 'attack';
        secondsSinceStateTransitionOutput =
          secondsSinceStateTransition + sampleTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / attackTime;
      } else if (
        secondsSinceStateTransition + sampleTime - attackTime <
        holdTime
      ) {
        outputStage = 'hold';
        secondsSinceStateTransitionOutput =
          secondsSinceStateTransition + sampleTime - attackTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / holdTime;
      } else if (
        secondsSinceStateTransition + sampleTime - attackTime - holdTime <
        decayTime
      ) {
        outputStage = 'decay';
        secondsSinceStateTransitionOutput =
          secondsSinceStateTransition + sampleTime - attackTime - holdTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / decayTime;
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
        stageProgressOutput = secondsSinceStateTransitionOutput / releaseTime;
      } else {
        outputStage = 'rest';
        secondsSinceStateTransitionOutput = sampleTime - releaseTime;
      }
    } else {
      if (secondsSinceStateTransition + sampleTime < holdTime) {
        outputStage = 'hold';
        secondsSinceStateTransitionOutput =
          secondsSinceStateTransition + sampleTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / holdTime;
      } else if (
        secondsSinceStateTransition + sampleTime - holdTime <
        decayTime
      ) {
        outputStage = 'decay';
        secondsSinceStateTransitionOutput =
          secondsSinceStateTransition + sampleTime - holdTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / decayTime;
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
        stageProgressOutput = secondsSinceStateTransitionOutput / releaseTime;
      } else {
        outputStage = 'rest';
        secondsSinceStateTransitionOutput = sampleTime - releaseTime;
      }
    } else {
      if (secondsSinceStateTransition + sampleTime < decayTime) {
        outputStage = 'decay';
        secondsSinceStateTransitionOutput =
          secondsSinceStateTransition + sampleTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / decayTime;
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
        stageProgressOutput = secondsSinceStateTransitionOutput / releaseTime;
      } else {
        outputStage = 'rest';
        secondsSinceStateTransitionOutput = sampleTime - releaseTime;
      }
    } else {
      outputStage = 'sustain';
      secondsSinceStateTransitionOutput =
        secondsSinceStateTransition + sampleTime;
    }
  }
  if (stage === 'release') {
    if (triggerValue <= 0) {
      if (secondsSinceStateTransition + sampleTime < releaseTime) {
        outputStage = 'release';
        secondsSinceStateTransitionOutput =
          secondsSinceStateTransition + sampleTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / releaseTime;
      } else {
        outputStage = 'rest';
        secondsSinceStateTransitionOutput =
          secondsSinceStateTransition + sampleTime - releaseTime;
      }
    } else {
      if (sampleTime < attackTime) {
        outputStage = 'attack';
        secondsSinceStateTransitionOutput = sampleTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / attackTime;
      } else if (sampleTime - attackTime < holdTime) {
        outputStage = 'hold';
        secondsSinceStateTransitionOutput = sampleTime - attackTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / holdTime;
      } else if (sampleTime - attackTime - holdTime < decayTime) {
        outputStage = 'decay';
        secondsSinceStateTransitionOutput = sampleTime - attackTime - holdTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / decayTime;
      } else {
        outputStage = 'sustain';
        secondsSinceStateTransitionOutput =
          sampleTime - attackTime - holdTime - decayTime;
      }
    }
  }
  return {
    stage: outputStage,
    stageProgress: stageProgressOutput,
    secondsSinceStateTransition: secondsSinceStateTransitionOutput,
    outputValue: undefined
  };
};
