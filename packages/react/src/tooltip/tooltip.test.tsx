import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Content, Root, Trigger } from "./tooltip";

function TestTooltip({
  open,
  defaultOpen,
  onOpenChange,
  delayDuration = 0,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
}) {
  return (
    <Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      delayDuration={delayDuration}
    >
      <Trigger>버튼</Trigger>
      <Content>툴팁 내용</Content>
    </Root>
  );
}

describe("Tooltip", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("기본 렌더링 — 트리거와 콘텐츠가 DOM에 존재한다", () => {
    render(<TestTooltip />);
    expect(screen.getByRole("button", { name: "버튼" })).toBeTruthy();
    expect(screen.getByRole("tooltip", { hidden: true })).toBeTruthy();
  });

  it("기본 상태에서 콘텐츠는 data-state=closed, aria-hidden=true", () => {
    render(<TestTooltip />);
    const content = screen.getByRole("tooltip", { hidden: true });
    expect(content.getAttribute("data-state")).toBe("closed");
    expect(content.getAttribute("aria-hidden")).toBe("true");
  });

  it("defaultOpen=true이면 처음부터 열려 있다", () => {
    render(<TestTooltip defaultOpen />);
    const content = screen.getByRole("tooltip");
    expect(content.getAttribute("data-state")).toBe("open");
    expect(content.getAttribute("aria-hidden")).toBeNull();
  });

  it("포커스 시 즉시 열린다", () => {
    render(<TestTooltip />);
    const trigger = screen.getByRole("button", { name: "버튼" });
    fireEvent.focus(trigger);
    expect(screen.getByRole("tooltip").getAttribute("data-state")).toBe("open");
  });

  it("블러 시 닫힌다", () => {
    render(<TestTooltip defaultOpen />);
    const trigger = screen.getByRole("button", { name: "버튼" });
    fireEvent.focus(trigger);
    fireEvent.blur(trigger);
    expect(screen.getByRole("tooltip", { hidden: true }).getAttribute("data-state")).toBe("closed");
  });

  it("Escape 키로 닫힌다", () => {
    render(<TestTooltip defaultOpen />);
    const trigger = screen.getByRole("button", { name: "버튼" });
    fireEvent.focus(trigger);
    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(screen.getByRole("tooltip", { hidden: true }).getAttribute("data-state")).toBe("closed");
  });

  it("마우스 진입 후 delay 경과 시 열린다", () => {
    render(<TestTooltip delayDuration={500} />);
    const trigger = screen.getByRole("button", { name: "버튼" });
    fireEvent.mouseEnter(trigger);
    expect(screen.getByRole("tooltip", { hidden: true }).getAttribute("data-state")).toBe("closed");
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByRole("tooltip").getAttribute("data-state")).toBe("open");
  });

  it("delay 중 마우스 이탈 시 열리지 않는다", () => {
    render(<TestTooltip delayDuration={500} />);
    const trigger = screen.getByRole("button", { name: "버튼" });
    fireEvent.mouseEnter(trigger);
    fireEvent.mouseLeave(trigger);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByRole("tooltip", { hidden: true }).getAttribute("data-state")).toBe("closed");
  });

  it("트리거 마우스 이탈 후 grace period 경과 시 닫힌다", () => {
    render(<TestTooltip defaultOpen />);
    const trigger = screen.getByRole("button", { name: "버튼" });
    fireEvent.mouseLeave(trigger);
    // grace period(300ms) 전에는 아직 열려 있음
    expect(screen.getByRole("tooltip").getAttribute("data-state")).toBe("open");
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByRole("tooltip", { hidden: true }).getAttribute("data-state")).toBe("closed");
  });

  it("트리거 이탈 후 콘텐츠 진입 시 열린 상태를 유지한다", () => {
    render(<TestTooltip defaultOpen />);
    const trigger = screen.getByRole("button", { name: "버튼" });
    const content = screen.getByRole("tooltip");
    fireEvent.mouseLeave(trigger);
    fireEvent.mouseEnter(content);
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(content.getAttribute("data-state")).toBe("open");
  });

  it("콘텐츠에서 마우스 이탈 시 즉시 닫힌다", () => {
    render(<TestTooltip defaultOpen />);
    const content = screen.getByRole("tooltip");
    fireEvent.mouseEnter(content);
    fireEvent.mouseLeave(content);
    expect(screen.getByRole("tooltip", { hidden: true }).getAttribute("data-state")).toBe("closed");
  });

  it("delayDuration=0이면 마우스 진입 시 즉시 열린다", () => {
    render(<TestTooltip delayDuration={0} />);
    const trigger = screen.getByRole("button", { name: "버튼" });
    fireEvent.mouseEnter(trigger);
    expect(screen.getByRole("tooltip").getAttribute("data-state")).toBe("open");
  });

  it("controlled mode — open prop이 열림/닫힘을 제어한다", () => {
    const { rerender } = render(<TestTooltip open={false} />);
    expect(screen.getByRole("tooltip", { hidden: true }).getAttribute("data-state")).toBe("closed");
    rerender(<TestTooltip open={true} />);
    expect(screen.getByRole("tooltip").getAttribute("data-state")).toBe("open");
  });

  it("controlled mode — onOpenChange가 호출된다", () => {
    const onChange = vi.fn();
    render(<TestTooltip open={false} onOpenChange={onChange} />);
    fireEvent.focus(screen.getByRole("button", { name: "버튼" }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("열릴 때 트리거에 aria-describedby가 설정된다", () => {
    render(<TestTooltip defaultOpen />);
    const trigger = screen.getByRole("button", { name: "버튼" });
    const content = screen.getByRole("tooltip");
    expect(trigger.getAttribute("aria-describedby")).toBe(content.id);
  });

  it("닫혀 있을 때 트리거에 aria-describedby가 없다", () => {
    render(<TestTooltip />);
    const trigger = screen.getByRole("button", { name: "버튼" });
    expect(trigger.getAttribute("aria-describedby")).toBeNull();
  });

  it("트리거 data-state가 open/closed로 토글된다", () => {
    render(<TestTooltip />);
    const trigger = screen.getByRole("button", { name: "버튼" });
    expect(trigger.getAttribute("data-state")).toBe("closed");
    fireEvent.focus(trigger);
    expect(trigger.getAttribute("data-state")).toBe("open");
  });

  it("Trigger가 Root 밖에 있으면 에러가 발생한다", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Trigger>버튼</Trigger>)).toThrow(
      "`Tooltip.Trigger` must be used within `Tooltip.Root`",
    );
    consoleError.mockRestore();
  });

  it("Content가 Root 밖에 있으면 에러가 발생한다", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Content>내용</Content>)).toThrow(
      "`Tooltip.Content` must be used within `Tooltip.Root`",
    );
    consoleError.mockRestore();
  });

  it("a11y — 열린 상태에서 role/aria 속성이 올바르다", () => {
    render(<TestTooltip defaultOpen />);
    const trigger = screen.getByRole("button", { name: "버튼" });
    const content = screen.getByRole("tooltip");
    expect(content.getAttribute("role")).toBe("tooltip");
    expect(trigger.getAttribute("aria-describedby")).toBe(content.id);
    expect(content.getAttribute("aria-hidden")).toBeNull();
  });
});
