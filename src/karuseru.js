import styles from "./styles.module.css";
import React from "react";
import {
  callAll,
  createMachine,
  getStop,
  makeStops,
  negate,
  useAnimationFrame,
} from "./utils";

const KaruseruContext = React.createContext(undefined);

function useKaruseru() {
  const context = React.useContext(KaruseruContext);
  if (process.env.NODE_ENV === "development" && context === undefined) {
    throw new Error("useKaruseru must be used inside KaruseruContext");
  }
  return context;
}

/**
 * @typedef KaruseruState
 * @type {object}
 * @property {"init" | "idle" | "dragging" | "settling"} state
 * @property {number} x current position
 * @property {[number, number][]} stops [offset, width] array (should be [offset, width])
 * @property {number | null} targetX calculated internally
 */

/**
 * @typedef {{[k: string]: any, type: "INIT" | "NEXT" | "PREV" | "START" | "UPDATE" | "STOP" }} KaruseruAction
 */

/**
 * @param {KaruseruState} state
 * @param {KaruseruAction} action
 * @returns {KaruseruState}
 */
function init(state, action) {
  if (action.type === "INIT") {
    const { stops } = action;
    // TODO use initial index? e.g. stops[props.initial]
    const [x] = stops[0] || [0];

    return {
      ...state,
      state: "idle",
      stops,
      x,
    };
  }
  return state;
}

/**
 * @param {KaruseruState} state
 * @param {KaruseruAction} action
 * @returns {KaruseruState}
 */
function idle(state, action) {
  switch (action.type) {
    case "START":
      return { ...state, state: "dragging" };

    case "NEXT":
    case "PREV": {
      // i think we might need to store index as well... (for resize recover)
      // ...or not, we can do some logic to find prev index before resize?
      const [targetX] = getStop(state, action.type);
      return {
        ...state,
        state: "settling",
        targetX,
      };
    }
    default:
      return state;
  }
}

/**
 * @param {KaruseruState} state
 * @param {KaruseruAction} action
 * @returns {KaruseruState}
 */
function dragging(state, action) {
  switch (action.type) {
    case "STOP": {
      const [targetX] = getStop(state, "CURRENT");
      return { ...state, state: "settling", targetX };
    }

    case "UPDATE":
      return { ...state, x: action.x };
    default:
      return state;
  }
}

/**
 * @param {KaruseruState} state
 * @param {KaruseruAction} action
 * @returns {KaruseruState}
 */
function settling(state, action) {
  switch (action.type) {
    case "UPDATE": {
      const { x, targetX } = state;

      // we hit the target (reduce precision? 1%)
      // this might need to go to the render (why?)
      if (Math.round(x) === Math.round(targetX)) {
        return { ...state, state: "idle", x: state.targetX, targetX: null };
      }

      return { ...state, x: action.x };
    }

    case "START":
      return { ...state, state: "dragging" };
    case "NEXT":
    case "PREV": {
      const [targetX] = getStop(state, action.type);
      return {
        ...state,
        state: "settling",
        targetX,
      };
    }
    default:
      return state;
  }
}

export const reducer = createMachine({
  init,
  idle,
  dragging,
  settling,
});

// this one, together with reducer should handle all the "logic", current
// state of the component, what is the next x, are the buttons disabled...
function Karuseru({ children }) {
  const [{ state, x, targetX }, dispatch] = React.useReducer(reducer, {
    state: "init",
    x: 0,
    stops: [], // this is private (used internally for calculating "x")
  });

  // this should be the only props exposed to the consumers
  const value = React.useMemo(
    () => ({
      x,
      targetX,
      state,
      dispatch,
    }),
    [x, targetX, state, dispatch]
  );

  return (
    <KaruseruContext.Provider value={value}>
      {children}
    </KaruseruContext.Provider>
  );
}

// this guy should only handle DOM interaction? like reading layout,
// listening for window resize, and updating DOM with props
function Track({ children, style = {}, ...props }) {
  const { dispatch, state, x, targetX } = useKaruseru();

  const trackRef = React.useRef(null);
  React.useLayoutEffect(() => {
    if (trackRef.current) {
      const stops = makeStops(trackRef.current);
      dispatch({ type: "INIT", stops });
    }
  }, [children, trackRef, dispatch]);

  const xRef = React.useRef(null);
  const startXRef = React.useRef(null);
  const deltaXRef = React.useRef(null);
  // how can we request/cancel AF only when we need it?
  useAnimationFrame(function update() {
    if (state === "dragging" && deltaXRef.current !== null) {
      const nextX = xRef.current - deltaXRef.current;
      dispatch({ type: "UPDATE", x: nextX });
    }

    if (state === "settling" && targetX !== null) {
      // TODO use fancy easing, based on exit speed
      const nextX = x + (targetX - x) / 10;
      dispatch({ type: "UPDATE", x: nextX });
    }
  });

  // i don't know if this "optimization" helps or not?
  const onStart = React.useCallback(
    evt => {
      xRef.current = x;
      startXRef.current = evt.pageX || evt.touches[0].pageX;
      deltaXRef.current = 0;
      dispatch({ type: "START" });
    },
    [dispatch, x]
  );

  const onMove = React.useCallback(
    evt => {
      try {
        deltaXRef.current =
          (evt.pageX || evt.touches[0].pageX) - startXRef.current;
      } catch (_) {
        dispatch({ type: "STOP" });
      }
    },
    [dispatch]
  );

  const onStop = React.useCallback(() => {
    dispatch({ type: "STOP" });
  }, [dispatch]);

  return (
    <ul
      ref={trackRef}
      {...props}
      className={styles["karuseru-track"]}
      onMouseDown={onStart}
      onMouseMove={onMove}
      onMouseUp={onStop}
      onMouseLeave={onStop}
      style={{ ...style, transform: `translateX(${negate(x)}px)` }}
    >
      {children}
    </ul>
  );
}

function Slide(props) {
  return <li className={styles["karuseru-slide"]} {...props} />;
}

function Next({ onClick, ...props }) {
  // disabled if x > length - last(child.width)
  const { dispatch } = useKaruseru();
  return (
    <button
      onClick={callAll(() => dispatch({ type: "NEXT" }), onClick)}
      {...props}
    />
  );
}

function Prev({ onClick, ...props }) {
  const { dispatch } = useKaruseru();
  return (
    <button
      onClick={callAll(() => dispatch({ type: "PREV" }), onClick)}
      {...props}
    />
  );
}

Karuseru.Track = Track;
Karuseru.Slide = Slide;
Karuseru.Next = Next;
Karuseru.Prev = Prev;

export default Karuseru;
