import React from "react";
import { render, screen } from "@testing-library/react";
import { Karuseru, KaruseruItems, KaruseruItem } from "../karuseru";
import "../__mocks__/resize-observer";

test("renders children", () => {
  render(
    <Karuseru>
      <KaruseruItems>
        <KaruseruItem>hello</KaruseruItem>
        <KaruseruItem>world</KaruseruItem>
      </KaruseruItems>
    </Karuseru>
  );

  expect(screen.queryByText("hello")).toBeInTheDocument();
});
