import { divideClockTicks } from './divide-clock-ticks';
import { extend } from '../jest-matchers/to-be-verbose';

extend(expect);

describe('divide clock ticks', () => {
  test.each([
    [
      {
        isTriggerHigh: 0,
        wasTriggerHigh: 0,
        tickDivisor: 0,
        tockDivisor: 0,
        ticksPast: 0,
        tocksPast: 0,
        previousOutput: 0,
        expectedOutput: 1,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'low to high immediately when tickDivisor 0'
      },
      {
        isTriggerHigh: 0,
        wasTriggerHigh: 0,
        tickDivisor: 0,
        tockDivisor: 0,
        ticksPast: 0,
        tocksPast: 0,
        previousOutput: 1,
        expectedOutput: 0,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'high to low immediately when tockDivisor 0'
      }
    ]
  ])('works. case: %j', testCase => {
    const {
      isTriggerHigh,
      wasTriggerHigh,
      tickDivisor,
      tockDivisor,
      ticksPast,
      tocksPast,
      previousOutput,
      expectedOutput,
      expectedTicksPast,
      expectedTocksPast,
      description
    } = testCase;

    const result = divideClockTicks(
      isTriggerHigh,
      wasTriggerHigh,
      tickDivisor,
      tockDivisor,
      ticksPast,
      tocksPast,
      previousOutput
    );
    expect(result.clockOutput).toBeVerbose(expectedOutput, description);
    expect(result.ticksPast).toBeVerbose(expectedTicksPast, description);
    expect(result.tocksPast).toBeVerbose(expectedTocksPast, description);
  });
});
