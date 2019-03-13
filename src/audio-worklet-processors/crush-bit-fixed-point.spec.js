import { crush } from './crush-bit-fixed-point';

describe('crush-bit-fixed-point', () => {
  test.each([
    // 1 bit
    [2, 1, 0],
    [1, 1, 0],
    [0.51, 1, 0],
    [0, 1, 0],
    [-0.51, 1, -1],
    [-0.99, 1, -1],
    [-1, 1, -1],
    [-2, 1, -1],
    // 2 bit
    [2, 2, 0.5],
    [1, 2, 0.5],
    [0.51, 2, 0.5],
    [0.25, 2, 0],
    [0, 2, 0],
    [-0.25, 2, -0.5],
    [-0.51, 2, -1],
    [-1, 2, -1],
    [-2, 2, -1],
    // 3 bit
    [2, 3, 0.75],
    [1, 3, 0.75],
    [0.76, 3, 0.75],
    [0.75, 3, 0.75],
    [0.51, 3, 0.5],
    [0.5, 3, 0.5],
    [0.26, 3, 0.25],
    [0.25, 3, 0.25],
    [0, 3, 0],
    [-0.25, 3, -0.25],
    [-0.26, 3, -0.5],
    [-0.5, 3, -0.5],
    [-0.51, 3, -0.75],
    [-0.75, 3, -0.75],
    [-0.76, 3, -1],
    [-1, 3, -1],
    [-2, 3, -1],
    // 32 bit
    [2, 32, 0.9999999995343387],
    [1, 32, 0.9999999995343387],
    [0.75, 32, 0.75],
    [0.5, 32, 0.5],
    [0.25, 32, 0.25],
    [0, 32, 0],
    [-0.25, 32, -0.25],
    [-0.5, 32, -0.5],
    [-0.75, 32, -0.75],
    [-1, 32, -1],
    [-2, 32, -1]
  ])(
    'exact results at whole number bit depth. sample %f, depth %i, result %f ',
    (sample, bitDepth, expectedResult) => {
      expect(crush(sample, bitDepth)).toBe(expectedResult);
    }
  );

  test.each([
    [1, 1.2],
    [2, 1.2],
    [-1, 1.2],
    [1.2, 1.2],
    [-1.2, 1.2],
    [1, 1.9],
    [-1, 1.9],
    [1.9, 1.9],
    [-1.9, 1.9],
    [1.01, 2.9],
    [-1.01, 2.9],
    [-1.02, 2.9],
    [-0.99, 4.9],
    [-0.99, 2.1],
    [-1, 1.9],
    [-0.99, 1.9]
  ])(
    'results in bounds for fractional bits. sample %f, depth %f',
    (sample, bitDepth) => {
      expect(crush(sample, bitDepth)).toBeGreaterThanOrEqual(-1);
      expect(crush(sample, bitDepth)).toBeLessThanOrEqual(1);
    }
  );

  const increasing = [];
  for (let i = -1.05; i < 1.05; i += 0.01) {
    increasing.push(i);
  }

  test('values increase as inputs increase. sample %f, depth %f, increasing %p', () => {
    increasing.forEach((sample, index) => {
      if (index == 0) return;
      expect(crush(sample, 2.9)).toBeGreaterThanOrEqual(
        crush(increasing[index - 1], 2.9),
        sample
      );
    });
  });

  test('bit depth clamped to valid range [1, 32]', () => {
    increasing.forEach(sample => {
      expect(crush(sample, 0)).toBe(
        crush(sample, 1),
        `unexpected low bitDepth result ${crush(1, 0)}`
      );
      expect(crush(sample, -32)).toBe(
        crush(sample, 1),
        `unexpected low bitDepth result ${crush(1, -32)}`
      );
      expect(crush(sample, 33)).toBe(
        crush(sample, 32),
        `unexpected high bitDepth result ${crush(1, 32)}`
      );
    });
  });
});
