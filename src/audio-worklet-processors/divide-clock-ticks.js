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
  state, // { stage, ticksPast, tocksPast },
  { attackAfterTicks, releaseAfterTocks, ticksOnReset, tocksOnReset },
  clockInStage,
  resetTriggerStage
) {
  if (resetTriggerStage === resetTriggerStages.reset) {
    state.stage = clockStages.tock;
    state.tocksPast = tocksOnReset;
    state.ticksPast = ticksOnReset;
  }
  if (clockInStage === clockInTriggerStages.attack && state.stage === clockStages.tock) {
    state.ticksPast++;
    if (state.ticksPast >= attackAfterTicks) {
      state.stage = clockStages.tick;
      state.ticksPast -= attackAfterTicks;
    }
  }
  if (clockInStage === clockInTriggerStages.release && state.stage === clockStages.tick) {
    state.tocksPast++;
    if (state.tocksPast >= releaseAfterTocks) {
      state.stage = clockStages.tock;
      state.tocksPast -= releaseAfterTocks;
    }
  }
  return state;
}
