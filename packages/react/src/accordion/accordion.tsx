import * as React from "react";
import { useControllableState } from "../hooks";
import { Primitive } from "../primitive/primitive";
import type {
  AccordionContentProps,
  AccordionItemProps,
  AccordionRootProps,
  AccordionTriggerProps,
} from "./accordion.types";

// --- Root Context ---

type AccordionContextValue = {
  value: string[];
  onItemToggle: (itemValue: string) => void;
  disabled: boolean;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error("`Accordion` parts must be used within `Accordion.Root`");
  return ctx;
}

// --- Item Context ---

type AccordionItemContextValue = {
  value: string;
  isOpen: boolean;
  isDisabled: boolean;
  triggerId: string;
  contentId: string;
};

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext() {
  const ctx = React.useContext(AccordionItemContext);
  if (!ctx)
    throw new Error(
      "`Accordion.Trigger` and `Accordion.Content` must be used within `Accordion.Item`",
    );
  return ctx;
}

// --- Single Impl ---

type SingleImplProps = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  type: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  collapsible?: boolean;
  asChild?: boolean;
};

const AccordionSingleImpl = React.forwardRef<HTMLDivElement, SingleImplProps>(
  (
    {
      type: _,
      value,
      defaultValue,
      onValueChange,
      disabled = false,
      collapsible = false,
      asChild,
      children,
      ...htmlProps
    },
    ref,
  ) => {
    const [selected = "", setSelected] = useControllableState<string>({
      prop: value,
      defaultProp: defaultValue ?? "",
      onChange: onValueChange,
    });

    const onItemToggle = React.useCallback(
      (itemValue: string) => {
        if (selected === itemValue) {
          if (collapsible) setSelected("");
        } else {
          setSelected(itemValue);
        }
      },
      [selected, setSelected, collapsible],
    );

    const ctx = React.useMemo<AccordionContextValue>(
      () => ({ value: selected ? [selected] : [], onItemToggle, disabled }),
      [selected, onItemToggle, disabled],
    );

    return (
      <AccordionContext.Provider value={ctx}>
        <Primitive.div {...htmlProps} {...(asChild !== undefined && { asChild })} ref={ref}>
          {children}
        </Primitive.div>
      </AccordionContext.Provider>
    );
  },
);

// --- Multiple Impl ---

type MultipleImplProps = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
  asChild?: boolean;
};

const AccordionMultipleImpl = React.forwardRef<HTMLDivElement, MultipleImplProps>(
  (
    {
      type: _,
      value,
      defaultValue,
      onValueChange,
      disabled = false,
      asChild,
      children,
      ...htmlProps
    },
    ref,
  ) => {
    const [selected = [], setSelected] = useControllableState<string[]>({
      prop: value,
      defaultProp: defaultValue ?? [],
      onChange: onValueChange,
    });

    const onItemToggle = React.useCallback(
      (itemValue: string) =>
        setSelected(
          selected.includes(itemValue)
            ? selected.filter((v) => v !== itemValue)
            : [...selected, itemValue],
        ),
      [selected, setSelected],
    );

    const ctx = React.useMemo<AccordionContextValue>(
      () => ({ value: selected, onItemToggle, disabled }),
      [selected, onItemToggle, disabled],
    );

    return (
      <AccordionContext.Provider value={ctx}>
        <Primitive.div {...htmlProps} {...(asChild !== undefined && { asChild })} ref={ref}>
          {children}
        </Primitive.div>
      </AccordionContext.Provider>
    );
  },
);

// --- Root ---

export const Root = React.forwardRef<HTMLDivElement, AccordionRootProps>((props, ref) => {
  if (props.type === "single") {
    return <AccordionSingleImpl {...props} ref={ref} />;
  }
  return <AccordionMultipleImpl {...props} ref={ref} />;
});
Root.displayName = "Accordion.Root";

// --- Item ---

export const Item = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, disabled, asChild, children, ...props }, ref) => {
    const ctx = useAccordionContext();
    const isOpen = ctx.value.includes(value);
    const isDisabled = disabled ?? ctx.disabled;

    const triggerId = React.useId();
    const contentId = React.useId();

    const itemCtx = React.useMemo<AccordionItemContextValue>(
      () => ({ value, isOpen, isDisabled, triggerId, contentId }),
      [value, isOpen, isDisabled, triggerId, contentId],
    );

    return (
      <AccordionItemContext.Provider value={itemCtx}>
        <Primitive.div
          data-state={isOpen ? "open" : "closed"}
          data-open={isOpen ? "" : undefined}
          data-disabled={isDisabled ? "" : undefined}
          {...props}
          {...(asChild !== undefined && { asChild })}
          ref={ref}
        >
          {children}
        </Primitive.div>
      </AccordionItemContext.Provider>
    );
  },
);
Item.displayName = "Accordion.Item";

// --- Trigger ---

export const Trigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ asChild, onClick, children, ...props }, ref) => {
    const rootCtx = useAccordionContext();
    const itemCtx = useAccordionItemContext();

    return (
      <Primitive.button
        type="button"
        aria-expanded={itemCtx.isOpen}
        aria-controls={itemCtx.contentId}
        id={itemCtx.triggerId}
        data-state={itemCtx.isOpen ? "open" : "closed"}
        data-open={itemCtx.isOpen ? "" : undefined}
        data-disabled={itemCtx.isDisabled ? "" : undefined}
        disabled={itemCtx.isDisabled}
        {...props}
        {...(asChild !== undefined && { asChild })}
        ref={ref}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) rootCtx.onItemToggle(itemCtx.value);
        }}
      >
        {children}
      </Primitive.button>
    );
  },
);
Trigger.displayName = "Accordion.Trigger";

// --- Content ---

export const Content = React.forwardRef<HTMLElement, AccordionContentProps>(
  ({ asChild, children, ...props }, ref) => {
    const itemCtx = useAccordionItemContext();

    return (
      <Primitive.section
        aria-labelledby={itemCtx.triggerId}
        id={itemCtx.contentId}
        data-state={itemCtx.isOpen ? "open" : "closed"}
        data-open={itemCtx.isOpen ? "" : undefined}
        data-disabled={itemCtx.isDisabled ? "" : undefined}
        {...props}
        {...(asChild !== undefined && { asChild })}
        ref={ref}
      >
        {children}
      </Primitive.section>
    );
  },
);
Content.displayName = "Accordion.Content";
