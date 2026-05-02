import * as React from "react";
import { composeRefs, mergeProps } from "./slot.utils";

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
    ...mergeProps(slotProps as Record<string, unknown>, childProps),
    ref: forwardedRef ? composeRefs(forwardedRef, childRef) : childRef,
  } as Partial<typeof childProps>);
});

Slot.displayName = "Slot";
