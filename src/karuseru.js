import styles from "./styles.module.css";
import React from "react";
import {
  callAll,
  makeStops,
  projection,
  findClosestMatch,
  rubberBandIfOutOfBounds,
  useVelocityTrackedSpring,
} from "./utils";

import { animated } from "react-spring";
import { useDrag } from "react-use-gesture";

const KaruseruContext = React.createContext(undefined);

// function useKaruseru() {
//   const context = React.useContext(KaruseruContext);
//   if (process.env.NODE_ENV === "development" && context === undefined) {
//     throw new Error("useKaruseru must be used inside KaruseruContext");
//   }
//   return context;
// }

function Karuseru({ children }) {
  return (
    <KaruseruContext.Provider value={{}}>{children}</KaruseruContext.Provider>
  );
}

function useOnStopsChanged(onChange, [align, children]) {
  const trackRef = React.useRef(null);
  const prevStopsRef = React.useRef(undefined);
  const nextStopsRef = React.useRef(undefined);

  // TODO update on resize...
  React.useLayoutEffect(() => {
    if (trackRef.current) {
      prevStopsRef.current = nextStopsRef.current;
      nextStopsRef.current = makeStops(trackRef.current, align);
      onChange(nextStopsRef.current, prevStopsRef.current);
    }
  }, [align, children, onChange]);

  return trackRef;
}

function Track({ children, align = "center", style = {}, ...props }) {
  // TODO const [stops, setStops] = useStops();
  // TODO const [x, set] = useX();
  const [stops, setStops] = React.useState([]);
  const [{ x }, set] = useVelocityTrackedSpring(() => ({ x: 0 }));

  const onStopsChanged = React.useCallback(
    (nextStops, prevStops) => {
      if (prevStops) {
        const prevX = findClosestMatch(prevStops, x.getValue());
        const index = prevStops.indexOf(prevX);
        set({ x: nextStops[index] });
        setStops(nextStops);
      } else {
        // TODO nextStops[initialIndex]?
        // technically i think it is safe to pass initialIndex,
        // because this branch will only fire on initial render?
        set({ x: nextStops[0], immediate: true });
        setStops(nextStops);
      }
    },
    [setStops, set, x]
  );

  const trackRef = useOnStopsChanged(onStopsChanged, [align, children]);

  const bind = useDrag(
    ({ last, movement: [movementX], vxvy: [velocityX], memo }) => {
      if (!memo) {
        memo = x.getValue() - movementX;
      }

      let newX;
      if (last) {
        const projectedX = x.getValue() + projection(velocityX, 0.99);
        newX = findClosestMatch(stops, projectedX);
      } else {
        newX = rubberBandIfOutOfBounds(
          stops[stops.length - 1],
          stops[0],
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

function Next({ onClick, ...props }) {
  return <button onClick={callAll(onClick)} {...props} />;
}

function Prev({ onClick, ...props }) {
  return <button onClick={callAll(onClick)} {...props} />;
}

Karuseru.Track = Track;
Karuseru.Slide = Slide;
Karuseru.Next = Next;
Karuseru.Prev = Prev;

export default Karuseru;
