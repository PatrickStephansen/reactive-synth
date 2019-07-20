export const getEnvelopeValue = (
  sampleRate,
  { attackTime, attackValue, holdTime, decayTime, sustainValue, releaseTime },
  secondsSinceStateTransition,
  stage,
  triggerValue
) => {
  let outputStage;
  if (stage === 'rest') {
    if (triggerValue <= 0) {
      outputStage = 'rest';
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
    secondsSinceTriggerOff: 0,
    secondsSinceTriggerOn: 0,
    outputValue: 0
  };
};
