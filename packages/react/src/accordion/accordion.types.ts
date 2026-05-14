import type * as React from "react";

type AccordionCommonProps = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  disabled?: boolean;
  asChild?: boolean;
};

type AccordionSingleProps = AccordionCommonProps & {
  type: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  collapsible?: boolean;
};

type AccordionMultipleProps = AccordionCommonProps & {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type AccordionRootProps = AccordionSingleProps | AccordionMultipleProps;

export type AccordionItemProps = Omit<React.HTMLAttributes<HTMLDivElement>, "value"> & {
  value: string;
  disabled?: boolean;
  asChild?: boolean;
};

export type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
};
