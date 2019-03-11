import React from "react";
import PropTypes from "prop-types";
import { classnames } from "./utils";

const addItemClassToChildren = (active, children) =>
  React.Children.map(children, (child, key) =>
    React.cloneElement(child, {
      className: classnames("Karuseru_item", {
        "Karuseru_item--active": key === active,
        "Karuseru_item--prev": key === active - 1,
        "Karuseru_item--next": key === active + 1,
        [child.props.className]: child.props.className
      }),
      key
    })
  );

const addStyles = (x, style) =>
  Object.assign({}, style, { transform: `translateX(${x}px)` });

const KaruseruComponent = React.forwardRef(
  ({ active = 0, children, className = "", style = {}, x = 0 }, ref) => {
    return (
      <div
        ref={ref}
        className={classnames("Karuseru", { [className]: className })}
        style={addStyles(x, style)}
      >
        {addItemClassToChildren(active, children)}
      </div>
    );
  }
);

KaruseruComponent.propTypes = {
  active: PropTypes.number,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  x: PropTypes.number
};

export default KaruseruComponent;
