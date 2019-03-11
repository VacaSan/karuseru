import React, { Component, createRef, cloneElement } from "react";
import PropTypes from "prop-types";
import { sum, clamp, classnames, map } from "./utils";
import KaruseruContainer from "./Container";
import "./Karuseru.css";

/**
 * Karuseru: a simple react carousel component.
 */
class Karuseru extends Component {
  state = {
    width: 0,
    totalWidth: 0,
    childrenWidths: [],
    delta: 0,
    isTouching: false
  };

  $root = createRef();

  /**
   * @type {object}
   */
  static get propTypes() {
    return {
      children: PropTypes.node.isRequired,
      slide: PropTypes.number.isRequired,
      onChange: PropTypes.func.isRequired,
      disabled: PropTypes.bool,
      className: PropTypes.string,
      style: PropTypes.object,
      settings: PropTypes.shape({
        duration: PropTypes.number, // in ms,
        easing: PropTypes.string, // timing function,
        delay: PropTypes.number // in ms,
      })
    };
  }

  /**
   * @type {Object}
   */
  static get defaultProps() {
    return {
      disabled: false,
      className: "",
      style: {},
      settings: Karuseru.SETTINGS
    };
  }

  /**
   * @type {Object}
   */
  static get SETTINGS() {
    return {
      duration: 225,
      easing: "cubic-bezier(0.0, 0.0, 0.2, 1)",
      delay: 0
    };
  }

  /**
   * @type {number}
   */
  get currentX() {
    const { childrenWidths, delta, width, totalWidth } = this.state;
    const { slide } = this.props;

    const upperBound = Math.max(totalWidth, width) - width;
    const lowerBound = 0;
    const slideX = childrenWidths.slice(0, slide).reduce(sum, 0);
    let currentX = clamp(slideX, lowerBound, upperBound) - delta;

    // Add resistance if over/under the extremes.
    if (currentX > upperBound) {
      const overBy = currentX - upperBound;
      currentX = upperBound + Math.sqrt(overBy * 10);
    } else if (currentX < lowerBound) {
      const overBy = Math.abs(currentX);
      currentX = lowerBound - Math.sqrt(overBy * 10);
    }

    return currentX;
  }

  /**
   * @type {number}
   */
  get length() {
    const { children } = this.props;

    return React.Children.count(children);
  }

  componentDidMount() {
    const { slide } = this.props;

    // NOTE: Will caouse one extra initial render call. Neccessary for
    // clamping the `slide` prop.
    this.layout(() => {
      this.goTo(slide);
    });

    window.addEventListener("resize", this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  /**
   * click event handler.
   */
  onClick = evt => {
    const { delta } = this.state;

    if (delta !== 0) {
      evt.preventDefault();
    }
  };

  /**
   * mousedown/touchstart event handler.
   */
  onStart = evt => {
    evt.preventDefault();

    this._delta = 0;
    this.startX = evt.pageX || evt.touches[0].pageX;
    this.addEventListeners();
    window.requestAnimationFrame(this.update);

    this.setState({
      isTouching: true
    });
  };

  /**
   * mousemove/touchmove event handler.
   */
  onMove = evt => {
    this._delta = (evt.pageX || evt.touches[0].pageX) - this.startX;
  };

  /**
   * mouseup/touchend/touchcancel event handler.
   */
  onEnd = () => {
    this.removeEventListeners();

    this.setState({
      isTouching: false
    });
  };

  /**
   * resize event handler. Runs layout after resize event has ended.
   */
  onResize = () => {
    // https://css-tricks.com/snippets/jquery/done-resizing-event/
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.layout();
    }, 250);
  };

  /**
   * Recomputes the dimensions and re-lays out the component.
   *
   * @param {Function} [callback] Callback to run after the layout calculations.
   */
  layout = callback => {
    const $root = this.$root.current;
    const { width } = $root.getBoundingClientRect();

    const childrenWidths = map($root.children, child => {
      return child.getBoundingClientRect().width;
    });

    const totalWidth = childrenWidths.reduce(sum, 0);

    this.setState(
      {
        width,
        totalWidth,
        childrenWidths
      },
      callback
    );
  };

  /**
   * Updates the state based on the user gesture.
   */
  update = () => {
    const { isTouching, childrenWidths } = this.state;
    const { slide } = this.props;

    this.setState({
      delta: isTouching ? this._delta : 0
    });

    if (isTouching) {
      window.requestAnimationFrame(this.update);
      return;
    }

    let nextSlide = slide;
    const clearance = childrenWidths[slide] * 0.25;

    const list =
      this._delta < 0
        ? childrenWidths.slice(slide)
        : childrenWidths.slice(0, slide);

    let x = 0,
      moved = 0,
      child = list[moved];
    while (Math.abs(this._delta) > x + child * 0.25) {
      x += child;
      moved++;
    }

    if (this._delta < -clearance) {
      nextSlide = slide + moved;
    } else if (this._delta > clearance) {
      nextSlide = slide - moved;
    }

    this.goTo(nextSlide);
  };

  /**
   * Goes to the specified slide.
   *
   * @param {number} n
   */
  goTo = n => {
    const { onChange } = this.props;
    const length = this.length;

    const slide = clamp(n, 0, this.length - 1);
    onChange({ slide, length });
  };

  /**
   * Goes to the next slide.
   */
  next = () => {
    const { slide } = this.props;

    this.goTo(slide + 1);
  };

  /**
   * Goes to the previous slide.
   */
  prev = () => {
    const { slide } = this.props;

    this.goTo(slide - 1);
  };

  /**
   * Convinience method for attaching event handlers.
   */
  addEventListeners = () => {
    // mouse events
    document.addEventListener("mousemove", this.onMove);
    document.addEventListener("mouseup", this.onEnd);
    // touch events
    document.addEventListener("touchmove", this.onMove);
    document.addEventListener("touchend", this.onEnd);
    document.addEventListener("touchcancel", this.onEnd);
  };

  /**
   * Convinience method for dettaching event handlers.
   */
  removeEventListeners = () => {
    // mouse events
    document.removeEventListener("mousemove", this.onMove);
    document.removeEventListener("mouseup", this.onEnd);
    // touch events
    document.removeEventListener("touchmove", this.onMove);
    document.removeEventListener("touchend", this.onEnd);
    document.removeEventListener("touchcancel", this.onEnd);
  };

  render() {
    const { isTouching } = this.state;
    const {
      children,
      slide,
      disabled,
      className,
      style,
      settings,
      ...props
    } = this.props;
    const { duration, easing, delay } = { ...Karuseru.SETTINGS, ...settings };

    const slides = React.Children.map(children, (child, i) =>
      cloneElement(child, {
        className: classnames({
          [child.props.className]: child.props.className,
          active: i === slide,
          prev: i === slide - 1,
          next: i === slide + 1
        })
      })
    );

    const transition = !isTouching
      ? `transform ${duration}ms ${easing} ${delay}ms`
      : "";

    const eventHandlers = disabled
      ? {}
      : {
          onMouseDown: this.onStart,
          onTouchStart: this.onStart,
          onClick: this.onClick
        };

    return (
      <div
        ref={this.$root}
        className={classnames({ Karuseru: true, [className]: className })}
        style={{
          ...style,
          transform: `translateX(${-this.currentX}px)`,
          transition
        }}
        {...eventHandlers}
        {...props}
      >
        {slides}
      </div>
    );
  }
}

// export default Karuseru;
export default KaruseruContainer;
