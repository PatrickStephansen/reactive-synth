export type ScalingStrategy = (
  value: number,
  maximum: number,
  maximumScaled: number
) => number;

export const linearScalingStrategy: ScalingStrategy = (
  value,
  maximum,
  maximumScaled
) => (maximumScaled * value) / maximum;

export const logarithmicScalingStrategy: ScalingStrategy = (
  value,
  maximum,
  maximumScaled
) => value * Math.max(0, Math.log2(maximumScaled) / Math.log2(maximum));
