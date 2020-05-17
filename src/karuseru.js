import "./styles.css";
import React from "react";
import {
  callAll,
  makeStops,
  projection,
  findClosestMatch,
  rubberBandIfOutOfBounds,
} from "./utils";

import { animated, useSpring } from "react-spring";
import { useDrag } from "react-use-gesture";

// utils (Ramda stuff)
const R = {
  /** @param {any[]} list */
  first: list => list[0],
  /** @param {any[]} list */
  last: list => list[list.length - 1],
  /**
   * @param {number} min
   * @param {number} max
   * @param {number} value
   */
  clamp: (min, max, value) => Math.max(min, Math.min(value, max)),
};

const KaruseruContext = React.createContext(undefined);

function Karuseru({ children }) {
  const [items, setItems] = React.useState([0]);
  const stops = React.useRef(items);
  stops.current = items;

  const [index, setIndex] = React.useState(0);

  const [{ x }, set] = useSpring(() => ({
    x: 0,
    // cannot use state<stops> because onChange probably gets wrapped in
    // useCallback, we need to use "live" collection, like ref
    onChange: x =>
      setIndex(stops.current.indexOf(findClosestMatch(stops.current, x))),
  }));

  // public API
  const skip = React.useCallback(
    (/** @type {number} */ n = 0) => {
      const current = findClosestMatch(stops.current, x.get());
      const index = stops.current.indexOf(current);
      const nextIndex = R.clamp(0, stops.current.length - 1, index + n);
      set({ x: stops.current[nextIndex], immediate: false });
    },
    [x, set]
  );

  const goTo = React.useCallback(
    (/** @type {number} */ index) => {
      const nextIndex = R.clamp(0, stops.current.length - 1, index);
      const nextX = stops.current[nextIndex];
      set({ x: nextX, immediate: false });
    },
    [set]
  );

  const strItems = JSON.stringify(items);
  const value = React.useMemo(() => {
    return {
      x,
      set,
      stops,
      skip,
      goTo,
      index,
      items: JSON.parse(strItems),
      setItems,
    };
  }, [x, set, skip, goTo, index, strItems, setItems]);

  return (
    <KaruseruContext.Provider value={value}>
      {children}
    </KaruseruContext.Provider>
  );
}

function Items({ children, align, ...props }) {
  const { x, set, index, stops, setItems } = React.useContext(KaruseruContext);

  /** @type {React.RefObject<HTMLUListElement>} */
  const ref = React.useRef(null);

  React.useLayoutEffect(() => {
    // set(x) does nothing if called synchronously in effect
    set().then(() => {
      setItems(prevItems => {
        // use prevItems to maintain same index
        const nextItems = makeStops(ref.current, align);
        const nextX = findClosestMatch(nextItems, x.get());
        set({ x: nextX, immediate: false });
        return nextItems;
      });
    });
  }, [set, x, stops, align, children, setItems]);

  const bind = useDrag(
    ({ last: isLast, movement: [movementX], vxvy: [velocityX], memo }) => {
      if (!memo) {
        memo = x.get() - movementX;
      }

      let newX;
      if (isLast) {
        const projectedX = x.get() + projection(velocityX, 0.99);
        newX = findClosestMatch(stops.current, projectedX);
      } else {
        newX = rubberBandIfOutOfBounds(
          R.last(stops.current),
          R.first(stops.current),
          memo + movementX
        );
      }

      set({ x: newX, immediate: !isLast });

      return memo;
    }
  );

  const items = React.Children.map(children, (child, i) =>
    React.cloneElement(child, {
      isActive: i === index,
    })
  );

  return (
    <animated.ul
      ref={ref}
      {...props}
      {...bind()}
      data-karuseru-items=""
      style={{
        transform: x.to(x => `translateX(${x}px)`),
      }}
    >
      {items}
    </animated.ul>
  );
}
Items.defaultProps = {
  align: "center",
};

function Item({ isActive, ...props }) {
  const attr = Object.assign(
    { "data-karuseru-item": "" },
    isActive ? { "data-karuseru-item-active": "" } : {}
  );
  return <li {...attr} {...props} />;
}

function Next(props) {
  const { skip, stops, index } = React.useContext(KaruseruContext);

  return (
    <button
      disabled={index >= stops.current.length - 1}
      onClick={callAll(() => skip(1), props.onClick)}
      {...props}
    />
  );
}
Next.defaultProps = {
  children: "next",
};

function Prev(props) {
  const { skip, index } = React.useContext(KaruseruContext);

  return (
    <button
      disabled={index <= 0}
      onClick={callAll(() => skip(-1), props.onClick)}
      {...props}
    />
  );
}
Prev.defaultProps = {
  children: "prev",
};

function Nav(props) {
  const { stops, index, goTo } = React.useContext(KaruseruContext);

  return (
    <div {...props}>
      {stops.current.map((stop, i) => {
        const attr = Object.assign(
          { "data-karuseru-nav-item": "" },
          index === i ? { "data-karuseru-nav-item-active": "" } : {}
        );

        return (
          <button key={stop} {...attr} onClick={() => goTo(i)}>
            {i}
          </button>
        );
      })}
    </div>
  );
}

Karuseru.Items = Items;
Karuseru.Item = Item;
Karuseru.Next = Next;
Karuseru.Prev = Prev;
Karuseru.Nav = Nav;

export default Karuseru;
