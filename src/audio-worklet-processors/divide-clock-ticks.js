import { compose } from 'ramda';

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
  if (resetTriggerStage === resetTriggerStages.reset) {
    stage = clockStages.tock;
    tocksPast = 0;
    ticksPast = attackAfterTicks - 1;
  }
  if (clockInStage === clockInTriggerStages.attack && stage === clockStages.tock) {
    ticksPast++;
    if (ticksPast >= attackAfterTicks) {
      stage = clockStages.tick;
      ticksPast -= attackAfterTicks;
    }
  }
  if (clockInStage === clockInTriggerStages.release && stage === clockStages.tick) {
    tocksPast++;
    if (tocksPast >= releaseAfterTocks) {
      stage = clockStages.tock;
      tocksPast -= releaseAfterTocks;
    }
  }
  return { stage, ticksPast, tocksPast };
}
