import React from "react";
import { mount } from "enzyme";
import Container from "./Container";

describe("Container", () => {
  const createContainer = props =>
    mount(
      <Container {...props}>
        <div key={1}>hello</div>
        <div key={2}>world</div>
        <div key={3}>!!!</div>
      </Container>
    );

  it("should work as uncontrolled component", () => {
    const wrapper = createContainer();
    expect(wrapper.state().slide).toBe(0);
    wrapper.instance().nextSlide();
    expect(wrapper.state().slide).toBe(1);
    wrapper.instance().prevSlide();
    expect(wrapper.state().slide).toBe(0);
  });

  it("should handle uncotrolled slide with onChange callback", () => {
    const onChange = jest.fn();
    const wrapper = createContainer({ onChange });
    wrapper.instance().goTo(1);
    expect(onChange).toBeCalledWith(
      expect.objectContaining({
        slide: 1
      })
    );
    wrapper.instance().goTo(2);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("should work when slide is controlled but changes are ignored (readonly mode)", () => {
    const wrapper = createContainer({ slide: 1 });
    expect(wrapper.instance().slide).toBe(1);
    wrapper.instance().nextSlide();
    expect(wrapper.instance().slide).toBe(1);
    wrapper.instance().nextSlide();
    expect(wrapper.instance().slide).toBe(1);
  });

  it("should work in controlled mode", () => {
    class ControlledUsage extends React.Component {
      state = {
        slide: 0
      };

      onChange = ({ slide }) => {
        this.setState({ slide });
      };

      render() {
        return (
          <Container slide={this.state.slide} onChange={this.onChange}>
            <div key={1}>hello</div>
            <div key={2}>world</div>
            <div key={3}>!!!</div>
          </Container>
        );
      }
    }

    const wrapper = mount(<ControlledUsage />);
    const container = wrapper.find(Container).instance();
    container.nextSlide();
    expect(wrapper.state().slide).toBe(1);
    container.prevSlide();
    expect(wrapper.state().slide).toBe(0);
    container.prevSlide();
    expect(wrapper.state().slide).toBe(0);
  });
});
