import React from "react";
import { render, screen } from "@testing-library/react";
import Karuseru from "../karuseru";

test("renders children", () => {
  render(
    <Karuseru>
      <Karuseru.Track>
        <Karuseru.Slide>hello</Karuseru.Slide>
        <Karuseru.Slide>world</Karuseru.Slide>
      </Karuseru.Track>
    </Karuseru>
  );

  expect(screen.queryByText("hello")).toBeInTheDocument();
});
