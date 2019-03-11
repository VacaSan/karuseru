import { classnames, clamp, add, map, subtract, sum, negate } from "./utils";

describe("utils", () => {
  describe("add", () => {
    it("should return a number", () => {
      const actual = typeof add(1, 1);
      const expected = "number";
      expect(actual).toBe(expected);
    });

    it("should return a sum of given numbers", () => {
      const actual = add(1, 1);
      const expected = 2;
      expect(actual).toBe(expected);
    });

    it("should return a sum of given numbers", () => {
      const actual = add(1, 2);
      const expected = 3;
      expect(actual).toBe(expected);
    });
  });

  describe("subtract", () => {
    it("should return a number", () => {
      const actual = typeof subtract(1, 2);
      const expected = "number";
      expect(actual).toBe(expected);
    });

    it("should return a differenct of two numbers", () => {
      const actual = subtract(2, 1);
      const expected = 1;
      expect(actual).toBe(expected);
    });

    it("should return a differenct of two numbers", () => {
      const actual = subtract(3, 1);
      const expected = 2;
      expect(actual).toBe(expected);
    });
  });

  describe("negate", () => {
    it("should return a number", () => {
      const actual = typeof negate(2);
      const expected = "number";
      expect(actual).toBe(expected);
    });

    it("should return a negated number", () => {
      const actual = negate(1);
      const expected = -1;
      expect(actual).toBe(expected);
    });

    it("should return a negated number", () => {
      const actual = negate(-1);
      const expected = 1;
      expect(actual).toBe(expected);
    });
  });

  describe("sum", () => {
    it("should return a number", () => {
      const actual = typeof sum(1, 2);
      const expected = "number";
      expect(actual).toBe(expected);
    });

    it("should return the sum of arguments", () => {
      const actual = sum(1, 2, 3);
      const expected = 6;
      expect(actual).toBe(expected);
    });

    it("should return the sum of arguments", () => {
      const actual = sum(1, 2, -3);
      const expected = 0;
      expect(actual).toBe(expected);
    });
  });

  describe("map", () => {
    it("should return an array", () => {
      const identity = x => x;
      const actual = Array.isArray(map(identity, []));
      expect(actual).toBeTruthy();
    });

    it("should apply callback function to each element of the array", () => {
      const double = x => x * 2;
      const actual = map(double, [1, 2]);
      const expected = [2, 4];
      expect(actual).toEqual(expected);
    });

    it("should apply callback function to each element of the array", () => {
      const addOne = x => x + 1;
      const actual = map(addOne, [1, 2]);
      const expected = [2, 3];
      expect(actual).toEqual(expected);
    });
  });

  describe("classnames", () => {
    it("should return a string", () => {
      const actual = typeof classnames("hello");
      const expected = "string";
      expect(actual).toBe(expected);
    });

    it("should return a class name", () => {
      const actual = classnames("hello");
      const expected = "hello";
      expect(actual).toBe(expected);
    });

    it("should concat all strings with a space", () => {
      const actual = classnames("hello", "world");
      const expected = "hello world";
      expect(actual).toBe(expected);
    });

    it("should string containing object keys", () => {
      const actual = classnames({ hello: true, world: true });
      const expected = "hello world";
      expect(actual).toBe(expected);
    });

    it("should not include falsy keys", () => {
      const actual = classnames({ hello: false, world: true });
      const expected = "world";
      expect(actual).toBe(expected);
    });
  });

  describe("clamp", () => {
    it("should return a number", () => {
      const actual = typeof clamp(1, 0, 2);
      const expected = "number";
      expect(actual).toBe(expected);
    });

    it("should return `value` if it is between bounds", () => {
      const actual = clamp(5, 3, 7);
      const expected = 5;
      expect(actual).toBe(expected);
    });

    it("should return `lower` if `value` is lower than it", () => {
      const actual = clamp(0, 3, 7);
      const expected = 3;
      expect(actual).toBe(expected);
    });

    it("should return `upper` if `value` is greather than it", () => {
      const actual = clamp(10, 3, 7);
      const expected = 7;
      expect(actual).toBe(expected);
    });
  });
});
