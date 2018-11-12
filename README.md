# React Simple Carousel

## Demo

https://vacasan.github.io/react-simple-carousel/

## Instalation

```sh
npm install --save react-simple-carousel
```

## Usage

### Slides only

Carousel with slides only.

```js
import React, { Component } from 'react';
import SimpleCarousel from 'react-simple-carousel';

class Carousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      slide: 0,
    };
  }

  onChange = ({ slide }) => {
    this.setState({ slide });
  }

  render() {
    return (
      <SimpleCarousel
        slide={this.state.slide}
        onChange={this.onChange}
      >
        <div>hello</div>
        <div>world</div>
      </SimpleCarousel>
    );
  }
}
```

### With controls

Adding in the previous and next controls:

```js

import React, { Component } from 'react';
import SimpleCarousel from 'react-simple-carousel';

class CarouselWithControls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      slide: 0,
      hasNext: true,
      hasPrev: false,
    };

    this.carousel = React.createRef();
  }

  onChange = ({ slide, length }) => {
    this.setState({
      slide,
      hasNext: slide < length - 1,
      hasPrev: slide > 0,
    });
  }

  next = () => this.carousel.current.next();

  prev = () => this.carousel.current.prev();

  render() {
    return (
      <div>
        <SimpleCarousel
          ref={this.carousel}
          slide={slide}
          onChange={this.onChange}
        >
          {[1, 2, 3, 4].map((n) => <div key={n}>{n}</div>)}
        </SimpleCarousel>
        <button onClick={this.prev} disabled={!hasPrev}>&lt;</button>
        <button onClick={this.next} disabled={!hasNext}>&gt;</button>
      </div>
    );
  }
}
```

### React Simple Carousel API

#### Props

| Name | Type | Description |
| --- | --- | --- |
| `children` | `node` | (_required_) Slides to render. |
| `slide` | `number` | (_required_) Current slide index. |
| `onChange({ slide: number, length: number }) => void` | `Function` | (_required_) Function that runs whenever the carousel value is changed _and committed_ by way of a user event, e.g. when a user stops dragging the carousel. |
| `settings` | `[Object]` | Additional parameters. |
| `settings.duration` | `[number=250]` | Transition duration (in ms). |
| `settings.delay` | `[number=0]`| Transition delay (in ms). |
| `settings.easing` | `[string=cubic-bezier(0.0, 0.0, 0.2, 1)]` | Easing function. |

#### Methods

| Method | Description |
| --- | --- |
| `next() => void` | Sets the next slide as active. |
| `prev() => void` | Sets the previous slide as active. |
| `goTo(slide: number) => void`| Sets the given slide as active. |
| `layout([callback: Function]) => void` | Recomputes the dimensions and re-lays out the component. This should be called if the dimensions of the slider itself or any of its parent element change programmatically (it is called automatically on resize). |

## License

MIT
