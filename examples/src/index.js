import React from "react";
import { render } from "react-dom";
import SimpleCarousel from "../../src";
import "./styles.css";

const App = () => (
  <div style={{
    width: '100%',
    maxWidth: 640,
    margin: '0 auto',
  }}>
    <SimpleCarousel>
      {[1, 2, 3].map((a) => (
        <div key={a} className="slide">Slide {a}</div>
      ))}
    </SimpleCarousel>
  </div>
);

/* eslint-disable */
render(<App />, document.getElementById("root"));
