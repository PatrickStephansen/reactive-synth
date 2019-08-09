import { divideClockTicks } from './divide-clock-ticks';
import { extend } from '../jest-matchers/to-be-verbose';

extend(expect);

describe('divide clock ticks', () => {
  test.each([
    [
      {
        isTriggerHigh: false,
        wasTriggerHigh: false,
        attackDivisor: 1,
        releaseDivisor: 1,
        ticksPast: 0,
        tocksPast: 0,
        expectedOutput: 0,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'stay low when trigger low'
      },
      {
        isTriggerHigh: false,
        wasTriggerHigh: false,
        attackDivisor: 2,
        releaseDivisor: 1,
        ticksPast: 0,
        tocksPast: 0,
        expectedOutput: 0,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'stay low when trigger value low'
      },
      {
        isTriggerHigh: false,
        wasTriggerHigh: false,
        attackDivisor: 1,
        releaseDivisor: 1,
        ticksPast: 1,
        tocksPast: 0,
        expectedOutput: 0,
        expectedTicksPast: 1,
        expectedTocksPast: 0,
        description:
          'stay low when trigger low, preserve ticks even if over divisor in case divisor changes'
      },
      {
        isTriggerHigh: false,
        wasTriggerHigh: false,
        attackDivisor: 1,
        releaseDivisor: 1,
        ticksPast: 2,
        tocksPast: 0,
        expectedOutput: 0,
        expectedTicksPast: 2,
        expectedTocksPast: 0,
        description:
          'stay low when trigger low, preserve ticks even if over divisor in case divisor changes'
      },
      {
        isTriggerHigh: false,
        wasTriggerHigh: false,
        attackDivisor: 2,
        releaseDivisor: 1,
        ticksPast: 1,
        tocksPast: 0,
        expectedOutput: 0,
        expectedTicksPast: 1,
        expectedTocksPast: 0,
        description: 'stay low when trigger low, keep ticks'
      },
      {
        isTriggerHigh: false,
        wasTriggerHigh: false,
        attackDivisor: 1,
        releaseDivisor: 1,
        ticksPast: 0,
        tocksPast: 1,
        expectedOutput: 0,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'stay low when trigger low, tocks should always be 0 when low'
      },
      {
        isTriggerHigh: false,
        wasTriggerHigh: false,
        attackDivisor: 1,
        releaseDivisor: 1,
        ticksPast: 0,
        tocksPast: 2,
        expectedOutput: 0,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'stay low when trigger low, tocks should always be 0 when low'
      },
      {
        isTriggerHigh: false,
        wasTriggerHigh: false,
        attackDivisor: 1,
        releaseDivisor: 2,
        ticksPast: 0,
        tocksPast: 2,
        expectedOutput: 0,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'stay low when trigger low, tocks should always be 0 when low'
      },
      {
        isTriggerHigh: false,
        wasTriggerHigh: false,
        attackDivisor: 1,
        releaseDivisor: 2,
        ticksPast: 0,
        tocksPast: 1,
        expectedOutput: 1,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'stay high when trigger low but releaseDivisor not reached'
      },
      {
        isTriggerHigh: false,
        wasTriggerHigh: false,
        attackDivisor: 1,
        releaseDivisor: 3,
        ticksPast: 0,
        tocksPast: 2,
        expectedOutput: 1,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'stay high when trigger low but releaseDivisor not reached'
      },
      {
        isTriggerHigh: true,
        wasTriggerHigh: false,
        attackDivisor: 1,
        releaseDivisor: 1,
        ticksPast: 0,
        tocksPast: 0,
        expectedOutput: 1,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'attack on every trigger when attackDivisor 1'
      },
      {
        isTriggerHigh: true,
        wasTriggerHigh: false,
        attackDivisor: 2,
        releaseDivisor: 1,
        ticksPast: 0,
        tocksPast: 0,
        expectedOutput: 0,
        expectedTicksPast: 1,
        expectedTocksPast: 0,
        description: 'increment ticks on trigger when attackDivisor not yet reached'
      },
      {
        isTriggerHigh: true,
        wasTriggerHigh: false,
        attackDivisor: 3,
        releaseDivisor: 1,
        ticksPast: 0,
        tocksPast: 0,
        expectedOutput: 0,
        expectedTicksPast: 1,
        expectedTocksPast: 0,
        description: 'increment ticks on trigger when attackDivisor not yet reached'
      },
      {
        isTriggerHigh: true,
        wasTriggerHigh: false,
        attackDivisor: 2,
        releaseDivisor: 2,
        ticksPast: 0,
        tocksPast: 0,
        expectedOutput: 0,
        expectedTicksPast: 1,
        expectedTocksPast: 0,
        description: 'increment ticks on trigger when attackDivisor not yet reached'
      },
      {
        isTriggerHigh: true,
        wasTriggerHigh: false,
        attackDivisor: 1,
        releaseDivisor: 1,
        ticksPast: 1,
        tocksPast: 0,
        expectedOutput: 1,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'attack on every trigger when attackDivisor 1, reset ticks on attack'
      },
      {
        isTriggerHigh: true,
        wasTriggerHigh: false,
        attackDivisor: 1,
        releaseDivisor: 1,
        ticksPast: 3,
        tocksPast: 0,
        expectedOutput: 1,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'attack on every trigger when attackDivisor 1, reset ticks on attack'
      },
      {
        isTriggerHigh: true,
        wasTriggerHigh: false,
        attackDivisor: 2,
        releaseDivisor: 1,
        ticksPast: 3,
        tocksPast: 0,
        expectedOutput: 1,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'attack on trigger when attackDivisor reached, reset ticks on attack'
      },
      {
        isTriggerHigh: true,
        wasTriggerHigh: false,
        attackDivisor: 4,
        releaseDivisor: 1,
        ticksPast: 3,
        tocksPast: 0,
        expectedOutput: 1,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'attack on trigger when attackDivisor reached, reset ticks on attack'
      },
      {
        isTriggerHigh: true,
        wasTriggerHigh: false,
        attackDivisor: 3,
        releaseDivisor: 1,
        ticksPast: 1,
        tocksPast: 0,
        expectedOutput: 0,
        expectedTicksPast: 2,
        expectedTocksPast: 0,
        description: 'increment ticks on trigger when attackDivisor not yet reached'
      },
      {
        isTriggerHigh: true,
        wasTriggerHigh: false,
        attackDivisor: 3,
        releaseDivisor: 1,
        ticksPast: 2,
        tocksPast: 0,
        expectedOutput: 1,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'attack on trigger when attackDivisor reached'
      },
      {
        isTriggerHigh: true,
        wasTriggerHigh: false,
        attackDivisor: 1,
        releaseDivisor: 1,
        ticksPast: 0,
        tocksPast: 1,
        expectedOutput: 1,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'attack on every trigger when attackDivisor 1, reset tocks on attack'
      },
      {
        isTriggerHigh: true,
        wasTriggerHigh: false,
        attackDivisor: 1,
        releaseDivisor: 1,
        ticksPast: 0,
        tocksPast: 2,
        expectedOutput: 1,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'attack on every trigger when attackDivisor 1, reset tocks on attack'
      },
      {
        isTriggerHigh: true,
        wasTriggerHigh: false,
        attackDivisor: 1,
        releaseDivisor: 2,
        ticksPast: 0,
        tocksPast: 2,
        expectedOutput: 1,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'attack on every trigger when attackDivisor 1, reset tocks on attack'
      },
      {
        isTriggerHigh: true,
        wasTriggerHigh: false,
        attackDivisor: 2,
        releaseDivisor: 1,
        ticksPast: 1,
        tocksPast: 0,
        expectedOutput: 1,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'attack on trigger when attackDivisor reached'
      },
      {
        isTriggerHigh: true,
        wasTriggerHigh: false,
        attackDivisor: 2,
        releaseDivisor: 1,
        ticksPast: 0,
        tocksPast: 1,
        expectedOutput: 0,
        expectedTicksPast: 1,
        expectedTocksPast: 0,
        description: 'increment ticks on trigger when attackDivisor not yet reached, tocks 0 on low'
      },
      {
        isTriggerHigh: false,
        wasTriggerHigh: true,
        attackDivisor: 1,
        releaseDivisor: 1,
        ticksPast: 0,
        tocksPast: 0,
        expectedOutput: 0,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'release on every trigger release when releaseDivisor 1'
      },
      {
        isTriggerHigh: false,
        wasTriggerHigh: true,
        attackDivisor: 2,
        releaseDivisor: 1,
        ticksPast: 0,
        tocksPast: 0,
        expectedOutput: 0,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'release on every trigger release when releaseDivisor 1'
      },
      {
        isTriggerHigh: false,
        wasTriggerHigh: true,
        attackDivisor: 2,
        releaseDivisor: 2,
        ticksPast: 0,
        tocksPast: 0,
        expectedOutput: 1,
        expectedTicksPast: 0,
        expectedTocksPast: 1,
        description: 'increment tocks on trigger release when releaseDivisor not yet reached'
      },
      {
        isTriggerHigh: false,
        wasTriggerHigh: true,
        attackDivisor: 1,
        releaseDivisor: 3,
        ticksPast: 0,
        tocksPast: 0,
        expectedOutput: 1,
        expectedTicksPast: 0,
        expectedTocksPast: 1,
        description: 'increment tocks on trigger release when releaseDivisor not yet reached'
      },
      {
        isTriggerHigh: false,
        wasTriggerHigh: true,
        attackDivisor: 1,
        releaseDivisor: 2,
        ticksPast: 0,
        tocksPast: 1,
        expectedOutput: 0,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'realease on trigger release when releaseDivisor reached'
      },
      {
        isTriggerHigh: false,
        wasTriggerHigh: true,
        attackDivisor: 1,
        releaseDivisor: 2,
        ticksPast: 0,
        tocksPast: 5,
        expectedOutput: 0,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'realease on trigger release when releaseDivisor reached'
      },
      {
        isTriggerHigh: true,
        wasTriggerHigh: true,
        attackDivisor: 1,
        releaseDivisor: 1,
        ticksPast: 0,
        tocksPast: 0,
        expectedOutput: 1,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'stay high when trigger high'
      },
      {
        isTriggerHigh: true,
        wasTriggerHigh: true,
        attackDivisor: 2,
        releaseDivisor: 1,
        ticksPast: 0,
        tocksPast: 0,
        expectedOutput: 1,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'stay high when trigger high'
      },

      {
        isTriggerHigh: true,
        wasTriggerHigh: true,
        attackDivisor: 1,
        releaseDivisor: 1,
        ticksPast: 1,
        tocksPast: 0,
        expectedOutput: 1,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'stay high when trigger high, ticks always 0 when high'
      },
      {
        isTriggerHigh: true,
        wasTriggerHigh: true,
        attackDivisor: 2,
        releaseDivisor: 1,
        ticksPast: 3,
        tocksPast: 0,
        expectedOutput: 1,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'stay high when trigger high, ticks always 0 when high'
      },
      {
        isTriggerHigh: true,
        wasTriggerHigh: true,
        attackDivisor: 1,
        releaseDivisor: 1,
        ticksPast: 0,
        tocksPast: 1,
        expectedOutput: 1,
        expectedTicksPast: 0,
        expectedTocksPast: 1,
        description:
          'stay high when trigger high, preserve tocks even if they seem to indicate a realease was missed'
      },
      {
        isTriggerHigh: true,
        wasTriggerHigh: true,
        attackDivisor: 2,
        releaseDivisor: 1,
        ticksPast: 0,
        tocksPast: 1,
        expectedOutput: 1,
        expectedTicksPast: 0,
        expectedTocksPast: 1,
        description:
          'stay high when trigger high, preserve tocks even if they seem to indicate a realease was missed'
      },
      {
        isTriggerHigh: true,
        wasTriggerHigh: true,
        attackDivisor: 2,
        releaseDivisor: 1,
        ticksPast: 1,
        tocksPast: 0,
        expectedOutput: 1,
        expectedTicksPast: 0,
        expectedTocksPast: 0,
        description: 'stay high when trigger high, ticks always 0 when high'
      },
      {
        isTriggerHigh: true,
        wasTriggerHigh: true,
        attackDivisor: 2,
        releaseDivisor: 1,
        ticksPast: 1,
        tocksPast: 1,
        expectedOutput: 1,
        expectedTicksPast: 0,
        expectedTocksPast: 1,
        description:
          'stay high when trigger high, ticks always 0 when high, preserve tocks even if they seem to indicate a realease was missed'
      },

    ]
  ])('works. case: %j', testCase => {
    const {
      isTriggerHigh,
      wasTriggerHigh,
      attackDivisor,
      releaseDivisor,
      ticksPast,
      tocksPast,
      expectedOutput,
      expectedTicksPast,
      expectedTocksPast,
      description
    } = testCase;

    const result = divideClockTicks(
      isTriggerHigh,
      wasTriggerHigh,
      attackDivisor,
      releaseDivisor,
      ticksPast,
      tocksPast
    );
    expect(result.clockOutput).toBeVerbose(expectedOutput, description);
    expect(result.ticksPast).toBeVerbose(expectedTicksPast, description);
    expect(result.tocksPast).toBeVerbose(expectedTocksPast, description);
  });
});
