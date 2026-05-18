import * as React from "react";
import type { Align, Side } from "./popover.types";

type UsePopoverPositionParams = {
  anchorRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  side: Side;
  sideOffset: number;
  align: Align;
  alignOffset: number;
  open: boolean;
};

export type PopoverPosition = { top: number; left: number } | null;

export function usePopoverPosition({
  anchorRef,
  contentRef,
  side,
  sideOffset,
  align,
  alignOffset,
  open,
}: UsePopoverPositionParams): PopoverPosition {
  const [position, setPosition] = React.useState<PopoverPosition>(null);

  React.useEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }

    function compute() {
      const anchor = anchorRef.current?.getBoundingClientRect();
      const content = contentRef.current?.getBoundingClientRect();
      if (!anchor || !content) return;

      let top = 0;
      let left = 0;

      switch (side) {
        case "top":
          top = anchor.top - content.height - sideOffset;
          break;
        case "bottom":
          top = anchor.bottom + sideOffset;
          break;
        case "right":
          left = anchor.right + sideOffset;
          top = anchor.top;
          break;
        case "left":
          left = anchor.left - content.width - sideOffset;
          top = anchor.top;
          break;
      }

      if (side === "top" || side === "bottom") {
        switch (align) {
          case "start":
            left = anchor.left + alignOffset;
            break;
          case "center":
            left = anchor.left + anchor.width / 2 - content.width / 2 + alignOffset;
            break;
          case "end":
            left = anchor.right - content.width + alignOffset;
            break;
        }
      } else {
        switch (align) {
          case "start":
            top = anchor.top + alignOffset;
            break;
          case "center":
            top = anchor.top + anchor.height / 2 - content.height / 2 + alignOffset;
            break;
          case "end":
            top = anchor.bottom - content.height + alignOffset;
            break;
        }
      }

      setPosition({ top, left });
    }

    compute();

    window.addEventListener("scroll", compute, { capture: true, passive: true });
    window.addEventListener("resize", compute);

    return () => {
      window.removeEventListener("scroll", compute, { capture: true });
      window.removeEventListener("resize", compute);
    };
  }, [open, anchorRef, contentRef, side, sideOffset, align, alignOffset]);

  return position;
}
