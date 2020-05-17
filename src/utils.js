const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));

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
 * @param {"left" | "right" | "center"} align
 */
function makeStops(el, align) {
  const containerWidth = el.offsetWidth;
  return Array.from(el.children, (/** @type {HTMLElement} */ child) => {
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

const hasNext = (stops, x) => {
  const activeStop = findClosestMatch(stops, x);
  return stops.indexOf(activeStop) >= stops.length - 1;
};

const hasPrev = (stops, x) => {
  const activeStop = findClosestMatch(stops, x);
  return stops.indexOf(activeStop) <= 0;
};

export {
  callAll,
  makeStop,
  makeStops,
  projection,
  findClosestMatch,
  rubberBandIfOutOfBounds,
  hasPrev,
  hasNext,
};
