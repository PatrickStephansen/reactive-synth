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
  releaseTime: 0
};

describe('linear envelope generator', () => {
  test.each([
    [10, allStagesHaveTimeState, 0, 'rest', 0, 'rest'],
    [10, skipAttackHoldAndDecayState, 0, 'rest', 0, 'rest'],
    [10, skipAttackHoldAndDecayState, 1, 'rest', 0, 'rest'],
    [10, allStagesHaveTimeState, 0, 'rest', 1, 'attack'],
    [10, allStagesHaveTimeState, 2, 'rest', 1, 'attack'],
    [10, skipAttackState, 0, 'rest', 1, 'hold'],
    [10, skipAttackAndHoldState, 0, 'rest', 1, 'decay'],
    [10, skipAttackHoldAndDecayState, 0, 'rest', 1, 'sustain'],
    [10, allStagesHaveTimeState, 0, 'attack', 1, 'attack'],
    [10, allStagesHaveTimeState, 0.1, 'attack', 1, 'attack'],
    [10, allStagesHaveTimeState, 0.2, 'attack', 1, 'hold'],
    [10, allStagesHaveTimeState, 0.3, 'attack', 1, 'hold'],
    [10, allStagesHaveTimeState, 0.5, 'attack', 1, 'decay'],
    [10, allStagesHaveTimeState, 1.1, 'attack', 1, 'decay'],
    [10, allStagesHaveTimeState, 1.2, 'attack', 1, 'sustain'],
    [10, allStagesHaveTimeState, 0.2, 'attack', 0, 'release'],
    [10, skipAttackState, 0.2, 'attack', 0, 'release'],
    [10, skipAttackAndHoldState, 0.2, 'attack', 0, 'release'],
    [10, skipAttackHoldAndDecayState, 0.2, 'attack', 0, 'release'],
    [10, skipDecayState, 0.2, 'attack', 0, 'release'],
    [10, skipHoldAndDecayState, 0.2, 'attack', 0, 'release'],
    [10, skipHoldState, 0.2, 'attack', 0, 'release'],
    [10, skipReleaseState, 0.1, 'attack', 0, 'rest'],
    [10, skipAttackState, 0.1, 'attack', 1, 'hold'],
    [10, skipAttackState, 0.3, 'attack', 1, 'decay'],
    [10, skipAttackState, 1, 'attack', 1, 'sustain'],
    [10, skipAttackAndHoldState, 0.1, 'attack', 1, 'decay'],
    [10, skipAttackAndHoldState, 0.7, 'attack', 1, 'sustain'],
    [10, skipAttackHoldAndDecayState, 1.1, 'attack', 1, 'sustain'],
    [10, allStagesHaveTimeState, 0, 'hold', 1, 'hold'],
    [10, allStagesHaveTimeState, 0.2, 'hold', 1, 'hold'],
    [10, allStagesHaveTimeState, 0.3, 'hold', 1, 'decay'],
    [10, allStagesHaveTimeState, 0.9, 'hold', 1, 'decay'],
    [10, allStagesHaveTimeState, 1, 'hold', 1, 'sustain'],
    [10, skipAttackAndHoldState, 0, 'hold', 1, 'decay'],
    [10, skipAttackAndHoldState, 0.7, 'hold', 1, 'sustain'],
    [10, skipAttackHoldAndDecayState, 0, 'hold', 1, 'sustain'],
    [10, skipAttackState, 0.2, 'hold', 1, 'hold'],
    [10, skipAttackState, 0.3, 'hold', 1, 'decay'],
    [10, skipDecayState, 0.3, 'hold', 1, 'sustain'],
    [10, skipHoldAndDecayState, 0, 'hold', 1, 'sustain'],
    [10, skipHoldState, 0, 'hold', 1, 'decay'],
    [10, skipHoldState, 0.7, 'hold', 1, 'sustain'],
    [10, allStagesHaveTimeState, 0, 'hold', 0, 'release'],
    [10, allStagesHaveTimeState, 10, 'hold', 0, 'release'],
    [10, skipAttackAndHoldState, 0, 'hold', 0, 'release'],
    [10, skipAttackHoldAndDecayState, 0, 'hold', 0, 'release'],
    [10, skipAttackState, 0, 'hold', 0, 'release'],
    [10, skipDecayState, 0, 'hold', 0, 'release'],
    [10, skipHoldAndDecayState, 0, 'hold', 0, 'release'],
    [10, skipHoldState, 0, 'hold', 0, 'release'],
    [10, skipReleaseState, 0, 'hold', 0, 'rest'],
    [10, allStagesHaveTimeState, 0, 'decay', 1, 'decay'],
    [10, allStagesHaveTimeState, 0.6, 'decay', 1, 'decay'],
    [10, allStagesHaveTimeState, 0.7, 'decay', 1, 'sustain'],
    [10, skipAttackAndHoldState, 0.6, 'decay', 1, 'decay'],
    [10, skipAttackAndHoldState, 0.7, 'decay', 1, 'sustain'],
    [10, skipAttackHoldAndDecayState, 0, 'decay', 1, 'sustain'],
    [10, skipAttackHoldAndDecayState, 0.7, 'decay', 1, 'sustain'],
    [10, skipAttackState, 0.6, 'decay', 1, 'decay'],
    [10, skipAttackState, 0.7, 'decay', 1, 'sustain'],
    [10, skipDecayState, 0.6, 'decay', 1, 'sustain'],
    [10, skipDecayState, 0.7, 'decay', 1, 'sustain'],
    [10, skipHoldAndDecayState, 0.6, 'decay', 1, 'sustain'],
    [10, skipHoldAndDecayState, 0.7, 'decay', 1, 'sustain'],
    [10, skipHoldState, 0.6, 'decay', 1, 'decay'],
    [10, skipHoldState, 0.7, 'decay', 1, 'sustain'],
    [10, skipReleaseState, 0.6, 'decay', 1, 'decay'],
    [10, skipReleaseState, 0.7, 'decay', 1, 'sustain'],
    [10, allStagesHaveTimeState, 0, 'decay', 0, 'release'],
    [10, skipAttackAndHoldState, 0, 'decay', 0, 'release'],
    [10, skipAttackHoldAndDecayState, 0, 'decay', 0, 'release'],
    [10, skipAttackState, 0, 'decay', 0, 'release'],
    [10, skipDecayState, 2, 'decay', 0, 'release'],
    [10, skipReleaseState, 0, 'decay', 0, 'rest'],
    [10, allStagesHaveTimeState, 0, 'sustain', 1, 'sustain'],
    [10, skipAttackAndHoldState, 0, 'sustain', 1, 'sustain'],
    [10, skipAttackHoldAndDecayState, 0, 'sustain', 1, 'sustain'],
    [10, skipAttackState, 0, 'sustain', 1, 'sustain'],
    [10, skipDecayState, 0, 'sustain', 1, 'sustain'],
    [10, skipHoldAndDecayState, 0, 'sustain', 1, 'sustain'],
    [10, skipHoldState, 0, 'sustain', 1, 'sustain'],
    [10, skipReleaseState, 0, 'sustain', 1, 'sustain'],
    [10, allStagesHaveTimeState, 20, 'sustain', 1, 'sustain'],
    [10, allStagesHaveTimeState, 20, 'sustain', 0, 'release'],
    [10, skipReleaseState, 0, 'sustain', 0, 'rest'],
    [10, allStagesHaveTimeState, 0, 'release', 0, 'release'],
    [10, allStagesHaveTimeState, 1.1, 'release', 0, 'release'],
    [10, allStagesHaveTimeState, 1.2, 'release', 0, 'rest'],
    [10, skipReleaseState, 0, 'release', 0, 'rest'],
    [10, allStagesHaveTimeState, 0, 'release', 1, 'attack'],
    [10, skipAttackAndHoldState, 0, 'release', 1, 'decay'],
    [10, skipAttackHoldAndDecayState, 0, 'release', 1, 'sustain'],
    [10, skipAttackState, 0, 'release', 1, 'hold'],
    [10, skipDecayState, 0, 'release', 1, 'attack'],
    [10, skipReleaseState, 0, 'release', 1, 'attack'],
    [10, allStagesHaveTimeState, 0.3, 'release', 1, 'attack'],
    [10, skipAttackAndHoldState, 0, 'release', 1, 'decay'],
    [10, skipAttackAndHoldState, 2, 'release', 1, 'decay'],
    [10, skipAttackHoldAndDecayState, 0, 'release', 1, 'sustain'],
    [10, skipAttackState, 0, 'release', 1, 'hold'],
    [10, skipAttackState, 1, 'release', 1, 'hold'],
    [10, skipDecayState, 0, 'release', 1, 'attack'],
    [10, skipReleaseState, 0, 'release', 1, 'attack']
  ])(
    'transitions to the correct state. sample rate: %f, start state: %j, seconds since state transition: %f, start stage: %s, trigger value: %f, expected stage: %s',
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
