import { getValueAtTime } from './linear-change';

// ASSUMPTION: this will be called every sample, so it's safe to always advance time by one sample
// returns the value at end of the sample, so if attack time is 0, attack value will be returned on the sample of the recieved trigger
export const getEnvelopeValue = (
  sampleRate,
  { attackTime, attackValue, holdTime, decayTime, sustainValue, releaseTime },
  secondsSinceStateTransition,
  stage,
  triggerValue,
  valueOnRelease
) => {
  const sampleTime = 1 / sampleRate;
  let stageOutput;
  let secondsSinceStateTransitionOutput;
  let stageProgressOutput = 0;
  let valueOnReleaseOutput = undefined;
  let valueOutput = undefined;
  if (stage === 'rest') {
    if (triggerValue <= 0) {
      stageOutput = 'rest';
      secondsSinceStateTransitionOutput = secondsSinceStateTransition + sampleTime;
      valueOutput = 0;
    } else {
      if (sampleTime < attackTime) {
        stageOutput = 'attack';
        secondsSinceStateTransitionOutput = sampleTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / attackTime;
        valueOutput = getValueAtTime(
          0,
          0,
          attackValue,
          attackTime,
          secondsSinceStateTransitionOutput
        );
      } else if (sampleTime - attackTime < holdTime) {
        stageOutput = 'hold';
        secondsSinceStateTransitionOutput = sampleTime - attackTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / holdTime;
        valueOutput = attackValue;
      } else if (sampleTime - attackTime - holdTime < decayTime) {
        stageOutput = 'decay';
        secondsSinceStateTransitionOutput = sampleTime - attackTime - holdTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / decayTime;
        valueOutput = getValueAtTime(
          attackValue,
          0,
          sustainValue,
          decayTime,
          secondsSinceStateTransitionOutput
        );
      } else {
        stageOutput = 'sustain';
        secondsSinceStateTransitionOutput = sampleTime - attackTime - holdTime - decayTime;
        valueOutput = sustainValue;
      }
    }
  }
  if (stage === 'attack') {
    if (triggerValue <= 0) {
      if (sampleTime < releaseTime) {
        stageOutput = 'release';
        secondsSinceStateTransitionOutput = sampleTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / releaseTime;
        if (secondsSinceStateTransition < attackTime) {
          valueOnReleaseOutput = getValueAtTime(
            0,
            0,
            attackValue,
            attackTime,
            secondsSinceStateTransition
          );
        } else if (secondsSinceStateTransition - attackTime < holdTime) {
          valueOnReleaseOutput = attackValue;
        } else if (secondsSinceStateTransition - attackTime - holdTime < decayTime) {
          valueOnReleaseOutput = getValueAtTime(
            attackValue,
            0,
            sustainValue,
            decayTime,
            secondsSinceStateTransition - attackTime - holdTime
          );
        } else {
          valueOnReleaseOutput = sustainValue;
        }
        valueOutput = getValueAtTime(
          valueOnReleaseOutput,
          0,
          0,
          releaseTime,
          secondsSinceStateTransitionOutput
        );
      } else {
        stageOutput = 'rest';
        secondsSinceStateTransitionOutput = sampleTime - releaseTime;
        valueOutput = 0;
      }
    } else {
      if (secondsSinceStateTransition + sampleTime < attackTime) {
        stageOutput = 'attack';
        secondsSinceStateTransitionOutput = secondsSinceStateTransition + sampleTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / attackTime;
        valueOutput = getValueAtTime(
          0,
          0,
          attackValue,
          attackTime,
          secondsSinceStateTransitionOutput
        );
      } else if (secondsSinceStateTransition + sampleTime - attackTime < holdTime) {
        stageOutput = 'hold';
        secondsSinceStateTransitionOutput = secondsSinceStateTransition + sampleTime - attackTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / holdTime;
        valueOutput = attackValue;
      } else if (secondsSinceStateTransition + sampleTime - attackTime - holdTime < decayTime) {
        stageOutput = 'decay';
        secondsSinceStateTransitionOutput =
          secondsSinceStateTransition + sampleTime - attackTime - holdTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / decayTime;
        valueOutput = getValueAtTime(
          attackValue,
          0,
          sustainValue,
          decayTime,
          secondsSinceStateTransitionOutput
        );
      } else {
        stageOutput = 'sustain';
        secondsSinceStateTransitionOutput =
          secondsSinceStateTransition + sampleTime - attackTime - holdTime - decayTime;
        valueOutput = sustainValue;
      }
    }
  }
  if (stage === 'hold') {
    if (triggerValue <= 0) {
      if (sampleTime < releaseTime) {
        stageOutput = 'release';
        secondsSinceStateTransitionOutput = sampleTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / releaseTime;
        if (secondsSinceStateTransition < holdTime) {
          valueOnReleaseOutput = attackValue;
        } else if (secondsSinceStateTransition - holdTime < decayTime) {
          valueOnReleaseOutput = getValueAtTime(
            attackValue,
            0,
            sustainValue,
            decayTime,
            secondsSinceStateTransition - holdTime
          );
        } else {
          valueOnReleaseOutput = sustainValue;
        }
        valueOutput = getValueAtTime(
          valueOnReleaseOutput,
          0,
          0,
          releaseTime,
          secondsSinceStateTransitionOutput
        );
      } else {
        stageOutput = 'rest';
        secondsSinceStateTransitionOutput = sampleTime - releaseTime;
        valueOutput = 0;
      }
    } else {
      if (secondsSinceStateTransition + sampleTime < holdTime) {
        stageOutput = 'hold';
        secondsSinceStateTransitionOutput = secondsSinceStateTransition + sampleTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / holdTime;
        valueOutput = attackValue;
      } else if (secondsSinceStateTransition + sampleTime - holdTime < decayTime) {
        stageOutput = 'decay';
        secondsSinceStateTransitionOutput = secondsSinceStateTransition + sampleTime - holdTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / decayTime;
        valueOutput = getValueAtTime(
          attackValue,
          0,
          sustainValue,
          decayTime,
          secondsSinceStateTransitionOutput
        );
      } else {
        stageOutput = 'sustain';
        secondsSinceStateTransitionOutput =
          secondsSinceStateTransition + sampleTime - holdTime - decayTime;
        valueOutput = sustainValue;
      }
    }
  }
  if (stage === 'decay') {
    if (triggerValue <= 0) {
      if (sampleTime < releaseTime) {
        stageOutput = 'release';
        secondsSinceStateTransitionOutput = sampleTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / releaseTime;
        if (secondsSinceStateTransition < decayTime) {
          valueOnReleaseOutput = getValueAtTime(
            attackValue,
            0,
            sustainValue,
            decayTime,
            secondsSinceStateTransition
          );
        } else {
          valueOnReleaseOutput = sustainValue;
        }
        valueOutput = getValueAtTime(
          valueOnReleaseOutput,
          0,
          0,
          releaseTime,
          secondsSinceStateTransitionOutput
        );
      } else {
        stageOutput = 'rest';
        secondsSinceStateTransitionOutput = sampleTime - releaseTime;
        valueOutput = 0;
      }
    } else {
      if (secondsSinceStateTransition + sampleTime < decayTime) {
        stageOutput = 'decay';
        secondsSinceStateTransitionOutput = secondsSinceStateTransition + sampleTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / decayTime;
        valueOutput = getValueAtTime(
          attackValue,
          0,
          sustainValue,
          decayTime,
          secondsSinceStateTransitionOutput
        );
      } else {
        stageOutput = 'sustain';
        secondsSinceStateTransitionOutput = secondsSinceStateTransition + sampleTime - decayTime;
        valueOutput = sustainValue;
      }
    }
  }
  if (stage === 'sustain') {
    if (triggerValue <= 0) {
      if (sampleTime < releaseTime) {
        stageOutput = 'release';
        secondsSinceStateTransitionOutput = sampleTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / releaseTime;
        valueOnReleaseOutput = sustainValue;
        valueOutput = getValueAtTime(
          valueOnReleaseOutput,
          0,
          0,
          releaseTime,
          secondsSinceStateTransitionOutput
        );
      } else {
        stageOutput = 'rest';
        secondsSinceStateTransitionOutput = sampleTime - releaseTime;
        valueOutput = 0;
      }
    } else {
      stageOutput = 'sustain';
      secondsSinceStateTransitionOutput = secondsSinceStateTransition + sampleTime;
      valueOutput = sustainValue;
    }
  }
  if (stage === 'release') {
    if (triggerValue <= 0) {
      if (secondsSinceStateTransition + sampleTime < releaseTime) {
        stageOutput = 'release';
        secondsSinceStateTransitionOutput = secondsSinceStateTransition + sampleTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / releaseTime;
        valueOnReleaseOutput = valueOnRelease;
        valueOutput = getValueAtTime(
          valueOnReleaseOutput,
          0,
          0,
          releaseTime,
          secondsSinceStateTransition
        );
      } else {
        stageOutput = 'rest';
        secondsSinceStateTransitionOutput = secondsSinceStateTransition + sampleTime - releaseTime;
        valueOutput = 0;
      }
    } else {
      if (sampleTime < attackTime) {
        stageOutput = 'attack';
        secondsSinceStateTransitionOutput = sampleTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / attackTime;
        valueOutput = getValueAtTime(
          0,
          0,
          attackValue,
          attackTime,
          secondsSinceStateTransitionOutput
        );
      } else if (sampleTime - attackTime < holdTime) {
        stageOutput = 'hold';
        secondsSinceStateTransitionOutput = sampleTime - attackTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / holdTime;
        valueOutput = attackValue;
      } else if (sampleTime - attackTime - holdTime < decayTime) {
        stageOutput = 'decay';
        secondsSinceStateTransitionOutput = sampleTime - attackTime - holdTime;
        stageProgressOutput = secondsSinceStateTransitionOutput / decayTime;
        valueOutput = getValueAtTime(
          attackValue,
          0,
          sustainValue,
          decayTime,
          secondsSinceStateTransitionOutput
        );
      } else {
        stageOutput = 'sustain';
        secondsSinceStateTransitionOutput = sampleTime - attackTime - holdTime - decayTime;
        valueOutput = sustainValue;
      }
    }
  }
  return {
    stage: stageOutput,
    stageProgress: stageProgressOutput,
    secondsSinceStateTransition: secondsSinceStateTransitionOutput,
    valueOnRelease: valueOnReleaseOutput,
    outputValue: valueOutput
  };
};
