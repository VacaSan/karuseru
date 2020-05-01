import { reducer } from "../karuseru";

const stops = [
  [0, 100],
  [100, 100],
  [200, 100],
];

test.each([
  [0, 100],
  [100, 200],
  [200, 200],
])("given NEXT action and x is %p, targetX becomes %p", (x, expected) => {
  const { targetX } = reducer(
    {
      state: "idle",
      stops,
      x,
    },
    { type: "NEXT" }
  );
  expect(targetX).toBe(expected);
});

test.each([
  [0, 0],
  [100, 0],
  [200, 100],
])("given PREV action and x is %p, targetX becomes %p", (x, expected) => {
  const { targetX } = reducer(
    {
      state: "idle",
      stops,
      x,
    },
    { type: "PREV" }
  );
  expect(targetX).toBe(expected);
});

test.each([
  [-20, 0],
  [20, 0],
  [60, 100],
  [140, 100],
  [180, 200],
  [220, 200],
])("given STOP action and x is %p, targetX becomes %p", (x, expected) => {
  const { targetX } = reducer(
    {
      state: "dragging",
      stops,
      x,
    },
    { type: "STOP" }
  );
  expect(targetX).toBe(expected);
});

// state
// var x=0;
// var targetX = 100;
// var state = 'idle';
// const update = () => {
//   if (state === 'settling') {
//     window.requestAnimationFrame(update);
//     // easing changes based on state
//     x = ease(x, targetX)
//   }
// }
// window.requestAnimationFrame(update);
