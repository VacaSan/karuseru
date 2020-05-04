import { findClosestMatch } from "../utils";

test.each([
  [120, 0],
  [60, 0],
  [0, 0],
  [-20, 0],
  [-60, -100],
  [-100, -100],
  [-120, -100],
  [-160, -200],
  [-200, -200],
  [-220, -200],
  [-1280, -200],
])("findClosesMatch given x is %p returns %p", (x, expected) => {
  expect(findClosestMatch([0, -100, -200], x)).toBe(expected);
});
