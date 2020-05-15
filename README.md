# 🎠 カルセル

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
