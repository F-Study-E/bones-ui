import type * as React from "react";

export type SwitchProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  "value" | "defaultValue"
> & {
  asChild?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  required?: boolean;
  name?: string;
  value?: string;
  form?: string;
};

export type SwitchThumbProps = React.ComponentPropsWithoutRef<"span"> & {
  asChild?: boolean;
};
