/**
 * Adds two numbers and returns their sum.
 *
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
export const sum = (a, b) => a + b;

/**
 * Clamps the given value.
 *
 * @param {number} value value to clamp.
 * @param {number} lower lower bound.
 * @param {number} upper upper bound.
 * @return {number} clamped value.
 */
export const clamp = (value, lower, upper) => {
  return Math.max(lower, Math.min(value, upper));
};

/**
 * Creates a className string from the className object.
 *
 * @param {string|Object} names class names.
 * @return {string} className string.
 */
export const classnames = (...names) => {
  return names
    .reduce(
      (className, name) =>
        className.concat(
          typeof name === "string"
            ? name
            : Object.keys(name).filter(key => name[key])
        ),
      []
    )
    .join(" ");
};

/**
 * Creates a new array with the results of calling a provided function
 * on every element in the given array.
 *
 * @param {Function} callback Function that produces an element of the new Array.
 * @param {any[]} arr array to map over.
 * @return {any[]} A new array with each element being the result of the callback function.
 */
export const map = (callback, arr) => {
  let res = [];

  const L = arr.length;
  for (let i = 0; i < L; i++) {
    res.push(callback(arr[i], i));
  }

  return res;
};
