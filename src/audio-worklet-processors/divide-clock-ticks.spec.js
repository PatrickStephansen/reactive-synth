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
});
