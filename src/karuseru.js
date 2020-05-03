import styles from "./styles.module.css";
import React from "react";
import {
  callAll,
  getStop,
  makeStops,
  projection,
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

function Track({ children, align = "center", style = {}, ...props }) {
  const trackRef = React.useRef(undefined);
  const [stops, setStops] = React.useState([]);

  React.useLayoutEffect(() => {
    if (trackRef.current) {
      setStops(makeStops(trackRef.current, align));
    }
  }, [children, align]);

  const [{ x }, set] = useVelocityTrackedSpring(() => {
    // TODO initial offset
    return { x: 0 };
  });

  const bind = useDrag(
    ({ last, movement: [movementX], vxvy: [velocityX], memo }) => {
      if (!memo) {
        memo = x.getValue() - movementX;
      }

      let newX;
      if (last) {
        const projectedX = x.getValue() + projection(velocityX, 0.99);
        newX = getStop({ x: projectedX, stops }, "CURRENT");
      } else {
        newX = memo + movementX;
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
