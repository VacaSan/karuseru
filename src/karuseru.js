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

import useResizeObserver from "use-resize-observer";
import debounce from "lodash.debounce";

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
  const [stops, setStops] = React.useState([0]);
  const stopsRef = React.useRef(stops);
  stopsRef.current = stops;

  const [activeIndex, setActiveIndex] = React.useState(0);

  const [{ x }, set] = useSpring(() => ({
    x: 0,
    // cannot use state<stops> because onChange probably gets wrapped in
    // useCallback, we need to use "live" collection, like ref
    onChange: x =>
      setActiveIndex(
        stopsRef.current.indexOf(findClosestMatch(stopsRef.current, x))
      ),
  }));

  const strStops = JSON.stringify(stops);
  const value = React.useMemo(() => {
    return {
      x,
      set,
      stops: JSON.parse(strStops),
      stopsRef,
      setStops,
      activeIndex,
    };
  }, [x, set, activeIndex, strStops, setStops]);

  return (
    <KaruseruContext.Provider value={value}>
      {children}
    </KaruseruContext.Provider>
  );
}

function useSize(ref) {
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  const onResize = React.useMemo(
    () => debounce(setSize, 500, { leading: false }),
    []
  );

  useResizeObserver({ ref, onResize });

  return size;
}

function KaruseruItems({ children, align, contain, ...props }) {
  const { x, set, activeIndex, stopsRef, setStops } = React.useContext(
    KaruseruContext
  );

  /** @type {React.RefObject<HTMLUListElement>} */
  const ref = React.useRef(null);

  const { width } = useSize(ref);

  React.useLayoutEffect(() => {
    setStops(prevItems => {
      // TODO use prevItems to maintain same index
      const nextItems = makeStops(ref.current, { align, contain });
      const nextX = findClosestMatch(nextItems, x.get());
      set({ x: nextX, immediate: false });
      return nextItems;
    });
  }, [x, set, setStops, align, contain, children, width]);

  const bind = useDrag(
    ({ last: isLast, movement: [movementX], vxvy: [velocityX], memo }) => {
      if (!memo) {
        memo = x.get() - movementX;
      }

      let newX;
      if (isLast) {
        const projectedX = x.get() + projection(velocityX, 0.99);
        newX = findClosestMatch(stopsRef.current, projectedX);
      } else {
        newX = rubberBandIfOutOfBounds(
          R.last(stopsRef.current),
          R.first(stopsRef.current),
          memo + movementX
        );
      }

      set({ x: newX, immediate: !isLast });

      return memo;
    }
  );

  const items = React.Children.map(children, (child, index) =>
    React.cloneElement(child, {
      isActive: index === activeIndex,
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
KaruseruItems.defaultProps = {
  align: "center",
  contain: true,
};

// copy react-router's NavLink api (e.g. activeClassName)
function KaruseruItem({ isActive, ...props }) {
  const attr = Object.assign(
    { "data-karuseru-item": "" },
    isActive ? { "data-karuseru-item-active": "" } : {}
  );
  return <li {...props} {...attr} />;
}

function KaruseruNext(props) {
  const { stopsRef, set, stops, activeIndex } = React.useContext(
    KaruseruContext
  );

  const next = React.useCallback(() => {
    const nextIndex = R.clamp(0, stopsRef.current.length - 1, activeIndex + 1);
    set({ x: stopsRef.current[nextIndex], immediate: false });
  }, [set, stopsRef, activeIndex]);

  return (
    <button
      disabled={activeIndex >= stops.length - 1}
      data-karuseru-button-next=""
      onClick={callAll(next, props.onClick)}
      {...props}
    />
  );
}
KaruseruNext.defaultProps = {
  children: "next",
};

function KaruseruPrev(props) {
  const { stopsRef, set, activeIndex } = React.useContext(KaruseruContext);

  const prev = React.useCallback(() => {
    const nextIndex = R.clamp(0, stopsRef.current.length - 1, activeIndex - 1);
    set({ x: stopsRef.current[nextIndex], immediate: false });
  }, [set, stopsRef, activeIndex]);

  return (
    <button
      disabled={activeIndex <= 0}
      data-karuseru-button-prev=""
      onClick={callAll(prev, props.onClick)}
      {...props}
    />
  );
}
KaruseruPrev.defaultProps = {
  children: "prev",
};

function KaruseruNav({ render, ...props }) {
  const { stops, activeIndex, set } = React.useContext(KaruseruContext);

  const goTo = React.useCallback(stop => set({ x: stop }), [set]);

  return (
    <div data-karuseru-nav="" {...props}>
      {stops.map((stop, index) => {
        return (
          <React.Fragment key={index}>
            {render({
              index,
              activeIndex,
              onClick: () => goTo(stop), // maybe re-name?
              "data-karuseru-nav-item": "",
              ...(activeIndex === index
                ? { "data-karuseru-nav-item-active": "" }
                : {}),
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}
KaruseruNav.defaultProps = {
  render: ({ index, activeIndex: _, ...props }) => (
    <button {...props}>{index}</button>
  ),
};

export {
  Karuseru,
  KaruseruItem,
  KaruseruItems,
  KaruseruNext,
  KaruseruPrev,
  KaruseruNav,
};
