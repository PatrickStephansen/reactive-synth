export type ScalingStrategy = (value: number, maximum: number, maximumScaled: number) => number;

export const linearScalingStrategy: ScalingStrategy = (value, maximum, maximumScaled) =>
  (maximumScaled * value) / maximum;

export const logarithmicScalingStrategy: ScalingStrategy = (value, maximum, maximumScaled) =>
  (maximumScaled * Math.log(value + 1)) / Math.log(maximum + 1);
