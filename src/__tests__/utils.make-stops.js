import { makeStops } from "../utils";

const el = document.createElement("div");
for (let i = 0; i < 3; i++) {
  const child = document.createElement("div");
  child.getBoundingClientRect = jest.fn(() => ({ width: 100 }));
  el.appendChild(child);
}

test("makeStops creates a [stop, width] array", () => {
  const actual = makeStops(el);
  const expected = [
    [0, 100],
    [100, 100],
    [200, 100],
  ];
  expect(actual).toEqual(expected);
});
