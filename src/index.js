import React, { Component, createRef, cloneElement } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { sum, clamp } from './utils';
import './SimpleCarousel.css';

/**
 * SimpleCarousel component.
 */
class SimpleCarousel extends Component {
  state = {
    width: 0,
    childrenWidths: [],
    delta: 0,
    isTouching: false,
  };

  $root = createRef();

  /**
   * @type {object}
   */
  static get propTypes() {
    return {
      children: PropTypes.node,
      slide: PropTypes.number,
      onChange: PropTypes.func,
      className: PropTypes.string,
      style: PropTypes.object,
      settings: PropTypes.shape({
        duration: PropTypes.number, // in ms,
        easing: PropTypes.string, // timing function,
        delay: PropTypes.number, // in ms,
      }),
    };
  }

  /**
   * @type {Object}
   */
  static get defaultProps() {
    return {
      children: null,
      slide: 0,
      onChange: () => { },
      className: '',
      style: {},
      settings: SimpleCarousel.SETTINGS,
    };
  }

  /**
   * @type {Object}
   */
  static get SETTINGS() {
    return {
      duration: 225,
      easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      delay: 0,
    };
  }

  /**
   * @type {number}
   */
  get currentX() {
    const { childrenWidths, delta, width } = this.state;
    const { slide } = this.props;
    let currentX = childrenWidths.slice(0, slide).reduce(sum, 0) - delta;

    const lastSlide = childrenWidths.length - 1;
    const left = width - childrenWidths[lastSlide];
    const limit = childrenWidths.reduce(sum, 0) - width;

    if (slide === lastSlide) {
      currentX = currentX - left;
    }

    if (currentX > limit) {
      let over = currentX - limit;
      currentX = limit + Math.sqrt(over * 10);
    } else if (currentX < 0) {
      let over = Math.abs(currentX);
      currentX = 0 - Math.sqrt(over * 10);
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

    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  /**
   * mousedown/touchstart event handler.
   */
  onStart = (evt) => {
    this._delta = 0;
    this.startX = evt.pageX || evt.touches[0].pageX;
    this.addEventListeners();
    window.requestAnimationFrame(this.update);

    this.setState({
      isTouching: true,
    });
  }

  /**
   * mousemove/touchmove event handler.
   */
  onMove = (evt) => {
    this._delta = (evt.pageX || evt.touches[0].pageX) - this.startX;
  }

  /**
   * mouseup/touchend/touchcancel event handler.
   */
  onEnd = () => {
    this.removeEventListeners();

    this.setState({
      isTouching: false,
    });
  }

  /**
   * resize event handler. Runs layout after resize event has ended.
   */
  onResize = () => {
    // https://css-tricks.com/snippets/jquery/done-resizing-event/
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.layout();
    }, 250);
  }

  /**
   * Recomputes the dimensions and re-lays out the component.
   *
   * @param {Function} [callback] Callback to run after the layout calculations.
   */
  layout = (callback) => {
    const $root = this.$root.current;
    const { width } = $root.getBoundingClientRect();

    // Using for loop over Array.from removes the need for the polyfill to be
    // able to support IE11.
    let childrenWidths = [];
    const L = $root.children.length;
    for (let i = 0; i < L; i++) {
      const child = $root.children[i];
      const { width } = child.getBoundingClientRect();
      childrenWidths.push(width);
    }

    this.setState({
      width,
      childrenWidths,
    }, callback);
  }

  /**
   * Updates the state based on the user gesture.
   */
  update = () => {
    const { isTouching, childrenWidths } = this.state;
    const { slide } = this.props;

    this.setState({
      delta: isTouching ? this._delta : 0,
    });

    if (isTouching) {
      window.requestAnimationFrame(this.update);
      return;
    }

    let nextSlide = slide;
    const clearance = childrenWidths[slide] * 0.25;

    const list = this._delta < 0
      ? childrenWidths.slice(slide)
      : childrenWidths.slice(0, slide);

    let x = 0,
        moved = 0,
        child = list[moved];
    while (Math.abs(this._delta) > (x + child * 0.25)) {
      x += child;
      moved++;
    }

    if (this._delta < -clearance) {
      nextSlide = slide + moved;
    } else if (this._delta > clearance) {
      nextSlide = slide - moved;
    }

    this.goTo(nextSlide);
  }

  /**
   * Goes to the specified slide.
   *
   * @param {number} n
   */
  goTo = (n) => {
    const { onChange } = this.props;

    const slide = clamp(n, 0, this.length - 1);
    onChange(slide);
  }

  /**
   * Goes to the next slide.
   */
  next = () => {
    const { slide } = this.props;

    this.goTo(slide + 1);
  }

  /**
   * Goes to the previous slide.
   */
  prev = () => {
    const { slide } = this.props;

    this.goTo(slide - 1);
  }

  /**
   * Convinience method for attaching event handlers.
   */
  addEventListeners = () => {
    // mouse events
    document.addEventListener('mousemove', this.onMove);
    document.addEventListener('mouseup', this.onEnd);
    // touch events
    document.addEventListener('touchmove', this.onMove);
    document.addEventListener('touchend', this.onEnd);
    document.addEventListener('touchcancel', this.onEnd);
  }

  /**
   * Convinience method for dettaching event handlers.
   */
  removeEventListeners = () => {
    // mouse events
    document.removeEventListener('mousemove', this.onMove);
    document.removeEventListener('mouseup', this.onEnd);
    // touch events
    document.removeEventListener('touchmove', this.onMove);
    document.removeEventListener('touchend', this.onEnd);
    document.removeEventListener('touchcancel', this.onEnd);
  }

  render() {
    const { isTouching } = this.state;
    const { children, slide, className, style, settings, ...props } = this.props;
    const { duration, easing, delay } = { ...SimpleCarousel.SETTINGS, ...settings };

    const slides = React.Children.map(children, (child, i) =>
      cloneElement(child, {
        className: cx({
          [child.props.className]: child.props.className,
          "active": i === slide,
        })
      })
    );

    const transition = !isTouching ? `transform ${duration}ms ${easing} ${delay}ms` : '';

    return (
      <div
        ref={this.$root}
        className={cx("SimpleCarousel", { [className]: className })}
        style={{
          ...style,
          transform: `translateX(${-this.currentX}px)`,
          transition,
        }}
        onMouseDown={this.onStart}
        onTouchStart={this.onStart}
        {...props}
      >
        {slides}
      </div>
    );
  }
}

export default SimpleCarousel;
