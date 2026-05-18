import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as Popover from "./popover";

function BasicPopover({
  open,
  defaultOpen,
  onOpenChange,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const rootProps = {
    ...(open !== undefined && { open }),
    ...(defaultOpen !== undefined && { defaultOpen }),
    ...(onOpenChange !== undefined && { onOpenChange }),
  };
  return (
    <Popover.Root {...rootProps}>
      <Popover.Trigger>열기</Popover.Trigger>
      <Popover.Content>
        <p>팝오버 내용</p>
        <Popover.Close>닫기</Popover.Close>
      </Popover.Content>
    </Popover.Root>
  );
}

describe("Popover", () => {
  describe("기본 동작", () => {
    it("기본적으로 닫혀 있다", () => {
      render(<BasicPopover />);
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("트리거 클릭으로 열린다", () => {
      render(<BasicPopover />);
      fireEvent.click(screen.getByRole("button", { name: "열기" }));
      expect(screen.getByRole("dialog")).toBeTruthy();
    });

    it("트리거 재클릭으로 닫힌다", () => {
      render(<BasicPopover />);
      const trigger = screen.getByRole("button", { name: "열기" });
      fireEvent.click(trigger);
      fireEvent.click(trigger);
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("닫기 버튼으로 닫힌다", () => {
      render(<BasicPopover />);
      fireEvent.click(screen.getByRole("button", { name: "열기" }));
      fireEvent.click(screen.getByRole("button", { name: "닫기" }));
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("Escape 키로 닫힌다", () => {
      render(<BasicPopover />);
      fireEvent.click(screen.getByRole("button", { name: "열기" }));
      fireEvent.keyDown(document, { key: "Escape" });
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("외부 영역 포인터 다운으로 닫힌다", () => {
      render(
        <div>
          <BasicPopover />
          <div data-testid="outside">외부</div>
        </div>,
      );
      fireEvent.click(screen.getByRole("button", { name: "열기" }));
      fireEvent.pointerDown(screen.getByTestId("outside"));
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("트리거 포인터 다운은 외부 클릭으로 처리되지 않는다", () => {
      render(<BasicPopover />);
      const trigger = screen.getByRole("button", { name: "열기" });
      fireEvent.click(trigger);
      fireEvent.pointerDown(trigger);
      expect(screen.getByRole("dialog")).toBeTruthy();
    });
  });

  describe("제어 모드", () => {
    it("open=true이면 처음부터 열린 상태이다", () => {
      render(<BasicPopover open={true} />);
      expect(screen.getByRole("dialog")).toBeTruthy();
    });

    it("open=false이면 닫힌 상태이다", () => {
      render(<BasicPopover open={false} />);
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("트리거 클릭 시 onOpenChange(true)가 호출된다", () => {
      const onOpenChange = vi.fn();
      render(<BasicPopover open={false} onOpenChange={onOpenChange} />);
      fireEvent.click(screen.getByRole("button", { name: "열기" }));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("열린 상태에서 트리거 클릭 시 onOpenChange(false)가 호출된다", () => {
      const onOpenChange = vi.fn();
      render(<BasicPopover open={true} onOpenChange={onOpenChange} />);
      fireEvent.click(screen.getByRole("button", { name: "열기" }));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("비제어 모드", () => {
    it("defaultOpen=true이면 처음부터 열린다", () => {
      render(<BasicPopover defaultOpen={true} />);
      expect(screen.getByRole("dialog")).toBeTruthy();
    });
  });

  describe("ARIA 속성", () => {
    it("트리거에 aria-haspopup='dialog'가 있다", () => {
      render(<BasicPopover />);
      expect(screen.getByRole("button", { name: "열기" }).getAttribute("aria-haspopup")).toBe(
        "dialog",
      );
    });

    it("닫힌 상태에서 트리거의 aria-expanded는 false이다", () => {
      render(<BasicPopover />);
      expect(screen.getByRole("button", { name: "열기" }).getAttribute("aria-expanded")).toBe(
        "false",
      );
    });

    it("열린 상태에서 트리거의 aria-expanded는 true이다", () => {
      render(<BasicPopover />);
      fireEvent.click(screen.getByRole("button", { name: "열기" }));
      expect(screen.getByRole("button", { name: "열기" }).getAttribute("aria-expanded")).toBe(
        "true",
      );
    });

    it("열리면 트리거의 aria-controls가 콘텐츠 id를 가리킨다", () => {
      render(<BasicPopover />);
      fireEvent.click(screen.getByRole("button", { name: "열기" }));
      const contentId = screen.getByRole("dialog").getAttribute("id");
      expect(screen.getByRole("button", { name: "열기" }).getAttribute("aria-controls")).toBe(
        contentId,
      );
    });

    it("닫힌 상태에서 트리거의 aria-controls는 없다", () => {
      render(<BasicPopover />);
      expect(screen.getByRole("button", { name: "열기" }).hasAttribute("aria-controls")).toBe(
        false,
      );
    });
  });

  describe("data-state", () => {
    it("닫힌 상태에서 트리거의 data-state는 closed이다", () => {
      render(<BasicPopover />);
      expect(screen.getByRole("button", { name: "열기" }).getAttribute("data-state")).toBe(
        "closed",
      );
    });

    it("열린 상태에서 트리거의 data-state는 open이다", () => {
      render(<BasicPopover />);
      fireEvent.click(screen.getByRole("button", { name: "열기" }));
      expect(screen.getByRole("button", { name: "열기" }).getAttribute("data-state")).toBe("open");
    });

    it("콘텐츠의 data-state는 open이다", () => {
      render(<BasicPopover />);
      fireEvent.click(screen.getByRole("button", { name: "열기" }));
      expect(screen.getByRole("dialog").getAttribute("data-state")).toBe("open");
    });
  });

  describe("이벤트 커스터마이징", () => {
    it("onEscapeKeyDown에서 preventDefault하면 닫히지 않는다", () => {
      render(
        <Popover.Root defaultOpen>
          <Popover.Trigger>열기</Popover.Trigger>
          <Popover.Content onEscapeKeyDown={(e) => e.preventDefault()}>
            <p>내용</p>
          </Popover.Content>
        </Popover.Root>,
      );
      fireEvent.keyDown(document, { key: "Escape" });
      expect(screen.getByRole("dialog")).toBeTruthy();
    });

    it("onPointerDownOutside에서 preventDefault하면 닫히지 않는다", () => {
      render(
        <div>
          <Popover.Root defaultOpen>
            <Popover.Trigger>열기</Popover.Trigger>
            <Popover.Content onPointerDownOutside={(e) => e.preventDefault()}>
              <p>내용</p>
            </Popover.Content>
          </Popover.Root>
          <div data-testid="outside">외부</div>
        </div>,
      );
      fireEvent.pointerDown(screen.getByTestId("outside"));
      expect(screen.getByRole("dialog")).toBeTruthy();
    });

    it("트리거의 onClick에서 preventDefault하면 열리지 않는다", () => {
      render(
        <Popover.Root>
          <Popover.Trigger onClick={(e) => e.preventDefault()}>열기</Popover.Trigger>
          <Popover.Content>
            <p>내용</p>
          </Popover.Content>
        </Popover.Root>,
      );
      fireEvent.click(screen.getByRole("button", { name: "열기" }));
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  describe("Anchor", () => {
    it("커스텀 Anchor를 렌더링할 수 있다", () => {
      render(
        <Popover.Root>
          <Popover.Anchor data-testid="anchor">
            <span>앵커</span>
          </Popover.Anchor>
          <Popover.Trigger>열기</Popover.Trigger>
          <Popover.Content>
            <p>내용</p>
          </Popover.Content>
        </Popover.Root>,
      );
      expect(screen.getByTestId("anchor")).toBeTruthy();
    });
  });
});
