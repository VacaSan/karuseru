<h1 align="center">🎠 カルセル</h1>

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/karuseru.svg)](https://www.npmjs.com/package/karuseru)

# Table of Contents

- [Installations](#Installation)
- [Usage](#Usage)
- [Components](#Components)
  - [Karuseru](#Karuseru)
  - [KaruseruItems](#KaruseruItems)
  - [KaruseruItem](#KaruseruItem)
  - [KaruseruNext](#KaruseruNext)
  - [KaruseruPrev](#KaruseruPrev)
  - [KaruseruNav](#KaruseruNav)
- [Styling](#Styling)
- [License](#License)

# Installation

```bash
npm install --save karuseru
```

# Usage

```js
import { Karuseru, KaruseruItems, KaruseruItem } from "karuseru";
import "karuseru/dist/index.css";

const slides = ["apples", "pears", "stairs"];

render(
  <Karuseru>
    <KaruseruItems>
      {slides.map(slide => (
        <KaruseruItem key={slide}>{slide}</KaruseruItem>
      ))}
    </KaruseruItems>
  </Karuseru>
);
```

# Components

Any props not listed below will be spread onto the underlying element.

## Karuseru

// TODO

## KaruseruItems

Renders a `ul` element. Must be rendered inside of a `<Karuseru>`.

### Props

#### children

> `React.ReactNode` | _required_

Can contain only `KaruseruItem`

#### align

> `("left" | "right" | "center")` | defaults to: `"center"`

Align items within the carousel element.

#### contain

> `boolean` | defaults to: `false`

Contains items to carousel element to prevent excess scroll at beginning or end.

### CSS Selectors

// TODO

## KaruseruItem

Renders a `li` element.

### Props

Any props will be spread onto the underlying `li` element. You can treat it like any other `li` in your app for styling.

## KaruseruNext

Wraps a `DOM button`, that when clicked goes to the next slide. Must be rendered inside of a `<Karuseru>`.

### CSS Selectors

A `<KaruseruNext>` wraps a normal `<button>` and no styles are applied to it, so any global button styles you have will be applied.

```css
button {
  /* normal button styles will be applied */
}
```

You can use the `[data-karuseru-button-next]` selector to style only the next button:

```css
[data-karuseru-button-next] {
  color: dodgerblue;
}
```

If you'd like to target when the button is disabled use disabled attribute:

```css
[data-karuseru-button-next]:disabled {
  color: lightgray;
  opacity: 0.5;
}
```

## KaruseruPrev

Wraps a `DOM button`, that when clicked goes to the previous slide. Must be rendered inside of a `<Karuseru>`.

### CSS Selectors

```css
button {
  /* normal button styles will be applied */
}
```

You can use the `[data-karuseru-button-prev]` selector to style only the prev button:

```css
[data-karuseru-button-prev] {
  color: dodgerblue;
}
```

If you'd like to target when the button is disabled use disabled attribute:

```css
[data-karuseru-button-prev]:disabled {
  color: lightgray;
  opacity: 0.5;
}
```

## KaruseruNav

Renders a list of `buttons`, that when clicked goes to the specific slide.

### Props

#### renderItem

> `({ index: number, activeIndex: number, onClick: () => void }): JSX.Element`

Lets you override the default `button` element.

```jsx
<Karuseru>
  {/* ... */}
  <KaruseruNav
    renderItem={({ index, activeIndex, onClick }) => (
      <button onClick={onClick} disabled={index === activeIndex}>
        No.{index}
      </button>
    )}
  />
</Karuseru>
```

#### div props

Any props not listed here will be spread onto the underlying `div` element. You can treat it like any other `div` in your app for styling.

```jsx
<Karuseru>
  {/* ... */}
  <KaruseruNav className="dots" style={{ border: "2px solid hotpink" }} />
</Karuseru>
```

### CSS Selectors

You can use the `[data-karuseru-nav-item]` selector to style only the nav buttons:

```css
[data-karuseru-nav-item] {
  border-radius: 50%;
}
```

If you'd like to target when the nav item is active use `[data-karuseru-nav-item-active]`:

```css
[data-karuseru-nav-item][data-karuseru-nav-item-active] {
  background-color: royalblue;
}
```

# Styling

// TODO

# License

MIT © [](https://github.com/)
