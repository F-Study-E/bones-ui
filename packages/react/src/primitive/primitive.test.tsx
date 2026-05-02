import { render } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { Primitive } from "./primitive";

describe("Primitive", () => {
  it("기본 HTML 요소로 렌더링된다", () => {
    const { getByRole } = render(<Primitive.button type="button">click</Primitive.button>);
    expect(getByRole("button").tagName).toBe("BUTTON");
  });

  it("asChild를 사용하면 자식 요소로 대체된다", () => {
    const { getByRole } = render(
      <Primitive.div asChild>
        <button type="button">click</button>
      </Primitive.div>,
    );
    const el = getByRole("button");
    expect(el.tagName).toBe("BUTTON");
  });

  it("ref를 자식 요소에 전달한다", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Primitive.button ref={ref} type="button">
        x
      </Primitive.button>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("asChild 시 ref가 실제 자식 요소에 연결된다", () => {
    const ref = React.createRef<HTMLAnchorElement>();
    render(
      <Primitive.div asChild>
        <a ref={ref} href="https://example.com">
          link
        </a>
      </Primitive.div>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});
