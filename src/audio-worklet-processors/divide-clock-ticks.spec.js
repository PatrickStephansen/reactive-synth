import {
  clockInTriggerStages,
  clockStages,
  divideClockTicks,
  resetTriggerStages
} from './divide-clock-ticks';
import { extend } from '../jest-matchers/to-be-verbose';

extend(expect);

const unityParams = { attackAfterTicks: 1, releaseAfterTocks: 1 };
const unevenParams = { attackAfterTicks: 2, releaseAfterTocks: 3 };
const realNumberParams = { attackAfterTicks: 2.33, releaseAfterTocks: 1.65 };

describe('divide clock ticks', () => {
  test.each([
    [
      { stage: clockStages.tock, ticksPast: 0, tocksPast: 0 },
      clockInTriggerStages.low,
      { stage: clockStages.tock, ticksPast: 0, tocksPast: 0 },
      'at rest'
    ],
    [
      { stage: clockStages.tock, ticksPast: 0.3, tocksPast: 0 },
      clockInTriggerStages.low,
      { stage: clockStages.tock, ticksPast: 0.3, tocksPast: 0 },
      'at rest with some tick fragment left over'
    ],
    [
      { stage: clockStages.tock, ticksPast: 3, tocksPast: 0 },
      clockInTriggerStages.low,
      { stage: clockStages.tock, ticksPast: 3, tocksPast: 0 },
      'at rest with some ticks left over'
    ],
    [
      { stage: clockStages.tock, ticksPast: 3, tocksPast: 0.4 },
      clockInTriggerStages.low,
      { stage: clockStages.tock, ticksPast: 3, tocksPast: 0.4 },
      'at rest with some ticks and tocks left over'
    ],
    [
      { stage: clockStages.tock, ticksPast: 3, tocksPast: 4 },
      clockInTriggerStages.low,
      { stage: clockStages.tock, ticksPast: 3, tocksPast: 4 },
      'at rest with some ticks and tocks left over'
    ],
    [
      { stage: clockStages.tock, ticksPast: 0, tocksPast: 0 },
      clockInTriggerStages.attack,
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 0 },
      'tick'
    ],
    [
      { stage: clockStages.tock, ticksPast: 0.2, tocksPast: 0 },
      clockInTriggerStages.attack,
      { stage: clockStages.tick, ticksPast: 0.2, tocksPast: 0 },
      'tick leaves remainder'
    ],
    [
      { stage: clockStages.tock, ticksPast: 2, tocksPast: 0 },
      clockInTriggerStages.attack,
      { stage: clockStages.tick, ticksPast: 2, tocksPast: 0 },
      'tick leaves large remainder'
    ],
    [
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 0 },
      clockInTriggerStages.high,
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 0 },
      'high'
    ],
    [
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 0 },
      clockInTriggerStages.release,
      { stage: clockStages.tock, ticksPast: 0, tocksPast: 0 },
      'tock'
    ]
  ])(
    'it should work with unity params. start state %j, clock in stage %f, expected output %j',
    (startState, clockInStage, expectedOutput, description) => {
      const result = divideClockTicks(
        startState,
        unityParams,
        clockInStage,
        resetTriggerStages.keepGoing
      );
      expect(result.stage).toBeVerbose(expectedOutput.stage, description);
      expect(result.ticksPast).toBeCloseToVerbose(expectedOutput.ticksPast, 1e-5, description);
      expect(result.tocksPast).toBeCloseToVerbose(expectedOutput.tocksPast, 1e-5, description);
    }
  );
  test.each([
    [
      { stage: clockStages.tock, ticksPast: 0, tocksPast: 0 },
      clockInTriggerStages.low,
      { stage: clockStages.tock, ticksPast: 0, tocksPast: 0 },
      'at rest'
    ],
    [
      { stage: clockStages.tock, ticksPast: 0, tocksPast: 0 },
      clockInTriggerStages.attack,
      { stage: clockStages.tock, ticksPast: 1, tocksPast: 0 },
      'increment ticks on attack'
    ],
    [
      { stage: clockStages.tock, ticksPast: 1, tocksPast: 0 },
      clockInTriggerStages.high,
      { stage: clockStages.tock, ticksPast: 1, tocksPast: 0 },
      'clock in stays high after tick'
    ],
    [
      { stage: clockStages.tock, ticksPast: 1, tocksPast: 0 },
      clockInTriggerStages.release,
      { stage: clockStages.tock, ticksPast: 1, tocksPast: 0 },
      'clock in releases after first after tick'
    ],
    [
      { stage: clockStages.tock, ticksPast: 1, tocksPast: 0 },
      clockInTriggerStages.attack,
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 0 },
      'second tick in'
    ],
    [
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 0 },
      clockInTriggerStages.high,
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 0 },
      'clock in high after second tick'
    ],
    [
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 0 },
      clockInTriggerStages.release,
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 1 },
      'increment tocks on release from high'
    ],
    [
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 1 },
      clockInTriggerStages.low,
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 1 },
      'clock in low after first tock'
    ],
    [
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 1 },
      clockInTriggerStages.attack,
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 1 },
      'ignore ticks while awaiting tocks'
    ],
    [
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 1 },
      clockInTriggerStages.high,
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 1 },
      'clock in still high after ignored tick'
    ],
    [
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 1 },
      clockInTriggerStages.release,
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 2 },
      'second tock'
    ],
    [
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 2 },
      clockInTriggerStages.low,
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 2 },
      'low after second tock'
    ],
    [
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 2 },
      clockInTriggerStages.attack,
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 2 },
      'ignore ticks while awaiting tocks again'
    ],
    [
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 2 },
      clockInTriggerStages.high,
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 2 },
      'high after ignored tick again'
    ],
    [
      { stage: clockStages.tick, ticksPast: 0, tocksPast: 2 },
      clockInTriggerStages.release,
      { stage: clockStages.tock, ticksPast: 0, tocksPast: 0 },
      'release on awaited tock'
    ]
  ])(
    'it should work with uneven params. start state %j, clock in stage %f, expected output %j',
    (startState, clockInStage, expectedOutput, description) => {
      const result = divideClockTicks(
        startState,
        unevenParams,
        clockInStage,
        resetTriggerStages.keepGoing
      );
      expect(result.stage).toBeVerbose(expectedOutput.stage, description);
      expect(result.ticksPast).toBeCloseToVerbose(expectedOutput.ticksPast, 1e-5, description);
      expect(result.tocksPast).toBeCloseToVerbose(expectedOutput.tocksPast, 1e-5, description);
    }
  );
  test.each([
    [
      { stage: clockStages.tock, ticksPast: 0, tocksPast: 0 },
      clockInTriggerStages.low,
      { stage: clockStages.tock, ticksPast: 0, tocksPast: 0 },
      'at rest'
    ],
    [
      { stage: clockStages.tock, ticksPast: 0, tocksPast: 0 },
      clockInTriggerStages.attack,
      { stage: clockStages.tock, ticksPast: 1, tocksPast: 0 },
      'first tick in'
    ],
    [
      { stage: clockStages.tock, ticksPast: 1, tocksPast: 0 },
      clockInTriggerStages.high,
      { stage: clockStages.tock, ticksPast: 1, tocksPast: 0 },
      'high after first tick in'
    ],
    [
      { stage: clockStages.tock, ticksPast: 1, tocksPast: 0 },
      clockInTriggerStages.release,
      { stage: clockStages.tock, ticksPast: 1, tocksPast: 0 },
      'ignored tock awaiting ticks'
    ],
    [
      { stage: clockStages.tock, ticksPast: 1, tocksPast: 0 },
      clockInTriggerStages.low,
      { stage: clockStages.tock, ticksPast: 1, tocksPast: 0 },
      'awaiting ticks but clock in low'
    ],
    [
      { stage: clockStages.tock, ticksPast: 1, tocksPast: 0 },
      clockInTriggerStages.attack,
      { stage: clockStages.tock, ticksPast: 2, tocksPast: 0 },
      'second tick in'
    ],
    [
      { stage: clockStages.tock, ticksPast: 2, tocksPast: 0 },
      clockInTriggerStages.attack,
      { stage: clockStages.tick, ticksPast: 0.67, tocksPast: 0 },
      'third tick in changes state and leaves remainder'
    ],
    [
      { stage: clockStages.tick, ticksPast: 0.67, tocksPast: 0 },
      clockInTriggerStages.high,
      { stage: clockStages.tick, ticksPast: 0.67, tocksPast: 0 },
      'nothing happens, all is well'
    ],
    [
      { stage: clockStages.tick, ticksPast: 0.67, tocksPast: 0 },
      clockInTriggerStages.release,
      { stage: clockStages.tick, ticksPast: 0.67, tocksPast: 1 },
      'first tock'
    ],
    [
      { stage: clockStages.tick, ticksPast: 0.67, tocksPast: 1 },
      clockInTriggerStages.low,
      { stage: clockStages.tick, ticksPast: 0.67, tocksPast: 1 },
      'clock in low after first tock'
    ],
    [
      { stage: clockStages.tick, ticksPast: 0.67, tocksPast: 1 },
      clockInTriggerStages.attack,
      { stage: clockStages.tick, ticksPast: 0.67, tocksPast: 1 },
      'ignored tick in awaiting tocks'
    ],
    [
      { stage: clockStages.tick, ticksPast: 0.67, tocksPast: 1 },
      clockInTriggerStages.high,
      { stage: clockStages.tick, ticksPast: 0.67, tocksPast: 1 },
      'high, about to tock'
    ],
    [
      { stage: clockStages.tick, ticksPast: 0.67, tocksPast: 1 },
      clockInTriggerStages.release,
      { stage: clockStages.tock, ticksPast: 0.67, tocksPast: 0.35 },
      'tock leaves remainder'
    ],
    [
      { stage: clockStages.tock, ticksPast: 0.67, tocksPast: 0.35 },
      clockInTriggerStages.attack,
      { stage: clockStages.tock, ticksPast: 1.67, tocksPast: 0.35 },
      'increment ticks'
    ],
    [
      { stage: clockStages.tock, ticksPast: 1.67, tocksPast: 0.35 },
      clockInTriggerStages.attack,
      { stage: clockStages.tick, ticksPast: 0.34, tocksPast: 0.35 },
      'second tick roll-over with remainder'
    ],
    [
      { stage: clockStages.tick, ticksPast: 0.34, tocksPast: 0.35 },
      clockInTriggerStages.high,
      { stage: clockStages.tick, ticksPast: 0.34, tocksPast: 0.35 },
      'more waiting'
    ],
    [
      { stage: clockStages.tick, ticksPast: 0.34, tocksPast: 0.35 },
      clockInTriggerStages.release,
      { stage: clockStages.tick, ticksPast: 0.34, tocksPast: 1.35 },
      'increment tocks again'
    ],
    [
      { stage: clockStages.tick, ticksPast: 0.34, tocksPast: 1.35 },
      clockInTriggerStages.release,
      { stage: clockStages.tock, ticksPast: 0.34, tocksPast: 0.7 },
      'tock again leaving remainder'
    ]
  ])(
    'it should work with real number params. start state %j, clock in stage %f, expected output %j',
    (startState, clockInStage, expectedOutput, description) => {
      const result = divideClockTicks(
        startState,
        realNumberParams,
        clockInStage,
        resetTriggerStages.keepGoing
      );
      expect(result.stage).toBeVerbose(expectedOutput.stage, description);
      expect(result.ticksPast).toBeCloseToVerbose(expectedOutput.ticksPast, 1e-5, description);
      expect(result.tocksPast).toBeCloseToVerbose(expectedOutput.tocksPast, 1e-5, description);
    }
  );

  describe('it should get ready for next tick when reset', () => {
    test('from tick stage', () => {
      const result = divideClockTicks(
        { stage: clockStages.tick, ticksPast: 0.99, tocksPast: 12 },
        { attackAfterTicks: 2, releaseAfterTocks: 15 },
        clockInTriggerStages.high,
        resetTriggerStages.reset
      );
      expect(result.stage).toBeVerbose(clockStages.tock, 'reset to tock');
      expect(result.ticksPast).toBeCloseToVerbose(
        1,
        1e-5,
        'ticks primed to change state on next tick'
      );
      expect(result.tocksPast).toBeCloseToVerbose(0, 1e-5, 'tocks reset to 0');
    });
    test('from tock stage', () => {
      const result = divideClockTicks(
        { stage: clockStages.tock, ticksPast: 0.99, tocksPast: 12 },
        { attackAfterTicks: 2, releaseAfterTocks: 15 },
        clockInTriggerStages.release,
        resetTriggerStages.reset
      );
      expect(result.stage).toBeVerbose(clockStages.tock, 'reset to tock');
      expect(result.ticksPast).toBeCloseToVerbose(
        1,
        1e-5,
        'ticks primed to change state on next tick'
      );
      expect(result.tocksPast).toBeCloseToVerbose(0, 1e-5, 'tocks reset to 0');
    });
    test('reset and attack on same sample', () => {
      const result = divideClockTicks(
        { stage: clockStages.tock, ticksPast: 0.77, tocksPast: 12 },
        { attackAfterTicks: 2, releaseAfterTocks: 15 },
        clockInTriggerStages.attack,
        resetTriggerStages.reset
      );
      expect(result.stage).toBeVerbose(clockStages.tick, 'play the tick immediately');
      expect(result.ticksPast).toBeCloseToVerbose(
        0,
        1e-5,
        'ticks reset to 0'
      );
      expect(result.tocksPast).toBeCloseToVerbose(0, 1e-5, 'tocks reset to 0');
    });

  });
});
