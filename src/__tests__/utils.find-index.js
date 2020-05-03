import { findIndex } from "../utils";

test.each([
  [120, 0],
  [60, 0],
  [0, 0],
  [-20, 0],
  [-60, 1],
  [-100, 1],
  [-120, 1],
  [-160, 2],
  [-200, 2],
  [-220, 2],
  [-1280, 2],
])("given x is %p returns %p", (x, expected) => {
  expect(findIndex({ x, stops: [0, -100, -200] })).toBe(expected);
});
