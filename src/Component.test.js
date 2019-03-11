import React from "react";
import { shallow } from "enzyme";
import Component from "./Component";

describe("Component", () => {
  const createComponent = props => shallow(<Component {...props} />);

  it("should render children", () => {
    const wrapper = createComponent({
      children: [<div key={1}>hello</div>, <div key={2}>world</div>]
    });
    const actual = wrapper.find(".Karuseru_item").length;
    const expected = 2;
    expect(actual).toBe(expected);
  });

  it("should render active item", () => {
    const wrapper = createComponent({
      active: 0,
      children: [<div key={1}>hello</div>, <div key={2}>world</div>]
    });
    const actual = wrapper.find(".Karuseru_item--active").length;
    const expected = 1;
    expect(actual).toBe(expected);
  });

  it("should render prev item", () => {
    const wrapper = createComponent({
      active: 1,
      children: [<div key={1}>hello</div>, <div key={2}>world</div>]
    });
    const actual = wrapper.find(".Karuseru_item--prev").length;
    const expected = 1;
    expect(actual).toBe(expected);
  });

  it("should render next item", () => {
    const wrapper = createComponent({
      active: 0,
      children: [<div key={1}>hello</div>, <div key={2}>world</div>]
    });
    const actual = wrapper.find(".Karuseru_item--next").length;
    const expected = 1;
    expect(actual).toBe(expected);
  });

  it("should apply transform", () => {
    const wrapper = createComponent({
      active: 0,
      x: 10,
      children: [<div key={1}>hello</div>, <div key={2}>world</div>]
    });
    const wrapperStyle = wrapper.find(".Karuseru").get(0).props.style;
    expect(wrapperStyle).toHaveProperty("transform", "translateX(10px)");
  });
});
