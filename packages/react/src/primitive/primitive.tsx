import * as React from "react";
import { Slot } from "../slot/slot";

const NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "span",
  "svg",
  "ul",
] as const;

type Node = (typeof NODES)[number];

type PrimitivePropsWithRef<E extends Node> = React.ComponentPropsWithRef<E> & {
  asChild?: boolean;
};

type PrimitiveForwardRefComponent<E extends Node> = React.ForwardRefExoticComponent<
  PrimitivePropsWithRef<E>
>;

type Primitives = {
  [E in Node]: PrimitiveForwardRefComponent<E>;
};

export const Primitive = Object.fromEntries(
  NODES.map((node) => {
    const Component = React.forwardRef<
      React.ElementRef<typeof node>,
      PrimitivePropsWithRef<typeof node>
    >(({ asChild, ...props }, ref) => {
      const Comp: React.ElementType = asChild ? Slot : node;
      return <Comp {...props} ref={ref} />;
    });
    Component.displayName = `Primitive.${node}`;
    return [node, Component];
  }),
) as Primitives;
