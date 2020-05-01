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
  let steps = [];
  // TODO align(item) (center | left | right)
  let offset = 0;
  // @ts-ignore
  for (let child of el.children) {
    const { width } = child.getBoundingClientRect();
    steps.push([offset, width]);
    offset += width;
  }
  return steps;
}

/**
 * returns index of the stop that is the closest match
 * @param {object} arg0
 * @param {number} arg0.x current x
 * @param {[number,number][]} arg0.stops (offset, width) tuple array
 */
function findIndex({ x, stops }) {
  if (x <= 0) return 0;

  const n = stops.length - 1;
  const [a, b] = stops[n];
  if (x > a + b) return n;

  for (let i = 0; i <= n; i++) {
    const [offset, width] = stops[i];
    const nextStop = offset + width;
    if (x >= offset && x <= nextStop) {
      if (nextStop - x < x - offset) return Math.min(i + 1, n);
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

function useAnimationFrame(callback) {
  const requestRef = React.useRef(0);
  const previousTimeRef = React.useRef(undefined);

  React.useEffect(() => {
    function animate(time) {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    }

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [callback]);
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
