import { renderHook } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { composeRefs, useComposeRefs } from "./composeRefs";

describe("composeRefs", () => {
  it("callback ref와 object ref 모두에 노드를 전달한다", () => {
    const cb = vi.fn();
    const obj = React.createRef<HTMLDivElement>();
    const node = document.createElement("div");

    composeRefs<HTMLDivElement>(cb, obj)(node);

    expect(cb).toHaveBeenCalledWith(node);
    expect(obj.current).toBe(node);
  });

  it("null/undefined ref는 안전하게 무시한다", () => {
    const cb = vi.fn();
    const node = document.createElement("div");

    expect(() => {
      composeRefs<HTMLDivElement>(cb, null, undefined)(node);
    }).not.toThrow();
    expect(cb).toHaveBeenCalledWith(node);
  });
});

describe("useComposeRefs", () => {
  it("동일한 ref 인자에 대해 안정적인 함수를 반환한다", () => {
    const cb = vi.fn();
    const obj = React.createRef<HTMLDivElement>();

    const { result, rerender } = renderHook(() => useComposeRefs<HTMLDivElement>(cb, obj));
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it("ref가 바뀌면 새로운 합성 함수를 반환한다", () => {
    const obj = React.createRef<HTMLDivElement>();
    const { result, rerender } = renderHook(
      ({ cb }: { cb: React.RefCallback<HTMLDivElement> }) =>
        useComposeRefs<HTMLDivElement>(cb, obj),
      { initialProps: { cb: vi.fn() } },
    );
    const first = result.current;
    rerender({ cb: vi.fn() });
    expect(result.current).not.toBe(first);
  });
});
