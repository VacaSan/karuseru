import React from "react";
import useResizeObserver from "use-resize-observer";
import debounce from "lodash.debounce";

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));

/** @param {any[]} list */
const first = list => list[0];

/** @param {any[]} list */
const last = list => list[list.length - 1];

/**
 * @param {number} min
 * @param {number} max
 * @param {number} value
 */
const clamp = (min, max, value) => Math.max(min, Math.min(value, max));

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

/**
 * @param {HTMLElement} el
 * @param {object} options
 * @param {"left" | "right" | "center"} options.align
 * @param {boolean} options.contain
 */
function makeStops(el, options) {
  const { align, contain } = options;
  const containerWidth = el.offsetWidth;
  let stops = Array.from(el.children, (/** @type {HTMLElement} */ child) => {
    return makeStop(child.offsetLeft, child.offsetWidth, containerWidth, align);
  });

  if (contain) {
    const max = 0;
    // @ts-ignore
    const { offsetLeft: offset, offsetWidth: width } = el.lastChild;
    const min = -(Math.abs(offset) + width - containerWidth);
    stops = stops.map(stop => Math.max(min, Math.min(stop, max)));
  }

  return stops;
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

/**
 * @param {number[]} stops
 * @param {number} x
 */
function findClosestMatch(stops, x) {
  // this the right thing?
  if (stops.length < 0) return 0;

  return stops.reduce((prev, curr) => {
    return Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev;
  });
}

/**
 * @param {React.RefObject<HTMLElement>} ref
 */
function useSize(ref) {
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  const onResize = React.useMemo(
    () => debounce(setSize, 500, { leading: false }),
    []
  );

  useResizeObserver({ ref, onResize });

  return size;
}

export {
  first,
  last,
  clamp,
  callAll,
  makeStop,
  makeStops,
  projection,
  findClosestMatch,
  rubberBandIfOutOfBounds,
  useSize,
};
