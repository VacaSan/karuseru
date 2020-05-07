import React from "react";
import { useSpring } from "react-spring";

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));

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
  const [springValues, set] = useSpring(initialConfigFunc);
  const [{ velocityTracker }, setVelocityTracker] = useSpring(() => ({
    velocityTracker: initialConfig[trackedVar],
    ...initialConfig,
  }));

  // you can disable the tracking or setting of velocity by providing options in the second argument
  const wrappedSet = React.useCallback(
    (data, { skipTrackVelocity, skipSetVelocity } = {}) => {
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
    },
    [set, setVelocityTracker, trackedVar, velocityTracker.lastVelocity]
  );
  return [springValues, wrappedSet];
}

// https://mobile-first-animation.netlify.app/26
const projection = (initialVelocity, decelerationRate) =>
  (initialVelocity * decelerationRate) / (1.0 - decelerationRate);

const rubberBand = (offset, constant = 0.7) => Math.pow(offset, constant);

function rubberBandIfOutOfBounds(min, max, value) {
  if (value < min) {
    return min - rubberBand(Math.abs(value - min));
  }
  if (value > max) {
    return max + rubberBand(Math.abs(max - value));
  }
  return value;
}

function makeStops(el, align) {
  const containerWidth = el.offsetWidth;
  return Array.from(el.children, child => {
    return makeStop(child.offsetLeft, child.offsetWidth, containerWidth, align);
  });
}

function makeStop(offset, width, containerWidth, align) {
  switch (align) {
    case "center":
      return -(offset - (containerWidth - width) / 2);
    case "right":
      return -(offset - (containerWidth - width));
    default:
      return -offset;
  }
}

function findClosestMatch(stops, x) {
  return stops.reduce((prev, curr) => {
    return Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev;
  });
}

const hasNext = (x, stops) => x <= (stops || [])[(stops?.length || 0) - 1] + 10;

const hasPrev = (x, stops) => x >= (stops || [])[0] - 10;

export {
  callAll,
  makeStop,
  makeStops,
  projection,
  findClosestMatch,
  rubberBandIfOutOfBounds,
  useVelocityTrackedSpring,
  hasPrev,
  hasNext,
};
