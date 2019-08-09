// delivers on the expected behaviour of expect(actual).toBe(expected, messageOnFailure) as Jasmine does
export function extend(expect) {
  expect.extend({
    toBeVerbose(actual, expected, failureMessage) {
      const matches = actual === expected;

      return {
        pass: matches,
        message: () => `expected ${expected} but got ${actual}
        ${failureMessage}`
      };
    },
    toBeCloseToVerbose(actual, expected, errorMargin, failureMessage) {
      const matches = Math.abs(actual - expected) <= errorMargin;

      return {
        pass: matches,
        message: () => `expected ${expected} but got ${actual}
        ${failureMessage}`
      };
    },
    toBeLessThanOrEqualVerbose(actual, expected, failureMessage) {
      const matches = actual <= expected;

      return {
        pass: matches,
        message: () => `expected <= ${expected} but got ${actual}
        ${failureMessage}`
      };
    },
    toBeGreaterThanOrEqualVerbose(actual, expected, failureMessage) {
      const matches = actual >= expected;

      return {
        pass: matches,
        message: () => `expected >= ${expected} but got ${actual}
        ${failureMessage}`
      };
    },
    toBeGreaterThanVerbose(actual, expected, failureMessage) {
      const matches = actual > expected;

      return {
        pass: matches,
        message: () => `expected > ${expected} but got ${actual}
        ${failureMessage}`
      };
    },
    toBeLessThanVerbose(actual, expected, failureMessage) {
      const matches = actual > expected;

      return {
        pass: matches,
        message: () => `expected > ${expected} but got ${actual}
        ${failureMessage}`
      };
    }
  });
}
