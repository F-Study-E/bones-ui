import { useControllableState } from "@bones/hooks";
import * as React from "react";
import { Primitive } from "../primitive/primitive";
import { useComposeRefs } from "../slot/slot.utils";
import { BubbleInput } from "./bubble-input";
import type { SwitchProps, SwitchThumbProps } from "./switch.types";
import { composeEventHandlers } from "./switch.utils";

type SwitchContextValue = {
  checked: boolean;
  disabled: boolean | undefined;
};

const SwitchContext = React.createContext<SwitchContextValue | null>(null);

function useSwitchContext(consumer: string): SwitchContextValue {
  const ctx = React.useContext(SwitchContext);
  if (!ctx) {
    throw new Error(`\`${consumer}\` must be used within \`Switch.Root\``);
  }
  return ctx;
}

export const Root = React.forwardRef<HTMLButtonElement, SwitchProps>(
  function SwitchRoot(props, forwardedRef) {
    const {
      checked: checkedProp,
      defaultChecked = false,
      onCheckedChange,
      disabled,
      required,
      name,
      value = "on",
      form,
      onClick,
      children,
      ...rest
    } = props;

    const [checked = false, setChecked] = useControllableState<boolean>({
      prop: checkedProp,
      defaultProp: defaultChecked,
      onChange: onCheckedChange,
    });

    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const composedRef = useComposeRefs(forwardedRef, buttonRef);
    const isFormControl = useIsFormControl(buttonRef);

    const dataState = checked ? "checked" : "unchecked";
    const ctx = React.useMemo<SwitchContextValue>(
      () => ({ checked, disabled }),
      [checked, disabled],
    );

    return (
      <SwitchContext.Provider value={ctx}>
        <Primitive.button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-required={required}
          data-state={dataState}
          data-checked={checked ? "" : undefined}
          data-disabled={disabled ? "" : undefined}
          disabled={disabled}
          ref={composedRef}
          onClick={composeEventHandlers(onClick, (event) => {
            setChecked((prev) => !prev);
            if (isFormControl && !event.isPropagationStopped()) {
              event.stopPropagation();
            }
          })}
          {...rest}
        >
          {children}
        </Primitive.button>
        {isFormControl && name !== undefined ? (
          <BubbleInput
            control={buttonRef}
            checked={checked}
            name={name}
            value={value}
            required={required}
            disabled={disabled}
            form={form}
          />
        ) : null}
      </SwitchContext.Provider>
    );
  },
);
Root.displayName = "Switch.Root";

export const Thumb = React.forwardRef<HTMLSpanElement, SwitchThumbProps>(
  function SwitchThumb(props, forwardedRef) {
    const ctx = useSwitchContext("Switch.Thumb");
    const dataState = ctx.checked ? "checked" : "unchecked";
    return (
      <Primitive.span
        data-state={dataState}
        data-checked={ctx.checked ? "" : undefined}
        data-disabled={ctx.disabled ? "" : undefined}
        ref={forwardedRef}
        {...props}
      />
    );
  },
);
Thumb.displayName = "Switch.Thumb";

function useIsFormControl(elementRef: React.RefObject<HTMLElement | null>) {
  const [isFormControl, setIsFormControl] = React.useState(false);
  React.useEffect(() => {
    setIsFormControl(Boolean(elementRef.current?.closest("form")));
  });
  return isFormControl;
}
