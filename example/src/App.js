// @ts-check
import "styled-components/macro";
import React from "react";

import Karuseru from "karuseru";
import "karuseru/dist/index.css";

const slides = ["first", "second", "third"];

function App() {
  const [state, setState] = React.useState(slides);

  const [align, setAlign] = React.useState("center");
  const onChange = React.useCallback(evt => setAlign(evt.target.value), []);

  const [contain, setContain] = React.useState(false);
  const onToggle = React.useCallback(() => setContain(prev => !prev), []);

  return (
    <React.Fragment>
      <button onClick={() => setState(slides.concat("forth"))}>
        add forth
      </button>
      <select value={align} onChange={onChange}>
        <option value="left">left</option>
        <option value="center">center</option>
        <option value="right">right</option>
      </select>
      <label htmlFor="contain">
        <input
          id="contain"
          type="checkbox"
          checked={contain}
          onChange={onToggle}
        />
        Contain
      </label>
      <div
        style={{
          width: "100%",
          maxWidth: 600,
          margin: "0 auto",
          border: "1px solid red",
        }}
      >
        <Karuseru>
          <Karuseru.Items align={align} contain={contain}>
            {state.map(msg => (
              <Karuseru.Item
                key={msg}
                css={`
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background-color: #fff;
                  margin-right: 1rem;
                  width: calc(50% - 0.5rem);
                  height: 200px;
                  border-radius: 0.25rem;
                  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
                    0px 1px 1px 0px rgba(0, 0, 0, 0.14),
                    0px 1px 3px 0px rgba(0, 0, 0, 0);
                `}
              >
                {msg}
              </Karuseru.Item>
            ))}
          </Karuseru.Items>
          <Karuseru.Nav />
          <Karuseru.Prev>prev</Karuseru.Prev>
          <Karuseru.Next>next</Karuseru.Next>
        </Karuseru>
      </div>
    </React.Fragment>
  );
}

export default App;
