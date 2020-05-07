import { makeStop } from "../utils";

test("makeStop aligns left", () => {
  expect(makeStop(0, 100, 120, "left")).toEqual(-0);
  expect(makeStop(100, 100, 120, "left")).toEqual(-100);
  expect(makeStop(200, 100, 120, "left")).toEqual(-200);
});

test("makeStop aligns center", () => {
  expect(makeStop(0, 100, 120, "center")).toEqual(10);
  expect(makeStop(100, 100, 120, "center")).toEqual(-90);
  expect(makeStop(200, 100, 120, "center")).toEqual(-190);
});

test("makeStop aligns right", () => {
  expect(makeStop(0, 100, 120, "right")).toEqual(20);
  expect(makeStop(100, 100, 120, "right")).toEqual(-80);
  expect(makeStop(200, 100, 120, "right")).toEqual(-180);
});
