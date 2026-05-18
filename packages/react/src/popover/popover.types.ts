import type * as React from "react";

export type Side = "top" | "right" | "bottom" | "left";
export type Align = "start" | "center" | "end";

export type PopoverRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
};

export type PopoverTriggerProps = React.ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean;
};

export type PopoverAnchorProps = React.ComponentPropsWithoutRef<"div"> & {
  asChild?: boolean;
};

export type PopoverContentProps = React.ComponentPropsWithoutRef<"div"> & {
  asChild?: boolean;
  side?: Side;
  sideOffset?: number;
  align?: Align;
  alignOffset?: number;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
};

export type PopoverCloseProps = React.ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean;
};
