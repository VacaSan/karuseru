import React, { Component, createRef, cloneElement } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './SimpleCarousel.css';

/**
 * SimpleCarousel component.
 */
class SimpleCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slide: 0,
      width: 0,
      childWidth: 0,
    };

    this.$root = createRef();
  }

  /**
   * @type {object}
   */
  static get propTypes() {
    return {
      children: PropTypes.node,
      className: PropTypes.string,
      style: PropTypes.object,
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
    };
  }

  /**
   * @type {number}
   */
  get currentX() {
    const { slide, childWidth } = this.state;

    return slide * childWidth;
  }

  componentDidMount() {
    this.layout();
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
   * Goes to the specified slide.
   *
   * @param {number} n
   */
  goTo = (n) => {
    this.setState({
      slide: n,
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

  render() {
    const { slide } = this.state;
    const { children, className, style, ...props } = this.props;

    const slides = React.Children.map(children, (child, i) =>
      cloneElement(child, {
        className: cx({
          [child.props.className]: child.props.className,
          "active": i === slide,
        })
      })
    );

    const x = this.currentX;

    return (
      <div
        ref={this.$root}
        className={cx("SimpleCarousel", { [className]: className })}
        style={{
          transform: `translateX(-${x}px)`,
          ...style,
        }}
        {...props}
      >
        {slides}
      </div>
    );
  }
}

export default SimpleCarousel;
