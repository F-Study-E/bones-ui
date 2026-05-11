import * as React from "react";

type BubbleInputProps = Omit<React.ComponentPropsWithoutRef<"input">, "checked"> & {
  checked: boolean;
  control: React.RefObject<HTMLElement | null>;
};

export function BubbleInput(props: BubbleInputProps) {
  const { control, checked, ...rest } = props;
  const ref = React.useRef<HTMLInputElement>(null);
  const prevChecked = usePrevious(checked);
  const controlSize = useSize(control);

  React.useEffect(() => {
    const input = ref.current;
    if (!input) return;
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "checked",
    )?.set;
    if (prevChecked !== checked && setter) {
      const event = new Event("click", {
        bubbles: true,
      });
      setter.call(input, checked);
      input.dispatchEvent(event);
    }
  }, [prevChecked, checked]);

  return (
    <input
      type="checkbox"
      aria-hidden
      defaultChecked={checked}
      tabIndex={-1}
      ref={ref}
      {...rest}
      style={{
        ...rest.style,
        ...controlSize,
        position: "absolute",
        pointerEvents: "none",
        opacity: 0,
        margin: 0,
      }}
    />
  );
}

function usePrevious<T>(value: T): T {
  const ref = React.useRef<{
    value: T;
    previous: T;
  }>({
    value,
    previous: value,
  });
  return React.useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value;
      ref.current.value = value;
    }
    return ref.current.previous;
  }, [value]);
}

function useSize(elementRef: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = React.useState<{
    width: number;
    height: number;
  }>();

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      setSize(undefined);
      return;
    }
    setSize({
      width: element.offsetWidth,
      height: element.offsetHeight,
    });
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const borderBox = entry.borderBoxSize?.[0];
      const width = borderBox ? borderBox.inlineSize : (entry.target as HTMLElement).offsetWidth;
      const height = borderBox ? borderBox.blockSize : (entry.target as HTMLElement).offsetHeight;
      setSize({ width, height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef]);

  return size;
}
