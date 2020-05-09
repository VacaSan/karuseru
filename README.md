<div style="text-align: center;">
  <div style="font-size: 128px; line-height: 1.2; margin-top: 0.125em;">🎠</div>
  <h1 style="font-size: 32px; font-weight: bold; margin-top: 0;">カルセル</h1>
</div>

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/karuseru.svg)](https://www.npmjs.com/package/karuseru)

## Table of Contents

- [Installations](#Installation)
- [Usage](#Usage)
- [License](#License)

## Installation

```bash
npm install --save karuseru
```

## Usage

```jsx
import * as React from "react";
import { render } from "react-dom";

import Karuseru from "karuseru";
import "karuseru/dist/index.css";

const slides = ["appels", "pears", "stairs"];

render(
  <Karuseru>
    <Karuseru.Items>
      {slides.map(slide => (
        <Karuseru.Item key={slide}>{slide}</Karuseru.Item>
      ))}
    </Karuseru.Items>
  </Karuseru>
);
```

## License

MIT © [](https://github.com/)
