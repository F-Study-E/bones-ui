import { fireEvent, render } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { Root, Thumb } from "./switch";

describe("Switch", () => {
  describe("기본 렌더", () => {
    it("role='switch'로 렌더된다", () => {
      const { getByRole } = render(<Root />);
      expect(getByRole("switch")).toBeDefined();
    });

    it("기본 상태는 unchecked이다", () => {
      const { getByRole } = render(<Root />);
      const el = getByRole("switch");
      expect(el.getAttribute("aria-checked")).toBe("false");
      expect(el.getAttribute("data-state")).toBe("unchecked");
      expect(el.hasAttribute("data-checked")).toBe(false);
    });

    it("type='button'으로 렌더된다 (form submit 방지)", () => {
      const { getByRole } = render(<Root />);
      expect(getByRole("switch").getAttribute("type")).toBe("button");
    });
  });

  describe("비제어 모드", () => {
    it("defaultChecked로 초기 상태를 설정한다", () => {
      const { getByRole } = render(<Root defaultChecked />);
      const el = getByRole("switch");
      expect(el.getAttribute("aria-checked")).toBe("true");
      expect(el.getAttribute("data-state")).toBe("checked");
      expect(el.hasAttribute("data-checked")).toBe(true);
    });

    it("클릭 시 토글된다", () => {
      const onCheckedChange = vi.fn();
      const { getByRole } = render(<Root onCheckedChange={onCheckedChange} />);
      const el = getByRole("switch");
      fireEvent.click(el);
      expect(el.getAttribute("aria-checked")).toBe("true");
      expect(onCheckedChange).toHaveBeenCalledWith(true);
      fireEvent.click(el);
      expect(el.getAttribute("aria-checked")).toBe("false");
      expect(onCheckedChange).toHaveBeenLastCalledWith(false);
    });
  });

  describe("제어 모드", () => {
    it("checked prop만 반영하고 내부 상태는 변경하지 않는다", () => {
      const onCheckedChange = vi.fn();
      const { getByRole } = render(<Root checked={false} onCheckedChange={onCheckedChange} />);
      const el = getByRole("switch");
      fireEvent.click(el);
      expect(onCheckedChange).toHaveBeenCalledWith(true);
      expect(el.getAttribute("aria-checked")).toBe("false");
    });

    it("checked prop이 변경되면 화면이 따라간다", () => {
      const { getByRole, rerender } = render(<Root checked={false} />);
      expect(getByRole("switch").getAttribute("aria-checked")).toBe("false");
      rerender(<Root checked={true} />);
      expect(getByRole("switch").getAttribute("aria-checked")).toBe("true");
    });
  });

  describe("키보드", () => {
    it("Space 키로 토글된다", () => {
      const { getByRole } = render(<Root />);
      const el = getByRole("switch");
      el.focus();
      fireEvent.keyDown(el, { key: " " });
      fireEvent.keyUp(el, { key: " " });
      fireEvent.click(el);
      expect(el.getAttribute("aria-checked")).toBe("true");
    });

    it("Enter 키로 토글된다", () => {
      const { getByRole } = render(<Root />);
      const el = getByRole("switch");
      el.focus();
      fireEvent.keyDown(el, { key: "Enter" });
      fireEvent.click(el);
      expect(el.getAttribute("aria-checked")).toBe("true");
    });
  });

  describe("disabled", () => {
    it("disabled 속성이 부착된다", () => {
      const { getByRole } = render(<Root disabled />);
      const el = getByRole("switch") as HTMLButtonElement;
      expect(el.disabled).toBe(true);
      expect(el.getAttribute("data-disabled")).toBe("");
    });

    it("disabled일 때 클릭이 무시된다", () => {
      const onCheckedChange = vi.fn();
      const { getByRole } = render(<Root disabled onCheckedChange={onCheckedChange} />);
      fireEvent.click(getByRole("switch"));
      expect(onCheckedChange).not.toHaveBeenCalled();
    });
  });

  describe("이벤트 합성", () => {
    it("onClick에서 preventDefault하면 토글이 취소된다", () => {
      const onCheckedChange = vi.fn();
      const { getByRole } = render(
        <Root onClick={(e) => e.preventDefault()} onCheckedChange={onCheckedChange} />,
      );
      const el = getByRole("switch");
      fireEvent.click(el);
      expect(onCheckedChange).not.toHaveBeenCalled();
      expect(el.getAttribute("aria-checked")).toBe("false");
    });

    it("사용자 onClick과 내부 토글이 모두 호출된다", () => {
      const onClick = vi.fn();
      const onCheckedChange = vi.fn();
      const { getByRole } = render(<Root onClick={onClick} onCheckedChange={onCheckedChange} />);
      fireEvent.click(getByRole("switch"));
      expect(onClick).toHaveBeenCalled();
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });
  });

  describe("Thumb", () => {
    it("Root checked 상태가 Thumb data-state에 동기화된다", () => {
      const { getByTestId, rerender } = render(
        <Root checked={false}>
          <Thumb data-testid="thumb" />
        </Root>,
      );
      expect(getByTestId("thumb").getAttribute("data-state")).toBe("unchecked");
      rerender(
        <Root checked={true}>
          <Thumb data-testid="thumb" />
        </Root>,
      );
      expect(getByTestId("thumb").getAttribute("data-state")).toBe("checked");
    });

    it("Switch.Root 외부에서 사용 시 throw한다", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() => render(<Thumb />)).toThrow(/must be used within `Switch\.Root`/);
      spy.mockRestore();
    });
  });

  describe("Form 통합", () => {
    it("form 안에서 name이 있으면 hidden checkbox가 렌더된다", () => {
      const { container } = render(
        <form>
          <Root name="agree" />
        </form>,
      );
      const hidden = container.querySelector('input[type="checkbox"][name="agree"]');
      expect(hidden).not.toBeNull();
      expect((hidden as HTMLInputElement).getAttribute("aria-hidden")).toBe("true");
    });

    it("form submit 시 checked=true이면 FormData에 값이 포함된다", () => {
      const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        return data.get("agree");
      });
      const { getByTestId } = render(
        <form data-testid="form" onSubmit={onSubmit}>
          <Root name="agree" defaultChecked />
          <button type="submit">submit</button>
        </form>,
      );
      fireEvent.submit(getByTestId("form"));
      expect(onSubmit).toHaveBeenCalled();
      expect(onSubmit.mock.results[0]?.value).toBe("on");
    });

    it("form 밖에서는 hidden checkbox가 렌더되지 않는다", () => {
      const { container } = render(<Root name="agree" />);
      expect(container.querySelector('input[type="checkbox"]')).toBeNull();
    });
  });

  describe("asChild", () => {
    it("Root에 asChild를 주면 자식 요소로 렌더된다", () => {
      const { getByRole } = render(
        <Root asChild defaultChecked>
          <span>토글</span>
        </Root>,
      );
      const el = getByRole("switch");
      expect(el.tagName).toBe("SPAN");
      expect(el.getAttribute("aria-checked")).toBe("true");
    });

    it("Thumb에 asChild를 주면 자식 요소로 렌더된다", () => {
      const { getByTestId } = render(
        <Root defaultChecked>
          <Thumb asChild>
            <div data-testid="custom-thumb" />
          </Thumb>
        </Root>,
      );
      const thumb = getByTestId("custom-thumb");
      expect(thumb.tagName).toBe("DIV");
      expect(thumb.getAttribute("data-state")).toBe("checked");
    });
  });

  describe("ref 전달", () => {
    it("Root ref가 button 노드를 가리킨다", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Root ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("Thumb ref가 span 노드를 가리킨다", () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(
        <Root>
          <Thumb ref={ref} />
        </Root>,
      );
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });
});
