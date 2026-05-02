import { fireEvent, render } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { Slot } from "./Slot";

describe("Slot", () => {
  it("자식 요소에 props를 머지한다", () => {
    const { getByTestId } = render(
      <Slot data-slot="merged">
        <button type="button" data-testid="child" data-child="x">
          click
        </button>
      </Slot>,
    );
    const el = getByTestId("child");
    expect(el.getAttribute("data-slot")).toBe("merged");
    expect(el.getAttribute("data-child")).toBe("x");
  });

  it("className을 합친다 (slot + child 둘 다)", () => {
    const { getByRole } = render(
      <Slot className="slot-class">
        <button type="button" className="child-class">
          x
        </button>
      </Slot>,
    );
    expect(getByRole("button").className).toBe("slot-class child-class");
  });

  it("style을 머지하며 child 우선이다", () => {
    const { getByRole } = render(
      <Slot style={{ color: "red", padding: 1 }}>
        <button type="button" style={{ color: "blue" }}>
          x
        </button>
      </Slot>,
    );
    const btn = getByRole("button") as HTMLButtonElement;
    expect(btn.style.color).toBe("blue");
    expect(btn.style.padding).toBe("1px");
  });

  it("이벤트 핸들러는 child → slot 순서로 모두 호출된다", () => {
    const calls: string[] = [];
    const slotClick = vi.fn(() => calls.push("slot"));
    const childClick = vi.fn(() => calls.push("child"));

    const { getByRole } = render(
      <Slot onClick={slotClick}>
        <button type="button" onClick={childClick}>
          x
        </button>
      </Slot>,
    );
    fireEvent.click(getByRole("button"));
    expect(calls).toEqual(["child", "slot"]);
  });

  it("forwarded ref와 child ref 모두에 노드를 부착한다", () => {
    const slotRef = React.createRef<HTMLButtonElement>();
    const childRef = React.createRef<HTMLButtonElement>();

    function Wrapper() {
      return (
        <Slot ref={slotRef as React.Ref<HTMLElement>}>
          <button type="button" ref={childRef}>
            x
          </button>
        </Slot>
      );
    }

    render(<Wrapper />);
    expect(slotRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(childRef.current).toBe(slotRef.current);
  });

  it("children이 valid element가 아니면 null을 반환한다", () => {
    const { container } = render(<Slot>plain text</Slot>);
    expect(container.innerHTML).toBe("");
  });
});
