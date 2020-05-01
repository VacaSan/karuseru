import React from "react";

import Karuseru from "karuseru";
import "karuseru/dist/index.css";

const slides = ["first", "second", "third"];

function App() {
  const [state, setState] = React.useState(slides);
  return (
    <React.Fragment>
      <button onClick={() => setState(slides.concat("forth"))}>
        add forth
      </button>
      <div style={{ width: 600, margin: "0 auto", border: "1px solid red" }}>
        <Karuseru>
          <Karuseru.Track>
            {state.map(msg => (
              <Karuseru.Slide
                key={msg}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fff",
                  marginRight: "1rem",
                  width: "calc(50% - 0.5rem)",
                  height: 200,
                  borderRadius: "0.25rem",
                  boxShadow:
                    "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0)",
                }}
              >
                {msg}
              </Karuseru.Slide>
            ))}
          </Karuseru.Track>
          <Karuseru.Prev>prev</Karuseru.Prev>
          <Karuseru.Next>next</Karuseru.Next>
        </Karuseru>
      </div>
    </React.Fragment>
  );
}

export default App;
