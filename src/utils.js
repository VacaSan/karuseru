import React from "react";

function createMachine(reducers) {
  return function stateReducer(state, action) {
    if (Object.prototype.hasOwnProperty.call(reducers, state.state)) {
      return reducers[state.state](state, action);
    }

    throw new TypeError(`unhandled state [${state.state}].`);
  };
}

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));

/** @param {number} n */
const negate = n => -n;

/**
 * creates (stop, width) tuple array
 * @param {HTMLElement} el
 * @returns {[number, number][]}
 */
function makeStops(el) {
  /** @type {[number, number][]} */
  let stops = [];
  // @ts-ignore
  for (let child of el.children) {
    const width = child.offsetWidth;
    const offset = child.offsetLeft;
    stops.push([offset, width]);
  }
  return stops;
}

/**
 * returns index of the stop that is the closest match
 * @param {object} arg0
 * @param {number} arg0.x current x
 * @param {[number,number][]} arg0.stops (offset, width) tuple array
 */
function findIndex({ x, stops }) {
  const [min] = stops[0];
  if (x <= min) return 0;

  const n = stops.length - 1;
  const [a] = stops[n];
  if (x >= a) return n;

  for (let i = 0; i <= n; i++) {
    const [offset] = stops[i];
    const [nextOffset] = stops[i + 1] || [Number.POSITIVE_INFINITY];
    if (x >= offset && x <= nextOffset) {
      if (nextOffset - x < x - offset) return Math.min(i + 1, n);
      return i;
    }
  }
}

/**
 * @param {object} state
 * @param {number} state.x current x
 * @param {[number,number][]} state.stops (offset, width) tuple array
 * @param {"NEXT" | "PREV" | "CURRENT"} node
 */
function getStop(state, node = "CURRENT") {
  const index = findIndex(state);
  switch (node) {
    case "NEXT":
      return state.stops[Math.min(index + 1, state.stops.length - 1)];
    case "PREV":
      return state.stops[Math.max(index - 1, 0)];
    default:
      return state.stops[index];
  }
}

// https://github.com/facebook/react/issues/14195
function useAnimationFrame(callback, condition) {
  const callbackRef = React.useRef(callback);
  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const frameRef = React.useRef(0);
  React.useLayoutEffect(() => {
    const loop = () => {
      if (condition) {
        frameRef.current = requestAnimationFrame(loop);
        const cb = callbackRef.current;
        cb();
      }
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [condition]);
}

export {
  createMachine,
  makeStops,
  getStop,
  negate,
  callAll,
  findIndex,
  useAnimationFrame,
};
