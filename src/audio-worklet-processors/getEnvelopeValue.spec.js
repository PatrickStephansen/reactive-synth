import { getEnvelopeValue } from './getEnvelopeValue';

const allStagesHaveTimeState = {
  attackTime: 0.2,
  attackValue: 1,
  holdTime: 0.3,
  decayTime: 0.7,
  sustainValue: 0.5,
  releaseTime: 1.2
};
const skipAttackState = {
  attackTime: 0,
  attackValue: 1,
  holdTime: 0.3,
  decayTime: 0.7,
  sustainValue: 0.5,
  releaseTime: 1.2
};
const skipHoldState = {
  attackTime: 0.2,
  attackValue: 1,
  holdTime: 0,
  decayTime: 0.7,
  sustainValue: 0.5,
  releaseTime: 1.2
};
const skipAttackAndHoldState = {
  attackTime: 0,
  attackValue: 1,
  holdTime: 0,
  decayTime: 0.7,
  sustainValue: 0.5,
  releaseTime: 1.2
};
const skipDecayState = {
  attackTime: 0.2,
  attackValue: 1,
  holdTime: 0.3,
  decayTime: 0,
  sustainValue: 0.5,
  releaseTime: 1.2
};
const skipHoldAndDecayState = {
  attackTime: 0.2,
  attackValue: 1,
  holdTime: 0,
  decayTime: 0,
  sustainValue: 0.5,
  releaseTime: 1.2
};
const skipAttackHoldAndDecayState = {
  attackTime: 0,
  attackValue: 1,
  holdTime: 0,
  decayTime: 0,
  sustainValue: 0.5,
  releaseTime: 1.2
};
const skipReleaseState = {
  attackTime: 0.2,
  attackValue: 1,
  holdTime: 0.3,
  decayTime: 0.7,
  sustainValue: 0.5,
  releaseTime: 1.2
};

describe('linear envelope generator', () => {
  test.each([
    [10, allStagesHaveTimeState, 0, 'rest', 0, 'rest'],
    [10, skipAttackHoldAndDecayState, 0, 'rest', 0, 'rest'],
    [10, allStagesHaveTimeState, 0, 'rest', 1, 'attack'],
    [10, skipAttackState, 0, 'rest', 1, 'hold'],
    [10, skipAttackAndHoldState, 0, 'rest', 1, 'decay'],
    [10, skipAttackHoldAndDecayState, 0, 'rest', 1, 'sustain'],
    [10, allStagesHaveTimeState, 0.1, 'attack', 1, 'attack'],
    [10, allStagesHaveTimeState, 0.2, 'attack', 1, 'decay'],
    [10, allStagesHaveTimeState, 0.2, 'attack', 0, 'release'],
    [10, skipAttackState, 0.1, 'attack', 1, 'decay']
  ])(
    'transitions to the correct state. sample rate: %f, start state: %j, seconds since trigger on: %f, seconds since trigger off: %f, start stage: %s, trigger value: %f, expected stage: %s',
    (
      sampleRate,
      state,
      secondsSinceStateTransition,
      stage,
      inputSample,
      expectedStage
    ) => {
      expect(
        getEnvelopeValue(
          sampleRate,
          state,
          secondsSinceStateTransition,
          stage,
          inputSample
        ).stage
      ).toBe(expectedStage);
    }
  );
});
