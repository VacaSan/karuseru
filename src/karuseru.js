import styles from "./styles.module.css";
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
  const trackRef = React.useRef(null);
  const stopsRef = React.useRef(null);

  // only state?
  const [{ x }, set] = useVelocityTrackedSpring(() => ({ x: 0 }));

  const context = React.useMemo(
    () => ({
      x,
      set,
      stopsRef,
      trackRef,
    }),
    [set, x]
  );

  return (
    <KaruseruContext.Provider value={context}>
      {children}
    </KaruseruContext.Provider>
  );
}

function Track({ children, align = "center", style = {}, ...props }) {
  const { trackRef, set, stopsRef, x } = React.useContext(KaruseruContext);

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
  }, [align, children, set, stopsRef, trackRef, x]);

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
      className={styles["karuseru-track"]}
      style={{
        ...style,
        transform: x.interpolate(x => `translateX(${x}px)`),
      }}
    >
      {children}
    </animated.ul>
  );
}

function Slide(props) {
  return <li className={styles["karuseru-slide"]} {...props} />;
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

Karuseru.Track = Track;
Karuseru.Slide = Slide;
Karuseru.Next = Next;
Karuseru.Prev = Prev;

export default Karuseru;
