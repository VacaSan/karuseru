import React from "react";
import PropTypes from "prop-types";
import { classnames } from "./utils";

const addItemClassToChildren = (slide, children) =>
  React.Children.map(children, (child, key) =>
    React.cloneElement(child, {
      className: classnames("Karuseru_item", {
        "Karuseru_item--active": key === slide,
        "Karuseru_item--prev": key === slide - 1,
        "Karuseru_item--next": key === slide + 1,
        [child.props.className]: child.props.className,
      }),
      key,
    })
  );

const createStyles = (x, style) => ({
  ...style,
  transform: `translateX(${x}px)`,
});

const Component = React.forwardRef(
  ({ slide = 0, children, className = "", style = {}, x = 0 }, ref) => {
    return (
      <div
        ref={ref}
        className={classnames("Karuseru", { [className]: className })}
        style={createStyles(x, style)}
      >
        {addItemClassToChildren(slide, children)}
      </div>
    );
  }
);

Component.displayName = "Component";

Component.propTypes = {
  active: PropTypes.number,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  slide: PropTypes.number,
  style: PropTypes.object,
  x: PropTypes.number,
};

export default Component;
