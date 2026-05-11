import * as React from "react";
import { Primitive } from "../primitive/primitive";
import { useControllableState } from "./toggle-group.hook";
import type {
  ToggleGroupContextValue,
  ToggleGroupItemProps,
  ToggleGroupRootProps,
} from "./toggle-group.types";

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(null);

function useToggleGroupContext() {
  const ctx = React.useContext(ToggleGroupContext);
  if (!ctx) throw new Error("ToggleGroup.Item must be used within ToggleGroup.Root");
  return ctx;
}

// ---- internal single impl ----

type SingleImplProps = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  type: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  asChild?: boolean;
};

const ToggleGroupSingleImpl = React.forwardRef<HTMLDivElement, SingleImplProps>(
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
    const [selected, setSelected] = useControllableState({
      ...(value !== undefined ? { prop: value } : {}),
      defaultProp: defaultValue ?? "",
      ...(onValueChange !== undefined ? { onChange: onValueChange } : {}),
    });

    const onItemToggle = React.useCallback(
      (itemValue: string) => setSelected(selected === itemValue ? "" : itemValue),
      [selected, setSelected],
    );

    return (
      <ToggleGroupContext.Provider
        value={{ value: selected ? [selected] : [], onItemToggle, disabled }}
      >
        {/* biome-ignore lint/a11y/useSemanticElements: toggle group은 fieldset 없이 div+role="group"이 올바른 WAI-ARIA 패턴 */}
        <Primitive.div
          role="group"
          {...htmlProps}
          {...(asChild !== undefined && { asChild })}
          ref={ref}
        >
          {children}
        </Primitive.div>
      </ToggleGroupContext.Provider>
    );
  },
);

// ---- internal multiple impl ----

type MultipleImplProps = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
  asChild?: boolean;
};

const ToggleGroupMultipleImpl = React.forwardRef<HTMLDivElement, MultipleImplProps>(
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
    const [selected, setSelected] = useControllableState({
      ...(value !== undefined ? { prop: value } : {}),
      defaultProp: defaultValue ?? [],
      ...(onValueChange !== undefined ? { onChange: onValueChange } : {}),
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

    return (
      <ToggleGroupContext.Provider value={{ value: selected, onItemToggle, disabled }}>
        {/* biome-ignore lint/a11y/useSemanticElements: toggle group은 fieldset 없이 div+role="group"이 올바른 WAI-ARIA 패턴 */}
        <Primitive.div
          role="group"
          {...htmlProps}
          {...(asChild !== undefined && { asChild })}
          ref={ref}
        >
          {children}
        </Primitive.div>
      </ToggleGroupContext.Provider>
    );
  },
);

// ---- public API ----

export const Root = React.forwardRef<HTMLDivElement, ToggleGroupRootProps>((props, ref) => {
  if (props.type === "single") {
    return <ToggleGroupSingleImpl {...props} ref={ref} />;
  }
  return <ToggleGroupMultipleImpl {...props} ref={ref} />;
});
Root.displayName = "ToggleGroup.Root";

export const Item = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ value, disabled, asChild, onClick, ...props }, ref) => {
    const ctx = useToggleGroupContext();
    const isSelected = ctx.value.includes(value);
    const isDisabled = disabled ?? ctx.disabled;

    return (
      <Primitive.button
        {...props}
        ref={ref}
        type="button"
        {...(asChild !== undefined && { asChild })}
        aria-pressed={isSelected}
        data-state={isSelected ? "on" : "off"}
        data-disabled={isDisabled ? "" : undefined}
        disabled={isDisabled}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) ctx.onItemToggle(value);
        }}
      />
    );
  },
);
Item.displayName = "ToggleGroup.Item";
