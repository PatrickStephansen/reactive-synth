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
    [10, allStagesHaveTimeState, 0, 'rest', 0, 'rest', 0.1, 0],
    [10, skipAttackHoldAndDecayState, 0, 'rest', 0, 'rest', 0.1, 0],
    [10, skipAttackHoldAndDecayState, 1, 'rest', 0, 'rest', 1.1, 0],
    [10, allStagesHaveTimeState, 0, 'rest', 1, 'attack', 0.1, 0.5],
    [10, allStagesHaveTimeState, 2, 'rest', 1, 'attack', 0.1, 0.5],
    [5, allStagesHaveTimeState, 2, 'rest', 1, 'hold', 0, 0],
    [2, allStagesHaveTimeState, 2, 'rest', 1, 'decay', 0, 0],
    [0.5, allStagesHaveTimeState, 2, 'rest', 1, 'sustain', 0.8, 0],
    [10, skipAttackState, 0, 'rest', 1, 'hold', 0.1, 1 / 3],
    [10, skipAttackAndHoldState, 0, 'rest', 1, 'decay', 0.1, 1 / 3],
    [10, skipAttackHoldAndDecayState, 0, 'rest', 1, 'sustain', 0.1, 0],
    [10, allStagesHaveTimeState, 0, 'attack', 1, 'attack', 0.1, 0.5],
    [10, allStagesHaveTimeState, 0.1, 'attack', 1, 'hold', 0, 0],
    [10, allStagesHaveTimeState, 0.3, 'attack', 1, 'hold', 0.2, 1 / 3],
    [10, allStagesHaveTimeState, 0.5, 'attack', 1, 'decay', 0.3, 3 / 7],
    [10, allStagesHaveTimeState, 1, 'attack', 1, 'decay', 0.6, 6 / 7],
    [10, allStagesHaveTimeState, 1.1, 'attack', 1, 'sustain', 0, 0],
    [5, allStagesHaveTimeState, 0, 'attack', 1, 'hold', 0, 0],
    [5, allStagesHaveTimeState, 0.5, 'attack', 1, 'decay', 0.2, 2 / 3],
    [2, allStagesHaveTimeState, 0, 'attack', 1, 'decay', 0, 0],
    [5, allStagesHaveTimeState, 1, 'attack', 1, 'sustain', 0.3, 0],
    [0.5, allStagesHaveTimeState, 0, 'attack', 1, 'sustain', 0.8, 0],
    [10, allStagesHaveTimeState, 0.2, 'attack', 0, 'release', 0.1, 1 / 12],
    [10, skipAttackState, 0.2, 'attack', 0, 'release', 0.1, 1 / 12],
    [10, skipAttackAndHoldState, 0.2, 'attack', 0, 'release', 0.1, 1 / 12],
    [10, skipAttackHoldAndDecayState, 0.2, 'attack', 0, 'release', 0.1, 1 / 12],
    [10, skipDecayState, 0.2, 'attack', 0, 'release', 0.1, 1 / 12],
    [10, skipHoldAndDecayState, 0.2, 'attack', 0, 'release', 0.1, 1 / 12],
    [10, skipHoldState, 0.2, 'attack', 0, 'release', 0.1, 1 / 12],
    [10, skipReleaseState, 0.1, 'attack', 0, 'rest', 0.1, 0],
    [10, skipAttackState, 0.1, 'attack', 1, 'hold', 0.2, 2 / 3],
    [10, skipAttackState, 0.2, 'attack', 1, 'decay', 0, 0],
    [10, skipAttackState, 0.3, 'attack', 1, 'decay', 0.1, 1 / 7],
    [10, skipAttackState, 0.9, 'attack', 1, 'sustain', 0, 0],
    [10, skipAttackState, 1, 'attack', 1, 'sustain', 0.1, 0],
    [10, skipAttackAndHoldState, 0.1, 'attack', 1, 'decay', 0.2, 2 / 7],
    [10, skipAttackAndHoldState, 0.6, 'attack', 1, 'sustain', 0, 0],
    [10, skipAttackAndHoldState, 0.7, 'attack', 1, 'sustain', 0.1, 0],
    [10, skipAttackHoldAndDecayState, 1.1, 'attack', 1, 'sustain', 1.2, 0],
    [10, allStagesHaveTimeState, 0.1, 'hold', 1, 'hold', 0.2, 2 / 3],
    [10, allStagesHaveTimeState, 0.2, 'hold', 1, 'decay', 0, 0],
    [10, allStagesHaveTimeState, 0.3, 'hold', 1, 'decay', 0.1, 1 / 7],
    [10, allStagesHaveTimeState, 0.8, 'hold', 1, 'decay', 0.6, 6 / 7],
    [10, allStagesHaveTimeState, 0.9, 'hold', 1, 'sustain', 0, 0],
    [10, skipAttackAndHoldState, 0, 'hold', 1, 'decay', 0.1, 1 / 7],
    [10, skipAttackAndHoldState, 0.6, 'hold', 1, 'sustain', 0, 0],
    [10, skipAttackAndHoldState, 0.7, 'hold', 1, 'sustain', 0.1, 0],
    [10, skipAttackHoldAndDecayState, 0, 'hold', 1, 'sustain', 0.1, 0],
    [10, skipAttackState, 0.1, 'hold', 1, 'hold', 0.2, 2 / 3],
    [10, skipAttackState, 0.2, 'hold', 1, 'decay', 0, 0],
    [10, skipDecayState, 0.2, 'hold', 1, 'sustain', 0, 0],
    [10, skipHoldAndDecayState, 0, 'hold', 1, 'sustain', 0.1, 0],
    [10, skipHoldState, 0, 'hold', 1, 'decay', 0.1, 1 / 7],
    [10, skipHoldState, 0.7, 'hold', 1, 'sustain', 0.1, 0],
    [2, allStagesHaveTimeState, 0, 'hold', 1, 'decay', 0.2, 2 / 7],
    [2, allStagesHaveTimeState, 0.1, 'hold', 1, 'decay', 0.3, 3 / 7],
    [2, allStagesHaveTimeState, 0.4, 'hold', 1, 'decay', 0.6, 6 / 7],
    [2, allStagesHaveTimeState, 0.5, 'hold', 1, 'sustain', 0, 0],
    [1, allStagesHaveTimeState, 0, 'hold', 1, 'sustain', 0, 0],
    [10, allStagesHaveTimeState, 0, 'hold', 0, 'release', 0.1, 1 / 12],
    [10, allStagesHaveTimeState, 10, 'hold', 0, 'release', 0.1, 1 / 12],
    [10, skipAttackAndHoldState, 0, 'hold', 0, 'release', 0.1, 1 / 12],
    [10, skipAttackHoldAndDecayState, 0, 'hold', 0, 'release', 0.1, 1 / 12],
    [10, skipAttackState, 0, 'hold', 0, 'release', 0.1, 1 / 12],
    [10, skipDecayState, 0, 'hold', 0, 'release', 0.1, 1 / 12],
    [10, skipHoldAndDecayState, 0, 'hold', 0, 'release', 0.1, 1 / 12],
    [10, skipHoldState, 0, 'hold', 0, 'release', 0.1, 1 / 12],
    [10, skipReleaseState, 0, 'hold', 0, 'rest', 0.1, 0],
    [10, allStagesHaveTimeState, 0, 'decay', 1, 'decay', 0.1, 1 / 7],
    [10, allStagesHaveTimeState, 0.5, 'decay', 1, 'decay', 0.6, 6 / 7],
    [10, allStagesHaveTimeState, 0.6, 'decay', 1, 'sustain', 0, 0],
    [10, skipAttackAndHoldState, 0.5, 'decay', 1, 'decay', 0.6, 6 / 7],
    [10, skipAttackAndHoldState, 0.6, 'decay', 1, 'sustain', 0, 0],
    [10, skipAttackHoldAndDecayState, 0, 'decay', 1, 'sustain', 0.1, 0],
    [10, skipAttackHoldAndDecayState, 0.6, 'decay', 1, 'sustain', 0.7, 0],
    [10, skipAttackHoldAndDecayState, 0.7, 'decay', 1, 'sustain', 0.8, 0],
    [10, skipAttackState, 0.5, 'decay', 1, 'decay', 0.6, 6 / 7],
    [10, skipAttackState, 0.6, 'decay', 1, 'sustain', 0, 0],
    [10, skipDecayState, 0.5, 'decay', 1, 'sustain', 0.6, 0],
    [10, skipDecayState, 0.6, 'decay', 1, 'sustain', 0.7, 0],
    [10, skipHoldAndDecayState, 0.5, 'decay', 1, 'sustain', 0.6, 0],
    [10, skipHoldAndDecayState, 0.6, 'decay', 1, 'sustain', 0.7, 0],
    [10, skipHoldState, 0.5, 'decay', 1, 'decay', 0.6, 6 / 7],
    [10, skipHoldState, 0.6, 'decay', 1, 'sustain', 0, 0],
    [10, skipReleaseState, 0.5, 'decay', 1, 'decay', 0.6, 6 / 7],
    [10, skipReleaseState, 0.6, 'decay', 1, 'sustain', 0, 0],
    [5, allStagesHaveTimeState, 0, 'decay', 1, 'decay', 0.2, 2 / 7],
    [5, allStagesHaveTimeState, 0.4, 'decay', 1, 'decay', 0.6, 6 / 7],
    [5, allStagesHaveTimeState, 0.5, 'decay', 1, 'sustain', 0, 0],
    [1, allStagesHaveTimeState, 0, 'decay', 1, 'sustain', 0.3, 0],
    [10, allStagesHaveTimeState, 0, 'decay', 0, 'release', 0.1, 1 / 12],
    [10, skipAttackAndHoldState, 0, 'decay', 0, 'release', 0.1, 1 / 12],
    [10, skipAttackHoldAndDecayState, 0, 'decay', 0, 'release', 0.1, 1 / 12],
    [10, skipAttackState, 0, 'decay', 0, 'release', 0.1, 1 / 12],
    [10, skipDecayState, 2, 'decay', 0, 'release', 0.1, 1 / 12],
    [10, skipReleaseState, 0, 'decay', 0, 'rest', 0.1, 0],
    [10, allStagesHaveTimeState, 0, 'sustain', 1, 'sustain', 0.1, 0],
    [10, skipAttackAndHoldState, 0, 'sustain', 1, 'sustain', 0.1, 0],
    [10, skipAttackHoldAndDecayState, 0, 'sustain', 1, 'sustain', 0.1, 0],
    [10, skipAttackState, 0, 'sustain', 1, 'sustain', 0.1, 0],
    [10, skipDecayState, 0, 'sustain', 1, 'sustain', 0.1, 0],
    [10, skipHoldAndDecayState, 0, 'sustain', 1, 'sustain', 0.1, 0],
    [10, skipHoldState, 0, 'sustain', 1, 'sustain', 0.1, 0],
    [10, skipReleaseState, 0, 'sustain', 1, 'sustain', 0.1, 0],
    [10, allStagesHaveTimeState, 20, 'sustain', 1, 'sustain', 20.1, 0],
    [10, allStagesHaveTimeState, 20, 'sustain', 0, 'release', 0.1, 1 / 12],
    [10, skipReleaseState, 0, 'sustain', 0, 'rest', 0.1, 0],
    [10, allStagesHaveTimeState, 0, 'release', 0, 'release', 0.1, 1 / 12],
    [10, allStagesHaveTimeState, 1, 'release', 0, 'release', 1.1, 11 / 12],
    [10, allStagesHaveTimeState, 1.1, 'release', 0, 'rest', 0, 0],
    [5, allStagesHaveTimeState, 0, 'release', 0, 'release', 0.2, 1 / 6],
    [5, allStagesHaveTimeState, 0.9, 'release', 0, 'release', 1.1, 11 / 12],
    [5, allStagesHaveTimeState, 1, 'release', 0, 'rest', 0, 0],
    [0.5, allStagesHaveTimeState, 0, 'release', 0, 'rest', 0.8, 0],
    [10, skipReleaseState, 0, 'release', 0, 'rest', 0.1, 0],
    [10, allStagesHaveTimeState, 0, 'release', 1, 'attack', 0.1, 0.5],
    [5, allStagesHaveTimeState, 0, 'release', 1, 'hold', 0, 0],
    [0.5, allStagesHaveTimeState, 0, 'release', 1, 'sustain', 0.8, 0],
    [10, skipAttackAndHoldState, 0, 'release', 1, 'decay', 0.1, 1 / 7],
    [10, skipAttackHoldAndDecayState, 0, 'release', 1, 'sustain', 0.1, 0],
    [10, skipAttackState, 0, 'release', 1, 'hold', 0.1, 1 / 3],
    [10, skipDecayState, 0, 'release', 1, 'attack', 0.1, 0.5],
    [10, skipReleaseState, 0, 'release', 1, 'attack', 0.1, 0.5],
    [10, allStagesHaveTimeState, 0.3, 'release', 1, 'attack', 0.1, 0.5],
    [10, skipAttackAndHoldState, 0, 'release', 1, 'decay', 0.1, 1 / 7],
    [10, skipAttackAndHoldState, 2, 'release', 1, 'decay', 0.1, 1 / 7],
    [10, skipAttackHoldAndDecayState, 0, 'release', 1, 'sustain', 0.1, 0],
    [10, skipAttackState, 0, 'release', 1, 'hold', 0.1, 1 / 3],
    [2, skipAttackState, 0, 'release', 1, 'decay', 0.2, 2 / 7],
    [10, skipAttackState, 1, 'release', 1, 'hold', 0.1, 1 / 3],
    [10, skipDecayState, 0, 'release', 1, 'attack', 0.1, 0.5],
    [10, skipReleaseState, 0, 'release', 1, 'attack', 0.1, 0.5]
  ])(
    'transitions to the correct state. sample rate: %f, start state: %j, seconds since state transition: %f, start stage: %s, trigger value: %f, expected stage: %s, expected stage progress: %s',
    (
      sampleRate,
      state,
      secondsSinceStateTransition,
      stage,
      inputSample,
      expectedStage,
      expectedSecondsSinceStateTransitions,
      expectedStageProgress
    ) => {
      const result = getEnvelopeValue(
        sampleRate,
        state,
        secondsSinceStateTransition,
        stage,
        inputSample
      );
      expect(result.stage).toBe(expectedStage);
      expect(result.secondsSinceStateTransition).toBeCloseTo(
        expectedSecondsSinceStateTransitions,
        0.00000001
      );
      expect(result.stageProgress).toBeCloseTo(
        expectedStageProgress,
        0.00000001
      );
    }
  );
});
