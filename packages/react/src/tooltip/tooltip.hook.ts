import * as React from "react";
import { useControllableState } from "../hooks";

const DEFAULT_DELAY_DURATION = 700;
const CLOSE_GRACE_PERIOD = 300;

type UseTooltipParams = {
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  delayDuration?: number | undefined;
};

export function useTooltip({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  delayDuration = DEFAULT_DELAY_DURATION,
}: UseTooltipParams) {
  const [open = false, setOpen] = useControllableState<boolean>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const openTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearOpenTimer = React.useCallback(() => {
    if (openTimerRef.current !== null) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  }, []);

  const clearCloseTimer = React.useCallback(() => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openWithDelay = React.useCallback(() => {
    clearCloseTimer();
    clearOpenTimer();
    if (delayDuration === 0) {
      setOpen(true);
    } else {
      openTimerRef.current = setTimeout(() => setOpen(true), delayDuration);
    }
  }, [delayDuration, setOpen, clearOpenTimer, clearCloseTimer]);

  const openImmediate = React.useCallback(() => {
    clearCloseTimer();
    clearOpenTimer();
    setOpen(true);
  }, [setOpen, clearOpenTimer, clearCloseTimer]);

  // Trigger mouseleave 전용 — grace period 안에 Content로 진입하면 취소됨
  const closeWithDelay = React.useCallback(() => {
    clearOpenTimer();
    closeTimerRef.current = setTimeout(() => setOpen(false), CLOSE_GRACE_PERIOD);
  }, [setOpen, clearOpenTimer]);

  // Escape/blur 전용 — 즉시 닫힘
  const close = React.useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    setOpen(false);
  }, [setOpen, clearOpenTimer, clearCloseTimer]);

  React.useEffect(() => {
    return () => {
      clearOpenTimer();
      clearCloseTimer();
    };
  }, [clearOpenTimer, clearCloseTimer]);

  return { open, openWithDelay, openImmediate, closeWithDelay, close };
}
