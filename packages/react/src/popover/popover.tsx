import * as React from "react";
import * as ReactDOM from "react-dom";
import { useControllableState } from "../hooks";
import { Primitive } from "../primitive/primitive";
import { useComposeRefs } from "../slot/slot.utils";
import { usePopoverPosition } from "./popover.hook";
import type {
  PopoverAnchorProps,
  PopoverCloseProps,
  PopoverContentProps,
  PopoverRootProps,
  PopoverTriggerProps,
} from "./popover.types";

// ---- Context ----

type PopoverContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  customAnchorRef: React.RefObject<HTMLElement | null>;
  hasCustomAnchor: boolean;
  onHasCustomAnchorChange: (has: boolean) => void;
};

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

function usePopoverContext(consumer: string): PopoverContextValue {
  const ctx = React.useContext(PopoverContext);
  if (!ctx) throw new Error(`\`${consumer}\` must be used within \`Popover.Root\``);
  return ctx;
}

// ---- Root ----

export const Root = function PopoverRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: PopoverRootProps) {
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const contentId = React.useId();
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const customAnchorRef = React.useRef<HTMLElement>(null);
  const [hasCustomAnchor, setHasCustomAnchor] = React.useState(false);

  const ctx = React.useMemo<PopoverContextValue>(
    () => ({
      open,
      onOpenChange: setOpen,
      contentId,
      triggerRef,
      customAnchorRef,
      hasCustomAnchor,
      onHasCustomAnchorChange: setHasCustomAnchor,
    }),
    [open, setOpen, contentId, hasCustomAnchor],
  );

  return <PopoverContext.Provider value={ctx}>{children}</PopoverContext.Provider>;
};
Root.displayName = "Popover.Root";

// ---- Anchor ----

export const Anchor = React.forwardRef<HTMLDivElement, PopoverAnchorProps>(
  function PopoverAnchor({ asChild, ...props }, forwardedRef) {
    const ctx = usePopoverContext("Popover.Anchor");
    const composedRef = useComposeRefs(
      forwardedRef,
      ctx.customAnchorRef as React.RefObject<HTMLDivElement>,
    );

    React.useEffect(() => {
      ctx.onHasCustomAnchorChange(true);
      return () => ctx.onHasCustomAnchorChange(false);
    }, [ctx.onHasCustomAnchorChange]);

    return <Primitive.div {...(asChild !== undefined && { asChild })} {...props} ref={composedRef} />;
  },
);
Anchor.displayName = "Popover.Anchor";

// ---- Trigger ----

export const Trigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  function PopoverTrigger({ asChild, onClick, ...props }, forwardedRef) {
    const ctx = usePopoverContext("Popover.Trigger");
    const composedRef = useComposeRefs(forwardedRef, ctx.triggerRef);

    return (
      <Primitive.button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={ctx.open}
        aria-controls={ctx.open ? ctx.contentId : undefined}
        data-state={ctx.open ? "open" : "closed"}
        data-open={ctx.open ? "" : undefined}
        {...(asChild !== undefined && { asChild })}
        {...props}
        ref={composedRef}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) ctx.onOpenChange(!ctx.open);
        }}
      />
    );
  },
);
Trigger.displayName = "Popover.Trigger";

// ---- Content ----

export const Content = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent(
    {
      asChild,
      side = "bottom",
      sideOffset = 4,
      align = "center",
      alignOffset = 0,
      onEscapeKeyDown,
      onPointerDownOutside,
      style,
      ...props
    },
    forwardedRef,
  ) {
    const ctx = usePopoverContext("Popover.Content");
    const contentRef = React.useRef<HTMLDivElement>(null);
    const composedRef = useComposeRefs(forwardedRef, contentRef);

    const anchorRef = (
      ctx.hasCustomAnchor ? ctx.customAnchorRef : ctx.triggerRef
    ) as React.RefObject<HTMLElement | null>;

    const position = usePopoverPosition({
      anchorRef,
      contentRef,
      side,
      sideOffset,
      align,
      alignOffset,
      open: ctx.open,
    });

    // 열릴 때 콘텐츠로 포커스 이동
    React.useEffect(() => {
      if (ctx.open) contentRef.current?.focus();
    }, [ctx.open]);

    // 닫힐 때 트리거로 포커스 복귀
    const prevOpenRef = React.useRef(ctx.open);
    React.useEffect(() => {
      if (prevOpenRef.current && !ctx.open) ctx.triggerRef.current?.focus();
      prevOpenRef.current = ctx.open;
    }, [ctx.open, ctx.triggerRef]);

    // Escape 키로 닫기
    React.useEffect(() => {
      if (!ctx.open) return;
      function handleKeyDown(e: KeyboardEvent) {
        if (e.key !== "Escape") return;
        onEscapeKeyDown?.(e);
        if (!e.defaultPrevented) ctx.onOpenChange(false);
      }
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [ctx.open, ctx.onOpenChange, onEscapeKeyDown]);

    // 외부 클릭으로 닫기
    React.useEffect(() => {
      if (!ctx.open) return;
      function handlePointerDown(e: PointerEvent) {
        const target = e.target as Node;
        if (contentRef.current?.contains(target)) return;
        if (ctx.triggerRef.current?.contains(target)) return;
        onPointerDownOutside?.(e);
        if (!e.defaultPrevented) ctx.onOpenChange(false);
      }
      document.addEventListener("pointerdown", handlePointerDown);
      return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, [ctx.open, ctx.onOpenChange, ctx.triggerRef, onPointerDownOutside]);

    if (!ctx.open) return null;

    return ReactDOM.createPortal(
      <Primitive.div
        role="dialog"
        id={ctx.contentId}
        tabIndex={-1}
        data-state="open"
        data-open=""
        data-side={side}
        data-align={align}
        {...(asChild !== undefined && { asChild })}
        {...props}
        ref={composedRef}
        style={{
          position: "fixed",
          top: position?.top ?? 0,
          left: position?.left ?? 0,
          // 포지션 계산 전 깜빡임 방지
          visibility: position === null ? "hidden" : undefined,
          ...style,
        }}
      />,
      document.body,
    );
  },
);
Content.displayName = "Popover.Content";

// ---- Close ----

export const Close = React.forwardRef<HTMLButtonElement, PopoverCloseProps>(
  function PopoverClose({ asChild, onClick, ...props }, forwardedRef) {
    const ctx = usePopoverContext("Popover.Close");
    return (
      <Primitive.button
        type="button"
        {...(asChild !== undefined && { asChild })}
        {...props}
        ref={forwardedRef}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) ctx.onOpenChange(false);
        }}
      />
    );
  },
);
Close.displayName = "Popover.Close";
