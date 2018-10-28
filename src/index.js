import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './SimpleCarousel.css';

/**
 * SimpleCarousel component.
 */
class SimpleCarousel extends Component {
  /**
   * @type {object}
   */
  static get propTypes() {
    return {
      className: PropTypes.string,
      style: PropTypes.object,
    };
  }

  /**
   * @type {Object}
   */
  static get defaultProps() {
    return {
      className: '',
      style: {},
    };
  }

  render() {
    const { className, style, ...props } = this.props;

    return (
      <div
        className={cx(SimpleCarousel, { [className]: className })}
        style={style}
        {...props}
      >
        hello, world
      </div>
    );
  }
}

export default SimpleCarousel;
