import * as React from "react";
import { composeRefs } from "./composeRefs";

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const Slot = React.forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;

  if (!React.isValidElement(children)) {
    return null;
  }

  const childRef = (children as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref;
  const childProps = children.props as Record<string, unknown>;

  return React.cloneElement(children, {
    ...mergeProps(slotProps, childProps),
    ref: forwardedRef ? composeRefs(forwardedRef, childRef) : childRef,
  } as Partial<typeof childProps>);
});

Slot.displayName = "Slot";

function mergeProps(slotProps: Record<string, unknown>, childProps: Record<string, unknown>): Record<string, unknown> {
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
