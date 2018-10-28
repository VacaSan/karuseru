import React, { Component, createRef, cloneElement } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './SimpleCarousel.css';

/**
 * SimpleCarousel component.
 */
class SimpleCarousel extends Component {
  state = {
    slide: 0,
    width: 0,
    childWidth: 0,
    screenX: 0,
    isTouching: false,
  };

  $root = createRef();

  /**
   * @type {object}
   */
  static get propTypes() {
    return {
      children: PropTypes.node,
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
    const { slide, childWidth } = this.state;

    return slide * childWidth;
  }

  /**
   * @type {number}
   */
  get currentSlide() {
    const { slide } = this.state;

    return slide;
  }

  /**
   * @type {number}
   */
  get length() {
    const { children } = this.props;

    return React.Children.count(children);
  }

  /**
   * @type {number}
   */
  get perView() {
    const { width, childWidth } = this.state;

    return Math.round(width / childWidth);
  }

  componentDidMount() {
    this.layout();
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  /**
   * mousedown/touchstart event handler.
   */
  onStart = (evt) => {
    this.delta = 0;
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
    this.delta = (evt.pageX || evt.touches[0].pageX) - this.startX;
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
   */
  layout = () => {
    const $root = this.$root.current;
    const { width } = $root.getBoundingClientRect();
    const { width: childWidth } = $root.firstElementChild.getBoundingClientRect();

    this.setState({
      width,
      childWidth,
    });
  }

  /**
   * Updates the state based on the user gesture.
   */
  update = () => {
    const { isTouching, slide, childWidth } = this.state;

    const screenX = this.currentX - this.delta;

    this.setState({
      screenX,
    });

    if (isTouching) {
      window.requestAnimationFrame(this.update);
      return;
    }

    let nextSlide = slide;
    const clearance = 0.25 * childWidth;
    const slidesMoved = Math.floor(Math.abs(this.delta / childWidth));

    if (this.delta < -clearance) {
      nextSlide = slide + (1 + slidesMoved);
    } else if (this.delta > clearance) {
      nextSlide = slide - (1 + slidesMoved);
    }

    this.goTo(nextSlide);
  }

  /**
   * Goes to the specified slide.
   *
   * @param {number} n
   */
  goTo = (n) => {
    this.setState({
      slide: Math.max(0, Math.min(n, this.length - this.perView)),
    });
  }

  /**
   * Goes to the next slide.
   */
  next = () => {
    const { slide } = this.state;

    this.goTo(slide + 1);
  }

  /**
   * Goes to the previous slide.
   */
  prev = () => {
    const { slide } = this.state;

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
    const { slide, screenX, isTouching } = this.state;
    const { children, className, style, settings, ...props } = this.props;
    const { duration, easing, delay } = { ...SimpleCarousel.SETTINGS, ...settings };

    const slides = React.Children.map(children, (child, i) =>
      cloneElement(child, {
        className: cx({
          [child.props.className]: child.props.className,
          "active": i === slide,
        })
      })
    );

    const x = isTouching ? screenX : this.currentX;
    const transition = !isTouching ? `transform ${duration}ms ${easing} ${delay}ms` : '';

    return (
      <div
        ref={this.$root}
        className={cx("SimpleCarousel", { [className]: className })}
        style={{
          transform: `translateX(-${x}px)`,
          transition,
          ...style,
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
