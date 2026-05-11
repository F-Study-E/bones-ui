import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Item, Root } from "./toggle-group";

// ---- single ----

describe("ToggleGroup single", () => {
  it("아이템이 렌더링된다", () => {
    render(
      <Root type="single">
        <Item value="a">A</Item>
        <Item value="b">B</Item>
      </Root>,
    );
    expect(screen.getByRole("button", { name: "A" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "B" })).toBeTruthy();
  });

  it("클릭하면 data-state가 on이 된다", () => {
    render(
      <Root type="single">
        <Item value="a">A</Item>
      </Root>,
    );
    const btn = screen.getByRole("button", { name: "A" });
    expect(btn.getAttribute("data-state")).toBe("off");
    fireEvent.click(btn);
    expect(btn.getAttribute("data-state")).toBe("on");
  });

  it("선택된 아이템을 다시 클릭하면 해제된다", () => {
    render(
      <Root type="single" defaultValue="a">
        <Item value="a">A</Item>
      </Root>,
    );
    const btn = screen.getByRole("button", { name: "A" });
    expect(btn.getAttribute("data-state")).toBe("on");
    fireEvent.click(btn);
    expect(btn.getAttribute("data-state")).toBe("off");
  });

  it("다른 아이템 클릭 시 이전 아이템이 해제된다", () => {
    render(
      <Root type="single" defaultValue="a">
        <Item value="a">A</Item>
        <Item value="b">B</Item>
      </Root>,
    );
    const a = screen.getByRole("button", { name: "A" });
    const b = screen.getByRole("button", { name: "B" });
    expect(a.getAttribute("data-state")).toBe("on");
    fireEvent.click(b);
    expect(a.getAttribute("data-state")).toBe("off");
    expect(b.getAttribute("data-state")).toBe("on");
  });

  it("controlled mode — onValueChange가 호출된다", () => {
    const onChange = vi.fn();
    render(
      <Root type="single" value="a" onValueChange={onChange}>
        <Item value="a">A</Item>
        <Item value="b">B</Item>
      </Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "B" }));
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("disabled 시 클릭해도 상태가 변하지 않는다", () => {
    render(
      <Root type="single" disabled>
        <Item value="a">A</Item>
      </Root>,
    );
    const btn = screen.getByRole("button", { name: "A" });
    expect((btn as HTMLButtonElement).disabled).toBe(true);
  });

  it("개별 아이템 disabled", () => {
    render(
      <Root type="single">
        <Item value="a" disabled>
          A
        </Item>
        <Item value="b">B</Item>
      </Root>,
    );
    expect((screen.getByRole("button", { name: "A" }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole("button", { name: "B" }) as HTMLButtonElement).disabled).toBe(false);
  });

  it("onClick에서 preventDefault하면 토글되지 않는다", () => {
    render(
      <Root type="single">
        <Item value="a" onClick={(e) => e.preventDefault()}>
          A
        </Item>
      </Root>,
    );
    const btn = screen.getByRole("button", { name: "A" });
    fireEvent.click(btn);
    expect(btn.getAttribute("data-state")).toBe("off");
  });
});

// ---- multiple ----

describe("ToggleGroup multiple", () => {
  it("여러 아이템을 동시에 선택할 수 있다", () => {
    render(
      <Root type="multiple">
        <Item value="a">A</Item>
        <Item value="b">B</Item>
      </Root>,
    );
    const a = screen.getByRole("button", { name: "A" });
    const b = screen.getByRole("button", { name: "B" });
    fireEvent.click(a);
    fireEvent.click(b);
    expect(a.getAttribute("data-state")).toBe("on");
    expect(b.getAttribute("data-state")).toBe("on");
  });

  it("선택된 아이템을 다시 클릭하면 해제된다", () => {
    render(
      <Root type="multiple" defaultValue={["a", "b"]}>
        <Item value="a">A</Item>
        <Item value="b">B</Item>
      </Root>,
    );
    const a = screen.getByRole("button", { name: "A" });
    fireEvent.click(a);
    expect(a.getAttribute("data-state")).toBe("off");
    expect(screen.getByRole("button", { name: "B" }).getAttribute("data-state")).toBe("on");
  });

  it("controlled mode — onValueChange가 배열로 호출된다", () => {
    const onChange = vi.fn();
    render(
      <Root type="multiple" value={["a"]} onValueChange={onChange}>
        <Item value="a">A</Item>
        <Item value="b">B</Item>
      </Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "B" }));
    expect(onChange).toHaveBeenCalledWith(["a", "b"]);
  });

  it("Item이 Root 밖에 있으면 에러가 발생한다", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Item value="a">A</Item>)).toThrow(
      "ToggleGroup.Item must be used within ToggleGroup.Root",
    );
    consoleError.mockRestore();
  });
});
