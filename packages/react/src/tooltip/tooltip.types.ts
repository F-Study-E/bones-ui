import type * as React from "react";

export type TooltipRootProps = {
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  /** 마우스 호버 후 열리기까지의 지연 시간 (ms). 기본값 700. */
  delayDuration?: number | undefined;
  children?: React.ReactNode;
};

export type TooltipTriggerProps = React.ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean;
};

export type TooltipContentProps = React.ComponentPropsWithoutRef<"div"> & {
  asChild?: boolean;
};

export type TooltipContextValue = {
  open: boolean;
  openWithDelay: () => void;
  openImmediate: () => void;
  closeWithDelay: () => void;
  close: () => void;
  contentId: string;
};
