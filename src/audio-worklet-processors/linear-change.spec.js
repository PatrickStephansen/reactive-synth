import { getValueAtTime } from './linear-change';

describe('linear change over time', () => {
  describe('when current time is out of range', () => {
    test.each([
      [1, 10, 0, 20, 1, 1],
      [1, 10, 0, 20, 21, 0],
      [0.75, 0.5, 0.25, 0.7, 0, 0.75],
      [0.75, 0.5, 0.25, 0.7, 0.7001, 0.25]
    ])(
      'it should clamp to start or end value. start value: %f, start time: %f,end value: %f, end time: %f, attack current time: %f, expected value: %f',
      (
        startValue,
        startTime,
        endValue,
        endTime,
        currentTime,
        expectedValue
      ) => {
        expect(
          getValueAtTime(startValue, startTime, endValue, endTime, currentTime)
        ).toBe(expectedValue);
      }
    );
  });
  describe('when current time at edge of range', () => {
    test.each([
      [1, 10, 0, 20, 10, 1],
      [1, 10, 0, 20, 20, 0],
      [0.75, 0.5, 0.25, 0.7, 0.5, 0.75],
      [0.75, 0.5, 0.25, 0.7, 0.7, 0.25]
    ])(
      'it should return exactly the start or end value. start value: %f, start time: %f,end value: %f, end time: %f, attack current time: %f, expected value: %f',
      (
        startValue,
        startTime,
        endValue,
        endTime,
        currentTime,
        expectedValue
      ) => {
        expect(
          getValueAtTime(startValue, startTime, endValue, endTime, currentTime)
        ).toBe(expectedValue);
      }
    );
  });
  describe('when start and end time are the same', () => {
    describe('and current time before start', () => {
      test('it should return the start value', () => {
        expect(getValueAtTime(12, 1, 20, 1, 0.5)).toBe(12);
      });
    });
    describe('and current time is also the same', () => {
      test('it should return the end value', () => {
        expect(getValueAtTime(12, 1, 20, 1, 1)).toBe(20);
      });
    });
    describe('and current time is after end time', () => {
      test('it should return the end value', () => {
        expect(getValueAtTime(12, 1, 20, 1, 2)).toBe(20);
      });
    });
  });
  describe('when start is later than end time', () => {
    test.each([
      [1, 30, 0, 20, 15, 1],
      [1, 30, 0, 20, 21, 0],
      [1, 30, 0, 20, 31, 0],
    ])(
      'it should adjust start time to match end time. start value: %f, start time: %f,end value: %f, end time: %f, attack current time: %f, expected value: %f',
      (
        startValue,
        startTime,
        endValue,
        endTime,
        currentTime,
        expectedValue
      ) => {
        expect(
          getValueAtTime(startValue, startTime, endValue, endTime, currentTime)
        ).toBe(expectedValue);
      }
    );
  });
  describe('when current time within range', () => {
    test.each([
      [1, 10, 0, 20, 15, 0.5],
      [1, 10, 0, 20, 12, 0.8],
      [0.75, 0.5, 0.25, 0.7, 0.5, 0.75],
      [0.75, 0.5, 0.25, 0.7, 0.6, 0.5],
      [0, 0, 1, 1, 0.697, 0.697],
      [5, 123, 8, 126, 125, 7]
    ])(
      'it should linearly interpolate the start and end points. start value: %f, start time: %f,end value: %f, end time: %f, attack current time: %f, expected value: %f',
      (
        startValue,
        startTime,
        endValue,
        endTime,
        currentTime,
        expectedValue
      ) => {
        expect(
          getValueAtTime(startValue, startTime, endValue, endTime, currentTime)
        ).toBe(expectedValue);
      }
    );
  });
});
