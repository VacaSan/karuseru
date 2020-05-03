import { useSpring } from "react-spring";

/**
 * Use this wrapper hook instead of useSpring from react-spring
 * to make sure that your spring animations have velocity,
 * even when parts of the animation have been delegated to other means of control
 * (e.g. gestures)
 */

function getTrackedVar(_trackedVar, initialConfig) {
  if (_trackedVar) return _trackedVar;
  const hasX = initialConfig.x !== undefined;
  const hasY = initialConfig.y !== undefined;
  if ((hasX && hasY) || (!hasX && !hasY)) {
    throw new Error(
      "[useVelocityTrackedSpring] can't automatically detect which variable to track, so you need to specify which variable should be tracked in the second argument"
    );
  }
  return hasX ? "x" : "y";
}

// https://github.com/aholachek/mobile-first-animation/blob/master/src/useVelocityTrackedSpring.js
function useVelocityTrackedSpring(initialConfigFunc, _trackedVar) {
  const initialConfig = initialConfigFunc();
  const trackedVar = getTrackedVar(_trackedVar, initialConfig);
  // @ts-ignore
  const [springValues, set] = useSpring(initialConfigFunc);
  // @ts-ignore
  const [{ velocityTracker }, setVelocityTracker] = useSpring(() => ({
    velocityTracker: initialConfig[trackedVar],
    ...initialConfig,
  }));

  // you can disable the tracking or setting of velocity by providing options in the second argument
  // @ts-ignore
  const wrappedSet = (data, { skipTrackVelocity, skipSetVelocity } = {}) => {
    // update velocity tracker
    const velocityTrackerArgs = { config: data.config };
    if (data[trackedVar] && !skipTrackVelocity)
      velocityTrackerArgs.velocityTracker = data[trackedVar];
    setVelocityTracker(velocityTrackerArgs);

    // update actual spring
    if (data.immediate) return set(data);
    set({
      ...data,
      config: {
        ...data.config,
        velocity: !skipSetVelocity && velocityTracker.lastVelocity,
      },
    });
  };
  return [springValues, wrappedSet];
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

export {
  makeStops,
  getStop,
  negate,
  callAll,
  findIndex,
  useVelocityTrackedSpring,
};
