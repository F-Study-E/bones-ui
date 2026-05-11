import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useControllableState } from "./use-controllable-state";

describe("useControllableState", () => {
  describe("비제어 모드", () => {
    it("defaultProp으로 초기값을 설정한다", () => {
      const { result } = renderHook(() =>
        useControllableState({
          defaultProp: false,
        }),
      );
      expect(result.current[0]).toBe(false);
    });

    it("setter 호출 시 내부 state가 변경된다", () => {
      const { result } = renderHook(() =>
        useControllableState<boolean>({
          defaultProp: false,
        }),
      );
      act(() => result.current[1](true));
      expect(result.current[0]).toBe(true);
    });

    it("setter는 함수형 업데이트를 지원한다", () => {
      const { result } = renderHook(() =>
        useControllableState<number>({
          defaultProp: 0,
        }),
      );
      act(() => result.current[1]((prev) => (prev ?? 0) + 1));
      expect(result.current[0]).toBe(1);
      act(() => result.current[1]((prev) => (prev ?? 0) + 1));
      expect(result.current[0]).toBe(2);
    });

    it("값이 실제로 바뀌면 onChange가 호출된다", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useControllableState<boolean>({
          defaultProp: false,
          onChange,
        }),
      );
      act(() => result.current[1](true));
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });

  describe("제어 모드", () => {
    it("prop이 정의되어 있으면 항상 prop 값을 반환한다", () => {
      const { result } = renderHook(() =>
        useControllableState<boolean>({
          prop: true,
          defaultProp: false,
        }),
      );
      expect(result.current[0]).toBe(true);
    });

    it("prop이 변경되면 값도 변경된다", () => {
      const { result, rerender } = renderHook(
        ({ prop }: { prop: boolean }) =>
          useControllableState<boolean>({
            prop,
            defaultProp: false,
          }),
        { initialProps: { prop: false } },
      );
      expect(result.current[0]).toBe(false);
      rerender({ prop: true });
      expect(result.current[0]).toBe(true);
    });

    it("setter 호출 시 onChange만 호출되고 내부 값은 변하지 않는다", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useControllableState<boolean>({
          prop: false,
          defaultProp: false,
          onChange,
        }),
      );
      act(() => result.current[1](true));
      expect(onChange).toHaveBeenCalledWith(true);
      expect(result.current[0]).toBe(false);
    });

    it("같은 값으로 setter를 호출하면 onChange가 호출되지 않는다", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useControllableState<boolean>({
          prop: true,
          onChange,
        }),
      );
      act(() => result.current[1](true));
      expect(onChange).not.toHaveBeenCalled();
    });

    it("함수형 setter는 현재 prop을 받는다", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useControllableState<number>({
          prop: 5,
          onChange,
        }),
      );
      act(() => result.current[1]((prev) => (prev ?? 0) + 1));
      expect(onChange).toHaveBeenCalledWith(6);
    });
  });
});
