import { extend } from '../jest-matchers/to-be-verbose';

import { crush } from './crush-bit-fixed-point';

extend(expect);

const quantizeEvenlyMode = 'quantize-evenly';
const continuousMode = 'continuous';
const trveMode = 'trve';
const modes = [quantizeEvenlyMode, continuousMode, trveMode];

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
      modes.forEach(mode => {
        expect(crush(sample, bitDepth, mode)).toBeVerbose(expectedResult, mode);
      });
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
      expect(
        crush(sample, bitDepth, quantizeEvenlyMode)
      ).toBeGreaterThanOrEqual(-1, quantizeEvenlyMode);
      modes.forEach(mode => {
        expect(crush(sample, bitDepth, mode)).toBeLessThanOrEqualVerbose(
          1,
          mode
        );
        expect(crush(sample, bitDepth, mode)).toBeGreaterThanOrEqualVerbose(
          -1,
          mode
        );
      });
    }
  );

  const increasingInputs = [];
  for (let i = -1.05; i < 1.05; i += 0.01) {
    increasingInputs.push(i);
  }

  test('values increase as inputs increase.', () => {
    increasingInputs.forEach((sample, index) => {
      if (index == 0) return;
      modes.forEach(mode => {
        expect(crush(sample, 2.9, mode)).toBeGreaterThanOrEqualVerbose(
          crush(increasingInputs[index - 1], 2.9, mode),
          `sample: ${sample}, mode: ${mode}`
        );
      });
    });
  });

  test('bit depth clamped to valid range [1, 32]', () => {
    increasingInputs.forEach(sample => {
      modes.forEach(mode => {
        expect(crush(sample, 0, mode)).toBeVerbose(
          crush(sample, 1),
          `unexpected low bitDepth result ${crush(1, 0)} in ${mode} mode`
        );
        expect(crush(sample, -32, mode)).toBeVerbose(
          crush(sample, 1),
          `unexpected low bitDepth result ${crush(1, -32)} in ${mode} mode`
        );
        expect(crush(sample, 33, mode)).toBeVerbose(
          crush(sample, 32),
          `unexpected high bitDepth result ${crush(1, 32)} in ${mode} mode`
        );
      });
    });
  });

  const increasingBitDepths = [];
  for (let i = 1; i < 32; i += 0.4) {
    increasingBitDepths.push(i);
  }

  test('trve mode quantizes output space evenly into 2^b parts where b is floor of bitrate', () => {
    increasingBitDepths.forEach(bitDepth => {
      increasingInputs.forEach(sample => {
        const result = crush(sample, bitDepth, trveMode);
        const normalizedResult = result / 2 + 1;
        expect(normalizedResult % 2 ** -Math.floor(bitDepth)).toBeVerbose(
          0,
          `Unexpected normalized output ${normalizedResult} for ${trveMode} mode at bitdepth ${bitDepth}`
        );
      });
    });
  });

  test.each([
    /* 3 possible values for some bit depth between 1 and 2 */
    [-1, 1.8, -1],
    [-0.2, 1.8, -1 + 2 / 3],
    [0.5, 1.8, 1 / 3],
    /* 5 possible values for some bit depth between 2 and 3 */
    [-1, 2.4, -1],
    [-0.59, 2.4, -1 + 2 / 5],
    [-0.18, 2.4, -1 + 4 / 5],
    [0.2, 2.4, -1 + 6 / 5],
    [0.8, 2.4, -1 + 8 / 5],
    /* 6 possible values for some bit depth between 2 and 3 */
    [-1, 2.6, -1],
    [-0.59, 2.6, -1 + 2 / 6],
    [-0.18, 2.6, -1 + 4 / 6],
    [0.2, 2.6, -1 + 6 / 6],
    [0.68, 2.6, -1 + 8 / 6],
    [0.8, 2.6, -1 + 10 / 6]
  ])(
    `${quantizeEvenlyMode} quantizes output space evenly into N parts where N is a natural number <= 2^bitrate. sample %f bit depth %f expected %f`,
    (sample, bitDepth, expected) => {
      expect(crush(sample, bitDepth, quantizeEvenlyMode)).toBeCloseTo(
        expected,
        0.001
      );
    }
  );

  test(`${continuousMode} mode divides output space more finely as bit depth increases`, () => {
    increasingBitDepths.forEach((bitDepth, index) => {
      if (index == 0) return;
      expect(crush(1, bitDepth, continuousMode)).toBeGreaterThanVerbose(
        crush(1, increasingBitDepths[index - 1], continuousMode),
        `bit depth ${bitDepth} max value not greater than bit depth max value ${
          increasingBitDepths[index - 1]
        }`
      );
    });
  });
});
