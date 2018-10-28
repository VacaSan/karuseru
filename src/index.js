import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './SimpleCarousel.css';

/**
 * SimpleCarousel component.
 */
class SimpleCarousel extends Component {
  state = {
    slide: 0,
  };

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

    return (
      <div
        className={cx("SimpleCarousel", { [className]: className })}
        style={style}
        {...props}
      >
        {slides}
      </div>
    );
  }
}

export default SimpleCarousel;
