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
 * @param {Object} obj object containing className/boolean pairs.
 * @return {string} className string.
 */
export const classnames = (obj) => {
  return Object.keys(obj).filter(name => obj[name]).join(' ');
};
