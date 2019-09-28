// ASSUMPTION: this will be called every sample, so it's safe to always advance time by one sample
// returns the value at end of the sample, so if attack time is 0, attack value will be returned on the sample of the recieved trigger
export const getEnvelopeValue = (
  getValueAtTime,
  sampleRate,
  { attackTime, attackValue, holdTime, decayTime, sustainValue, releaseTime },
  secondsSinceStateTransition,
  stage,
  triggerValue,
  valueOnTriggerChange,
  output = {}
) => {
  const sampleTime = 1 / sampleRate;
  output.stage = stage;
  output.secondsSinceStateTransition = undefined;
  output.stageProgress = 0;
  output.valueOnTriggerChange = undefined;
  output.outputValue = undefined;
  if (stage === 'rest') {
    if (triggerValue <= 0) {
      output.stage = 'rest';
      output.secondsSinceStateTransition = secondsSinceStateTransition + sampleTime;
      output.outputValue = 0;
    } else {
      if (sampleTime < attackTime) {
        output.stage = 'attack';
        output.secondsSinceStateTransition = sampleTime;
        output.stageProgress = output.secondsSinceStateTransition / attackTime;
        output.valueOnTriggerChange = 0;
        output.outputValue = getValueAtTime(
          0,
          0,
          attackValue,
          attackTime,
          output.secondsSinceStateTransition
        );
      } else if (sampleTime - attackTime < holdTime) {
        output.stage = 'hold';
        output.secondsSinceStateTransition = sampleTime - attackTime;
        output.stageProgress = output.secondsSinceStateTransition / holdTime;
        output.outputValue = attackValue;
      } else if (sampleTime - attackTime - holdTime < decayTime) {
        output.stage = 'decay';
        output.secondsSinceStateTransition = sampleTime - attackTime - holdTime;
        output.stageProgress = output.secondsSinceStateTransition / decayTime;
        output.outputValue = getValueAtTime(
          attackValue,
          0,
          sustainValue,
          decayTime,
          output.secondsSinceStateTransition
        );
      } else {
        output.stage = 'sustain';
        output.secondsSinceStateTransition = sampleTime - attackTime - holdTime - decayTime;
        output.outputValue = sustainValue;
      }
    }
  }
  if (stage === 'attack') {
    if (triggerValue <= 0) {
      if (sampleTime < releaseTime) {
        output.stage = 'release';
        output.secondsSinceStateTransition = sampleTime;
        output.stageProgress = output.secondsSinceStateTransition / releaseTime;
        if (secondsSinceStateTransition < attackTime) {
          output.valueOnTriggerChange = getValueAtTime(
            valueOnTriggerChange || 0,
            0,
            attackValue,
            attackTime,
            secondsSinceStateTransition
          );
        } else if (secondsSinceStateTransition - attackTime < holdTime) {
          output.valueOnTriggerChange = attackValue;
        } else if (secondsSinceStateTransition - attackTime - holdTime < decayTime) {
          output.valueOnTriggerChange = getValueAtTime(
            attackValue,
            0,
            sustainValue,
            decayTime,
            secondsSinceStateTransition - attackTime - holdTime
          );
        } else {
          output.valueOnTriggerChange = sustainValue;
        }
        output.outputValue = getValueAtTime(
          output.valueOnTriggerChange,
          0,
          0,
          releaseTime,
          output.secondsSinceStateTransition
        );
      } else {
        output.stage = 'rest';
        output.secondsSinceStateTransition = sampleTime - releaseTime;
        output.outputValue = 0;
      }
    } else {
      if (secondsSinceStateTransition + sampleTime < attackTime) {
        output.stage = 'attack';
        output.secondsSinceStateTransition = secondsSinceStateTransition + sampleTime;
        output.stageProgress = output.secondsSinceStateTransition / attackTime;
        output.valueOnTriggerChange = valueOnTriggerChange;
        output.outputValue = getValueAtTime(
          valueOnTriggerChange || 0,
          0,
          attackValue,
          attackTime,
          output.secondsSinceStateTransition
        );
      } else if (secondsSinceStateTransition + sampleTime - attackTime < holdTime) {
        output.stage = 'hold';
        output.secondsSinceStateTransition = secondsSinceStateTransition + sampleTime - attackTime;
        output.stageProgress = output.secondsSinceStateTransition / holdTime;
        output.outputValue = attackValue;
      } else if (secondsSinceStateTransition + sampleTime - attackTime - holdTime < decayTime) {
        output.stage = 'decay';
        output.secondsSinceStateTransition =
          secondsSinceStateTransition + sampleTime - attackTime - holdTime;
        output.stageProgress = output.secondsSinceStateTransition / decayTime;
        output.outputValue = getValueAtTime(
          attackValue,
          0,
          sustainValue,
          decayTime,
          output.secondsSinceStateTransition
        );
      } else {
        output.stage = 'sustain';
        output.secondsSinceStateTransition =
          secondsSinceStateTransition + sampleTime - attackTime - holdTime - decayTime;
        output.outputValue = sustainValue;
      }
    }
  }
  if (stage === 'hold') {
    if (triggerValue <= 0) {
      if (sampleTime < releaseTime) {
        output.stage = 'release';
        output.secondsSinceStateTransition = sampleTime;
        output.stageProgress = output.secondsSinceStateTransition / releaseTime;
        if (secondsSinceStateTransition < holdTime) {
          output.valueOnTriggerChange = attackValue;
        } else if (secondsSinceStateTransition - holdTime < decayTime) {
          output.valueOnTriggerChange = getValueAtTime(
            attackValue,
            0,
            sustainValue,
            decayTime,
            secondsSinceStateTransition - holdTime
          );
        } else {
          output.valueOnTriggerChange = sustainValue;
        }
        output.outputValue = getValueAtTime(
          output.valueOnTriggerChange,
          0,
          0,
          releaseTime,
          output.secondsSinceStateTransition
        );
      } else {
        output.stage = 'rest';
        output.secondsSinceStateTransition = sampleTime - releaseTime;
        output.outputValue = 0;
      }
    } else {
      if (secondsSinceStateTransition + sampleTime < holdTime) {
        output.stage = 'hold';
        output.secondsSinceStateTransition = secondsSinceStateTransition + sampleTime;
        output.stageProgress = output.secondsSinceStateTransition / holdTime;
        output.outputValue = attackValue;
      } else if (secondsSinceStateTransition + sampleTime - holdTime < decayTime) {
        output.stage = 'decay';
        output.secondsSinceStateTransition = secondsSinceStateTransition + sampleTime - holdTime;
        output.stageProgress = output.secondsSinceStateTransition / decayTime;
        output.outputValue = getValueAtTime(
          attackValue,
          0,
          sustainValue,
          decayTime,
          output.secondsSinceStateTransition
        );
      } else {
        output.stage = 'sustain';
        output.secondsSinceStateTransition =
          secondsSinceStateTransition + sampleTime - holdTime - decayTime;
        output.outputValue = sustainValue;
      }
    }
  }
  if (stage === 'decay') {
    if (triggerValue <= 0) {
      if (sampleTime < releaseTime) {
        output.stage = 'release';
        output.secondsSinceStateTransition = sampleTime;
        output.stageProgress = output.secondsSinceStateTransition / releaseTime;
        if (secondsSinceStateTransition < decayTime) {
          output.valueOnTriggerChange = getValueAtTime(
            attackValue,
            0,
            sustainValue,
            decayTime,
            secondsSinceStateTransition
          );
        } else {
          output.valueOnTriggerChange = sustainValue;
        }
        output.outputValue = getValueAtTime(
          output.valueOnTriggerChange,
          0,
          0,
          releaseTime,
          output.secondsSinceStateTransition
        );
      } else {
        output.stage = 'rest';
        output.secondsSinceStateTransition = sampleTime - releaseTime;
        output.outputValue = 0;
      }
    } else {
      if (secondsSinceStateTransition + sampleTime < decayTime) {
        output.stage = 'decay';
        output.secondsSinceStateTransition = secondsSinceStateTransition + sampleTime;
        output.stageProgress = output.secondsSinceStateTransition / decayTime;
        output.outputValue = getValueAtTime(
          attackValue,
          0,
          sustainValue,
          decayTime,
          output.secondsSinceStateTransition
        );
      } else {
        output.stage = 'sustain';
        output.secondsSinceStateTransition = secondsSinceStateTransition + sampleTime - decayTime;
        output.outputValue = sustainValue;
      }
    }
  }
  if (stage === 'sustain') {
    if (triggerValue <= 0) {
      if (sampleTime < releaseTime) {
        output.stage = 'release';
        output.secondsSinceStateTransition = sampleTime;
        output.stageProgress = output.secondsSinceStateTransition / releaseTime;
        output.valueOnTriggerChange = sustainValue;
        output.outputValue = getValueAtTime(
          output.valueOnTriggerChange,
          0,
          0,
          releaseTime,
          output.secondsSinceStateTransition
        );
      } else {
        output.stage = 'rest';
        output.secondsSinceStateTransition = sampleTime - releaseTime;
        output.outputValue = 0;
      }
    } else {
      output.stage = 'sustain';
      output.secondsSinceStateTransition = secondsSinceStateTransition + sampleTime;
      output.outputValue = sustainValue;
    }
  }
  if (stage === 'release') {
    if (triggerValue <= 0) {
      if (secondsSinceStateTransition + sampleTime < releaseTime) {
        output.stage = 'release';
        output.secondsSinceStateTransition = secondsSinceStateTransition + sampleTime;
        output.stageProgress = output.secondsSinceStateTransition / releaseTime;
        output.valueOnTriggerChange = valueOnTriggerChange;
        output.outputValue = getValueAtTime(
          output.valueOnTriggerChange,
          0,
          0,
          releaseTime,
          output.secondsSinceStateTransition
        );
      } else {
        output.stage = 'rest';
        output.secondsSinceStateTransition = secondsSinceStateTransition + sampleTime - releaseTime;
        output.outputValue = 0;
      }
    } else {
      if (sampleTime < attackTime) {
        output.stage = 'attack';
        output.secondsSinceStateTransition = sampleTime;
        output.stageProgress = output.secondsSinceStateTransition / attackTime;
        output.valueOnTriggerChange = getValueAtTime(
          valueOnTriggerChange || 0,
          0,
          0,
          releaseTime,
          secondsSinceStateTransition
        );
        output.outputValue = getValueAtTime(
          output.valueOnTriggerChange,
          0,
          attackValue,
          attackTime,
          output.secondsSinceStateTransition
        );
      } else if (sampleTime - attackTime < holdTime) {
        output.stage = 'hold';
        output.secondsSinceStateTransition = sampleTime - attackTime;
        output.stageProgress = output.secondsSinceStateTransition / holdTime;
        output.outputValue = attackValue;
      } else if (sampleTime - attackTime - holdTime < decayTime) {
        output.stage = 'decay';
        output.secondsSinceStateTransition = sampleTime - attackTime - holdTime;
        output.stageProgress = output.secondsSinceStateTransition / decayTime;
        output.outputValue = getValueAtTime(
          attackValue,
          0,
          sustainValue,
          decayTime,
          output.secondsSinceStateTransition
        );
      } else {
        output.stage = 'sustain';
        output.secondsSinceStateTransition = sampleTime - attackTime - holdTime - decayTime;
        output.outputValue = sustainValue;
      }
    }
  }
  return output;
};
