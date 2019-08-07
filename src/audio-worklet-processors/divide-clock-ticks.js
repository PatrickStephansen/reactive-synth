// high trigger value is tick, low is tock
export function divideClockTicks(
  isTriggerHigh,
  wasTriggerHigh,
  tickDivisor,
  tockDivisor,
  ticksPast,
  tocksPast,
  previousOutput
) {
  const tick = 1;
  const tock = 0;
  let clockOutput = undefined;
  if (tickDivisor === 0 && previousOutput === tock) {
    clockOutput = tick;
    ticksPast = 0;
  }
  if (tockDivisor === 0 && previousOutput === tick) {
    clockOutput = tock;
    tocksPast = 0;
  }
  return {
    clockOutput,
    ticksPast,
    tocksPast
  };
}
