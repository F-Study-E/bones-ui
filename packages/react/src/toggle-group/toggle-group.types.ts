import type * as React from "react";

type ToggleGroupCommonProps = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  disabled?: boolean;
  asChild?: boolean;
};

type ToggleGroupSingleProps = ToggleGroupCommonProps & {
  type: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

type ToggleGroupMultipleProps = ToggleGroupCommonProps & {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type ToggleGroupRootProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

export type ToggleGroupItemProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> & {
  value: string;
  disabled?: boolean;
  asChild?: boolean;
};

export type ToggleGroupContextValue = {
  value: string[];
  onItemToggle: (itemValue: string) => void;
  disabled: boolean;
};
