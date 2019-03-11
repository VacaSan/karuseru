import React from "react";
import Component from "./Component";
import { add, clamp, map, subtract, sum } from "./utils";

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      childrenWidths: [],
      slide: props.slide || 0
    };

    this.$root = React.createRef();
  }

  get isControlled() {
    return this.props.slide !== undefined;
  }

  get totalWidth() {
    return sum(...this.state.childrenWidths);
  }

  get length() {
    return React.Children.count(this.props.children);
  }

  get x() {
    return sum(...this.state.childrenWidths.slice(0, this.slide));
  }

  get slide() {
    return this.isControlled ? this.props.slide : this.state.slide;
  }

  componentDidMount() {
    this.layout();
  }

  goTo = n => {
    const length = this.length;
    const slide = clamp(n, 0, subtract(length, 1));

    if (!this.isControlled) {
      this.setState(
        {
          slide
        },
        () => {
          if (this.props.onChange) {
            this.props.onChange({ slide, length });
          }
        }
      );
    } else if (this.props.onChange) {
      this.props.onChange({ slide, length });
    }
  };

  nextSlide = (skip = 1) => {
    this.goTo(add(this.slide, skip));
  };

  prevSlide = (skip = 1) => {
    this.goTo(subtract(this.slide, skip));
  };

  /**
   * Recomputes the dimensions and re-lays out the component.
   */
  layout = fn => {
    const $root = this.$root.current;
    const { width } = $root.getBoundingClientRect();
    const childrenWidths = map(
      child => child.getBoundingClientRect().width,
      $root.children
    );

    this.setState(
      {
        width,
        childrenWidths
      },
      fn
    );
  };

  render() {
    return (
      <Component
        ref={this.$root}
        slide={this.slide}
        x={this.x}
        {...this.props}
      />
    );
  }
}

export default Container;
