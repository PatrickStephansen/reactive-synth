// tick = low to high (attack)
// tock = high to low (release)
export function divideClockTicks(
  isTriggerHigh,
  wasTriggerHigh,
  attackDivisor,
  releaseDivisor,
  ticksPast,
  tocksPast
) {
  const tick = 1;
  const tock = 0;
  let clockOutput = undefined;
  if (attackDivisor === 0 && previousOutput === tock) {
    clockOutput = tick;
    ticksPast = 0;
  }
  if (releaseDivisor === 0 && previousOutput === tick) {
    clockOutput = tock;
    tocksPast = 0;
  }
  return {
    clockOutput,
    ticksPast,
    tocksPast
  };
}
