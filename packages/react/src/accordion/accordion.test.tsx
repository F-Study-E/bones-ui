import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { Content, Item, Root, Trigger } from "./accordion";

function TestAccordion() {
  return (
    <Root type="single" collapsible>
      <Item value="item-1">
        <Trigger>트리거 1</Trigger>
        <Content>내용 1</Content>
      </Item>
      <Item value="item-2">
        <Trigger>트리거 2</Trigger>
        <Content>내용 2</Content>
      </Item>
    </Root>
  );
}

describe("Accordion", () => {
  describe("기본 렌더", () => {
    it("Trigger가 button으로 렌더된다", () => {
      render(<TestAccordion />);
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);
    });

    it("초기 상태에서 모든 Content의 data-state가 closed이다", () => {
      render(<TestAccordion />);
      const sections = document.querySelectorAll("section");
      for (const section of sections) {
        expect(section.getAttribute("data-state")).toBe("closed");
        expect(section.hasAttribute("data-open")).toBe(false);
      }
    });

    it("Trigger에 aria-expanded=false가 기본으로 설정된다", () => {
      render(<TestAccordion />);
      const buttons = screen.getAllByRole("button");
      expect(buttons[0]?.getAttribute("aria-expanded")).toBe("false");
    });

    it("Trigger에 type=button이 설정된다", () => {
      render(<TestAccordion />);
      const buttons = screen.getAllByRole("button") as HTMLButtonElement[];
      expect(buttons[0]?.getAttribute("type")).toBe("button");
    });
  });

  describe("단일 모드 (type=single)", () => {
    it("Trigger 클릭 시 해당 Content가 열린다", () => {
      render(<TestAccordion />);
      const trigger1 = screen.getByText("트리거 1");
      fireEvent.click(trigger1);
      expect(trigger1.getAttribute("aria-expanded")).toBe("true");
      expect(trigger1.getAttribute("data-state")).toBe("open");
    });

    it("다른 항목 클릭 시 이전 항목이 닫힌다", () => {
      render(<TestAccordion />);
      const trigger1 = screen.getByText("트리거 1");
      const trigger2 = screen.getByText("트리거 2");
      fireEvent.click(trigger1);
      expect(trigger1.getAttribute("aria-expanded")).toBe("true");
      fireEvent.click(trigger2);
      expect(trigger1.getAttribute("aria-expanded")).toBe("false");
      expect(trigger2.getAttribute("aria-expanded")).toBe("true");
    });

    it("collapsible=true일 때 열린 항목을 다시 클릭하면 닫힌다", () => {
      render(<TestAccordion />);
      const trigger1 = screen.getByText("트리거 1");
      fireEvent.click(trigger1);
      expect(trigger1.getAttribute("aria-expanded")).toBe("true");
      fireEvent.click(trigger1);
      expect(trigger1.getAttribute("aria-expanded")).toBe("false");
    });

    it("collapsible=false일 때 열린 항목을 다시 클릭해도 닫히지 않는다", () => {
      render(
        <Root type="single">
          <Item value="item-1">
            <Trigger>트리거 1</Trigger>
            <Content>내용 1</Content>
          </Item>
        </Root>,
      );
      const trigger1 = screen.getByText("트리거 1");
      fireEvent.click(trigger1);
      expect(trigger1.getAttribute("aria-expanded")).toBe("true");
      fireEvent.click(trigger1);
      expect(trigger1.getAttribute("aria-expanded")).toBe("true");
    });
  });

  describe("다중 모드 (type=multiple)", () => {
    it("여러 항목이 동시에 열릴 수 있다", () => {
      render(
        <Root type="multiple">
          <Item value="item-1">
            <Trigger>트리거 1</Trigger>
            <Content>내용 1</Content>
          </Item>
          <Item value="item-2">
            <Trigger>트리거 2</Trigger>
            <Content>내용 2</Content>
          </Item>
        </Root>,
      );
      const trigger1 = screen.getByText("트리거 1");
      const trigger2 = screen.getByText("트리거 2");
      fireEvent.click(trigger1);
      fireEvent.click(trigger2);
      expect(trigger1.getAttribute("aria-expanded")).toBe("true");
      expect(trigger2.getAttribute("aria-expanded")).toBe("true");
    });

    it("열린 항목을 다시 클릭하면 닫힌다", () => {
      render(
        <Root type="multiple">
          <Item value="item-1">
            <Trigger>트리거 1</Trigger>
            <Content>내용 1</Content>
          </Item>
        </Root>,
      );
      const trigger1 = screen.getByText("트리거 1");
      fireEvent.click(trigger1);
      expect(trigger1.getAttribute("aria-expanded")).toBe("true");
      fireEvent.click(trigger1);
      expect(trigger1.getAttribute("aria-expanded")).toBe("false");
    });
  });

  describe("제어 모드", () => {
    it("value prop이 변경되면 화면이 따라간다", () => {
      const { rerender } = render(
        <Root type="single" value="">
          <Item value="item-1">
            <Trigger>트리거 1</Trigger>
            <Content>내용 1</Content>
          </Item>
        </Root>,
      );
      const trigger1 = screen.getByText("트리거 1");
      expect(trigger1.getAttribute("aria-expanded")).toBe("false");
      rerender(
        <Root type="single" value="item-1">
          <Item value="item-1">
            <Trigger>트리거 1</Trigger>
            <Content>내용 1</Content>
          </Item>
        </Root>,
      );
      expect(trigger1.getAttribute("aria-expanded")).toBe("true");
    });

    it("onValueChange가 클릭 시 호출된다", () => {
      const onValueChange = vi.fn();
      render(
        <Root type="single" value="" onValueChange={onValueChange}>
          <Item value="item-1">
            <Trigger>트리거 1</Trigger>
            <Content>내용 1</Content>
          </Item>
        </Root>,
      );
      fireEvent.click(screen.getByText("트리거 1"));
      expect(onValueChange).toHaveBeenCalledWith("item-1");
    });
  });

  describe("비제어 모드", () => {
    it("defaultValue로 초기 열린 항목을 설정한다", () => {
      render(
        <Root type="single" defaultValue="item-1">
          <Item value="item-1">
            <Trigger>트리거 1</Trigger>
            <Content>내용 1</Content>
          </Item>
          <Item value="item-2">
            <Trigger>트리거 2</Trigger>
            <Content>내용 2</Content>
          </Item>
        </Root>,
      );
      expect(screen.getByText("트리거 1").getAttribute("aria-expanded")).toBe("true");
      expect(screen.getByText("트리거 2").getAttribute("aria-expanded")).toBe("false");
    });
  });

  describe("disabled", () => {
    it("Root disabled일 때 모든 Trigger가 비활성화된다", () => {
      render(
        <Root type="single" disabled>
          <Item value="item-1">
            <Trigger>트리거 1</Trigger>
            <Content>내용 1</Content>
          </Item>
          <Item value="item-2">
            <Trigger>트리거 2</Trigger>
            <Content>내용 2</Content>
          </Item>
        </Root>,
      );
      const buttons = screen.getAllByRole("button") as HTMLButtonElement[];
      for (const btn of buttons) {
        expect(btn.disabled).toBe(true);
        expect(btn.getAttribute("data-disabled")).toBe("");
      }
    });

    it("Item disabled일 때 해당 Trigger만 비활성화된다", () => {
      render(
        <Root type="single">
          <Item value="item-1" disabled>
            <Trigger>트리거 1</Trigger>
            <Content>내용 1</Content>
          </Item>
          <Item value="item-2">
            <Trigger>트리거 2</Trigger>
            <Content>내용 2</Content>
          </Item>
        </Root>,
      );
      const buttons = screen.getAllByRole("button") as HTMLButtonElement[];
      expect(buttons[0]?.disabled).toBe(true);
      expect(buttons[1]?.disabled).toBe(false);
    });

    it("disabled Trigger 클릭 시 onValueChange가 호출되지 않는다", () => {
      const onValueChange = vi.fn();
      render(
        <Root type="single" onValueChange={onValueChange} disabled>
          <Item value="item-1">
            <Trigger>트리거 1</Trigger>
            <Content>내용 1</Content>
          </Item>
        </Root>,
      );
      fireEvent.click(screen.getByText("트리거 1"));
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("접근성", () => {
    it("Trigger의 aria-controls가 Content id를 가리킨다", () => {
      render(
        <Root type="single">
          <Item value="item-1">
            <Trigger>트리거 1</Trigger>
            <Content>내용 1</Content>
          </Item>
        </Root>,
      );
      const trigger = screen.getByText("트리거 1");
      fireEvent.click(trigger);
      const contentId = trigger.getAttribute("aria-controls");
      const content = document.getElementById(contentId ?? "");
      expect(content).not.toBeNull();
      expect(content?.tagName.toLowerCase()).toBe("section");
    });

    it("Content의 aria-labelledby가 Trigger id를 가리킨다", () => {
      render(
        <Root type="single">
          <Item value="item-1">
            <Trigger>트리거 1</Trigger>
            <Content>내용 1</Content>
          </Item>
        </Root>,
      );
      const trigger = screen.getByText("트리거 1");
      fireEvent.click(trigger);
      const triggerId = trigger.id;
      const content = document.querySelector("section");
      expect(content?.getAttribute("aria-labelledby")).toBe(triggerId);
    });
  });

  describe("이벤트 합성", () => {
    it("onClick에서 preventDefault하면 토글이 취소된다", () => {
      const onValueChange = vi.fn();
      render(
        <Root type="single" onValueChange={onValueChange}>
          <Item value="item-1">
            <Trigger onClick={(e) => e.preventDefault()}>트리거 1</Trigger>
            <Content>내용 1</Content>
          </Item>
        </Root>,
      );
      fireEvent.click(screen.getByText("트리거 1"));
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("사용자 onClick과 내부 토글이 모두 호출된다", () => {
      const onClick = vi.fn();
      const onValueChange = vi.fn();
      render(
        <Root type="single" onValueChange={onValueChange}>
          <Item value="item-1">
            <Trigger onClick={onClick}>트리거 1</Trigger>
            <Content>내용 1</Content>
          </Item>
        </Root>,
      );
      fireEvent.click(screen.getByText("트리거 1"));
      expect(onClick).toHaveBeenCalled();
      expect(onValueChange).toHaveBeenCalledWith("item-1");
    });
  });

  describe("data-state", () => {
    it("닫힌 항목의 data-state는 closed이다", () => {
      render(<TestAccordion />);
      const trigger = screen.getByText("트리거 1");
      expect(trigger.getAttribute("data-state")).toBe("closed");
      expect(trigger.hasAttribute("data-open")).toBe(false);
    });

    it("열린 항목의 data-state는 open이고 data-open이 부착된다", () => {
      render(<TestAccordion />);
      const trigger = screen.getByText("트리거 1");
      fireEvent.click(trigger);
      expect(trigger.getAttribute("data-state")).toBe("open");
      expect(trigger.getAttribute("data-open")).toBe("");
    });
  });

  describe("컨텍스트 오류", () => {
    it("Root 외부에서 Item 사용 시 throw한다", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() =>
        render(
          <Item value="test">
            <Trigger>트리거</Trigger>
          </Item>,
        ),
      ).toThrow(/must be used within `Accordion.Root`/);
      spy.mockRestore();
    });

    it("Item 외부에서 Trigger 사용 시 throw한다", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() =>
        render(
          <Root type="single">
            <Trigger>트리거</Trigger>
          </Root>,
        ),
      ).toThrow(/must be used within `Accordion.Item`/);
      spy.mockRestore();
    });
  });

  describe("ref 전달", () => {
    it("Root ref가 div 노드를 가리킨다", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Root type="single" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("Trigger ref가 button 노드를 가리킨다", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <Root type="single">
          <Item value="item-1">
            <Trigger ref={ref}>트리거 1</Trigger>
            <Content>내용 1</Content>
          </Item>
        </Root>,
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("Content ref가 section 노드를 가리킨다", () => {
      const ref = React.createRef<HTMLElement>();
      render(
        <Root type="single" defaultValue="item-1">
          <Item value="item-1">
            <Trigger>트리거 1</Trigger>
            <Content ref={ref}>내용 1</Content>
          </Item>
        </Root>,
      );
      expect(ref.current?.tagName.toLowerCase()).toBe("section");
    });
  });
});
