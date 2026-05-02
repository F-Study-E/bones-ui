import * as React from "react";

type PossibleRef<T> = React.Ref<T> | undefined;

function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

export function composeRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) setRef(ref, node);
  };
}

export function useComposeRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(composeRefs(...refs), refs);
}

export function mergeProps(
  slotProps: Record<string, unknown>,
  childProps: Record<string, unknown>,
): Record<string, unknown> {
  const overrideProps: Record<string, unknown> = { ...childProps };

  for (const key in slotProps) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];
    const isHandler = /^on[A-Z]/.test(key);

    if (isHandler) {
      if (typeof slotValue === "function" && typeof childValue === "function") {
        overrideProps[key] = (...args: unknown[]) => {
          (childValue as (...a: unknown[]) => unknown)(...args);
          (slotValue as (...a: unknown[]) => unknown)(...args);
        };
      } else if (typeof slotValue === "function") {
        overrideProps[key] = slotValue;
      }
    } else if (key === "style") {
      overrideProps[key] = {
        ...(slotValue as React.CSSProperties),
        ...(childValue as React.CSSProperties),
      };
    } else if (key === "className") {
      overrideProps[key] = [slotValue, childValue].filter(Boolean).join(" ");
    }
  }

  return { ...slotProps, ...overrideProps };
}
