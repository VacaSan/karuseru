import "./styles.css";
import React from "react";
import {
  callAll,
  makeStops,
  projection,
  findClosestMatch,
  rubberBandIfOutOfBounds,
  useVelocityTrackedSpring,
  hasPrev,
  hasNext,
} from "./utils";

import { animated } from "react-spring";
import { useDrag } from "react-use-gesture";

const KaruseruContext = React.createContext(undefined);

function Karuseru({ children }) {
  const stopsRef = React.useRef(null);

  const [size, setSize] = React.useState(0);

  // only state?
  const [{ x }, set] = useVelocityTrackedSpring(() => ({ x: 0 }));

  const context = React.useMemo(
    () => ({
      x,
      set,
      size,
      setSize,
      stopsRef,
    }),
    [set, x, size, setSize]
  );

  return (
    <KaruseruContext.Provider value={context}>
      {children}
    </KaruseruContext.Provider>
  );
}

function Items({ children, align = "center", style = {}, ...props }) {
  const { set, stopsRef, x, setSize } = React.useContext(KaruseruContext);

  // keep track of the number of items
  const count = React.Children.count(children);
  React.useEffect(() => {
    setSize(count);
  }, [count, setSize]);

  const trackRef = React.useRef(null);
  // TODO update on resize...
  React.useLayoutEffect(() => {
    if (trackRef.current) {
      const nextStops = makeStops(trackRef.current, align);

      if (stopsRef.current) {
        const prevX = findClosestMatch(stopsRef.current, x.getValue());
        const index = stopsRef.current.indexOf(prevX);
        set({ x: nextStops[index], immediate: false });
      } else {
        // TODO nextStops[initialIndex]?
        // technically i think it is safe to pass initialIndex,
        // because this branch will only fire on initial render?
        set({ x: nextStops[0], immediate: true });
      }

      stopsRef.current = nextStops;
    }
  }, [align, set, stopsRef, trackRef, x]);

  const bind = useDrag(
    ({ last, movement: [movementX], vxvy: [velocityX], memo }) => {
      if (!memo) {
        memo = x.getValue() - movementX;
      }

      let newX;
      if (last) {
        const projectedX = x.getValue() + projection(velocityX, 0.99);
        newX = findClosestMatch(stopsRef.current, projectedX);
      } else {
        newX = rubberBandIfOutOfBounds(
          stopsRef.current[stopsRef.current.length - 1],
          stopsRef.current[0],
          memo + movementX
        );
      }

      set({ x: newX, immediate: !last });

      return memo;
    }
  );

  return (
    <animated.ul
      ref={trackRef}
      {...props}
      {...bind()}
      data-karuseru-items=""
      style={{
        ...style,
        transform: x.interpolate(x => `translateX(${x}px)`),
      }}
    >
      {children}
    </animated.ul>
  );
}

function Item(props) {
  return <li data-karuseru-item="" {...props} />;
}

// this way i can treat disabled attribute as a boolean value,
// and not disabled="false"
const Button = animated(props => <button {...props} />);

function Next({ onClick, ...props }) {
  const { set, stopsRef, x } = React.useContext(KaruseruContext);

  const next = React.useCallback(() => {
    const currentX = findClosestMatch(stopsRef.current, x.getValue());
    const index = stopsRef.current.indexOf(currentX);
    const nextX =
      stopsRef.current[Math.min(stopsRef.current.length - 1, index + 1)];
    set({ x: nextX, immediate: false });
  }, [set, stopsRef, x]);

  return (
    <Button
      disabled={x.interpolate(x => hasNext(x, stopsRef.current))}
      onClick={callAll(next, onClick)}
      {...props}
    />
  );
}

function Prev({ onClick, ...props }) {
  const { set, stopsRef, x } = React.useContext(KaruseruContext);

  const prev = React.useCallback(() => {
    const currentX = findClosestMatch(stopsRef.current, x.getValue());
    const index = stopsRef.current.indexOf(currentX);
    const nextX = stopsRef.current[Math.max(0, index - 1)];
    set({ x: nextX, immediate: false });
  }, [set, stopsRef, x]);

  return (
    <Button
      disabled={x.interpolate(x => hasPrev(x, stopsRef.current))}
      onClick={callAll(prev, onClick)}
      {...props}
    />
  );
}

function defaultRenderItem({ index, isActive, onClick }) {
  return (
    <button
      data-karuseru-nav-item=""
      {...(isActive ? { "data-karuseru-nav-item-active": "" } : {})}
      onClick={onClick}
    >
      {index}
    </button>
  );
}

const Navigation = animated(function Navigation({
  x,
  set,
  stopsRef,
  renderItem = defaultRenderItem,
  ...props
}) {
  const stops = stopsRef.current || [0];
  const activeStop = findClosestMatch(stops, x);

  return (
    <div data-karuseru-nav="" {...props}>
      {stops.map((stop, index) => {
        return (
          <React.Fragment key={stop}>
            {renderItem({
              index,
              isActive: stop === activeStop,
              onClick: () => set({ x: stop, immediate: false }),
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
});

// how can i avoid this?
function Nav(props) {
  const { x, set, stopsRef } = React.useContext(KaruseruContext);
  return <Navigation x={x} set={set} stopsRef={stopsRef} {...props} />;
}

Karuseru.Items = Items;
Karuseru.Item = Item;
Karuseru.Next = Next;
Karuseru.Prev = Prev;
Karuseru.Nav = Nav;

export default Karuseru;
