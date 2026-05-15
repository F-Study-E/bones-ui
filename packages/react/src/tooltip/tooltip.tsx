import * as React from "react";
import { Primitive } from "../primitive/primitive";
import { useTooltip } from "./tooltip.hook";
import type {
  TooltipContentProps,
  TooltipContextValue,
  TooltipRootProps,
  TooltipTriggerProps,
} from "./tooltip.types";
import { composeEventHandlers } from "./tooltip.utils";

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

function useTooltipContext(consumer: string): TooltipContextValue {
  const ctx = React.useContext(TooltipContext);
  if (!ctx) {
    throw new Error(`\`${consumer}\` must be used within \`Tooltip.Root\``);
  }
  return ctx;
}

export function Root({
  open: openProp,
  defaultOpen,
  onOpenChange,
  delayDuration,
  children,
}: TooltipRootProps) {
  const { open, openWithDelay, openImmediate, closeWithDelay, close } = useTooltip({
    open: openProp,
    defaultOpen,
    onOpenChange,
    delayDuration,
  });

  const contentId = React.useId();

  const ctx = React.useMemo<TooltipContextValue>(
    () => ({ open, openWithDelay, openImmediate, closeWithDelay, close, contentId }),
    [open, openWithDelay, openImmediate, closeWithDelay, close, contentId],
  );

  return <TooltipContext.Provider value={ctx}>{children}</TooltipContext.Provider>;
}
Root.displayName = "Tooltip.Root";

export const Trigger = React.forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  function TooltipTrigger(
    { onMouseEnter, onMouseLeave, onFocus, onBlur, onKeyDown, ...props },
    forwardedRef,
  ) {
    const { open, openWithDelay, openImmediate, closeWithDelay, close, contentId } =
      useTooltipContext("Tooltip.Trigger");

    return (
      <Primitive.button
        type="button"
        aria-describedby={open ? contentId : undefined}
        data-state={open ? "open" : "closed"}
        onMouseEnter={composeEventHandlers(onMouseEnter, openWithDelay)}
        onMouseLeave={composeEventHandlers(onMouseLeave, closeWithDelay)}
        onFocus={composeEventHandlers(onFocus, openImmediate)}
        onBlur={composeEventHandlers(onBlur, close)}
        onKeyDown={composeEventHandlers(onKeyDown, (event) => {
          if (event.key === "Escape") close();
        })}
        ref={forwardedRef}
        {...props}
      />
    );
  },
);
Trigger.displayName = "Tooltip.Trigger";

export const Content = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  function TooltipContent({ onMouseEnter, onMouseLeave, ...props }, forwardedRef) {
    const { open, openImmediate, close, contentId } = useTooltipContext("Tooltip.Content");

    return (
      <Primitive.div
        id={contentId}
        role="tooltip"
        data-state={open ? "open" : "closed"}
        aria-hidden={open ? undefined : true}
        onMouseEnter={composeEventHandlers(onMouseEnter, openImmediate)}
        onMouseLeave={composeEventHandlers(onMouseLeave, close)}
        ref={forwardedRef}
        {...props}
      />
    );
  },
);
Content.displayName = "Tooltip.Content";
