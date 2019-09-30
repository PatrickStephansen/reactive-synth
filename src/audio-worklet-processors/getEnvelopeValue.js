export const restStage = 0;
export const attackStage = 1;
export const holdStage = 2;
export const decayStage = 3;
export const sustainStage = 4;
export const releaseStage = 5;
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
  if (stage === restStage) {
    if (triggerValue <= 0) {
      output.stage = restStage;
      output.secondsSinceStateTransition = secondsSinceStateTransition + sampleTime;
      output.outputValue = 0;
    } else {
      if (sampleTime < attackTime) {
        output.stage = attackStage;
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
        output.stage = holdStage;
        output.secondsSinceStateTransition = sampleTime - attackTime;
        output.stageProgress = output.secondsSinceStateTransition / holdTime;
        output.outputValue = attackValue;
      } else if (sampleTime - attackTime - holdTime < decayTime) {
        output.stage = decayStage;
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
        output.stage = sustainStage;
        output.secondsSinceStateTransition = sampleTime - attackTime - holdTime - decayTime;
        output.outputValue = sustainValue;
      }
    }
  }
  if (stage === attackStage) {
    if (triggerValue <= 0) {
      if (sampleTime < releaseTime) {
        output.stage = releaseStage;
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
        output.stage = restStage;
        output.secondsSinceStateTransition = sampleTime - releaseTime;
        output.outputValue = 0;
      }
    } else {
      if (secondsSinceStateTransition + sampleTime < attackTime) {
        output.stage = attackStage;
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
        output.stage = holdStage;
        output.secondsSinceStateTransition = secondsSinceStateTransition + sampleTime - attackTime;
        output.stageProgress = output.secondsSinceStateTransition / holdTime;
        output.outputValue = attackValue;
      } else if (secondsSinceStateTransition + sampleTime - attackTime - holdTime < decayTime) {
        output.stage = decayStage;
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
        output.stage = sustainStage;
        output.secondsSinceStateTransition =
          secondsSinceStateTransition + sampleTime - attackTime - holdTime - decayTime;
        output.outputValue = sustainValue;
      }
    }
  }
  if (stage === holdStage) {
    if (triggerValue <= 0) {
      if (sampleTime < releaseTime) {
        output.stage = releaseStage;
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
        output.stage = restStage;
        output.secondsSinceStateTransition = sampleTime - releaseTime;
        output.outputValue = 0;
      }
    } else {
      if (secondsSinceStateTransition + sampleTime < holdTime) {
        output.stage = holdStage;
        output.secondsSinceStateTransition = secondsSinceStateTransition + sampleTime;
        output.stageProgress = output.secondsSinceStateTransition / holdTime;
        output.outputValue = attackValue;
      } else if (secondsSinceStateTransition + sampleTime - holdTime < decayTime) {
        output.stage = decayStage;
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
        output.stage = sustainStage;
        output.secondsSinceStateTransition =
          secondsSinceStateTransition + sampleTime - holdTime - decayTime;
        output.outputValue = sustainValue;
      }
    }
  }
  if (stage === decayStage) {
    if (triggerValue <= 0) {
      if (sampleTime < releaseTime) {
        output.stage = releaseStage;
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
        output.stage = restStage;
        output.secondsSinceStateTransition = sampleTime - releaseTime;
        output.outputValue = 0;
      }
    } else {
      if (secondsSinceStateTransition + sampleTime < decayTime) {
        output.stage = decayStage;
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
        output.stage = sustainStage;
        output.secondsSinceStateTransition = secondsSinceStateTransition + sampleTime - decayTime;
        output.outputValue = sustainValue;
      }
    }
  }
  if (stage === sustainStage) {
    if (triggerValue <= 0) {
      if (sampleTime < releaseTime) {
        output.stage = releaseStage;
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
        output.stage = restStage;
        output.secondsSinceStateTransition = sampleTime - releaseTime;
        output.outputValue = 0;
      }
    } else {
      output.stage = sustainStage;
      output.secondsSinceStateTransition = secondsSinceStateTransition + sampleTime;
      output.outputValue = sustainValue;
    }
  }
  if (stage === releaseStage) {
    if (triggerValue <= 0) {
      if (secondsSinceStateTransition + sampleTime < releaseTime) {
        output.stage = releaseStage;
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
        output.stage = restStage;
        output.secondsSinceStateTransition = secondsSinceStateTransition + sampleTime - releaseTime;
        output.outputValue = 0;
      }
    } else {
      if (sampleTime < attackTime) {
        output.stage = attackStage;
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
        output.stage = holdStage;
        output.secondsSinceStateTransition = sampleTime - attackTime;
        output.stageProgress = output.secondsSinceStateTransition / holdTime;
        output.outputValue = attackValue;
      } else if (sampleTime - attackTime - holdTime < decayTime) {
        output.stage = decayStage;
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
        output.stage = sustainStage;
        output.secondsSinceStateTransition = sampleTime - attackTime - holdTime - decayTime;
        output.outputValue = sustainValue;
      }
    }
  }
  return output;
};
