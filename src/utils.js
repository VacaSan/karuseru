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

export {
  callAll,
  makeStop,
  makeStops,
  projection,
  findClosestMatch,
  rubberBandIfOutOfBounds,
};
