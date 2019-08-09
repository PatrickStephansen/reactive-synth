export const clockInTriggerStages = {
  attack: 1,
  high: 2,
  release: 3,
  low: 4
};

export const clockStages = {
  tick: 1,
  tock: 0
};

export const resetTriggerStages = {
  reset: 1,
  keepGoing: 0
};

export function divideClockTicks(
  { stage, ticksPast, tocksPast },
  { attackAfterTicks, releaseAfterTocks },
  clockInStage,
  resetTriggerStage
) {
  if (
    clockInStage === clockInTriggerStages.attack &&
    stage === clockStages.tock &&
    ticksPast + 1 >= attackAfterTicks
  ) {
    return {
      stage: clockStages.tick,
      ticksPast: ticksPast + 1 - attackAfterTicks,
      tocksPast: tocksPast
    };
  }
  if (
    clockInStage === clockInTriggerStages.release &&
    stage === clockStages.tick &&
    tocksPast + 1 >= releaseAfterTocks
  ) {
    return {
      stage: clockStages.tock,
      ticksPast: ticksPast,
      tocksPast: tocksPast + 1 - releaseAfterTocks
    };
  }
  return { stage, ticksPast, tocksPast };
}
