import React, { Component, createRef } from "react";
import { render } from "react-dom";
import SimpleCarousel from "../../src";
import "./styles.css";

class App extends Component {
  carousel = createRef();

  next = () => {
    this.carousel.current.next();
  }

  prev = () => {
    this.carousel.current.prev();
  }

  render() {
    return (
      <div style={{
        width: '100%',
        maxWidth: 640,
        margin: '0 auto',
      }}>
        <SimpleCarousel ref={this.carousel}>
          {[1, 2, 3].map((a) => (
            <div key={a} className="slide">Slide {a}</div>
          ))}
        </SimpleCarousel>
        <div>
          <button onClick={this.prev}>&lt;</button>
          <button onClick={this.next}>&gt;</button>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
