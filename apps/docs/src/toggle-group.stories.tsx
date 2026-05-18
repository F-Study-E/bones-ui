import { ToggleGroup } from "@bones-ui/react";
import type { Story } from "@ladle/react";
import { useState } from "react";

export default {
  title: "ToggleGroup",
};

export const Single: Story = () => {
  const [value, setValue] = useState("");
  return (
    <div>
      <p>선택: {value || "없음"}</p>
      <ToggleGroup.Root type="single" value={value} onValueChange={setValue}>
        <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
        <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
        <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
      </ToggleGroup.Root>
    </div>
  );
};

export const SingleUncontrolled: Story = () => (
  <ToggleGroup.Root type="single" defaultValue="center">
    <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
    <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
    <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
  </ToggleGroup.Root>
);
SingleUncontrolled.storyName = "Single (비제어)";

export const Multiple: Story = () => {
  const [value, setValue] = useState<string[]>([]);
  return (
    <div>
      <p>선택: {value.join(", ") || "없음"}</p>
      <ToggleGroup.Root type="multiple" value={value} onValueChange={setValue}>
        <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
        <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
      </ToggleGroup.Root>
    </div>
  );
};

export const Disabled: Story = () => (
  <ToggleGroup.Root type="single" defaultValue="a" disabled>
    <ToggleGroup.Item value="a">A</ToggleGroup.Item>
    <ToggleGroup.Item value="b">B</ToggleGroup.Item>
    <ToggleGroup.Item value="c">C</ToggleGroup.Item>
  </ToggleGroup.Root>
);

export const ItemDisabled: Story = () => (
  <ToggleGroup.Root type="single">
    <ToggleGroup.Item value="a">A</ToggleGroup.Item>
    <ToggleGroup.Item value="b" disabled>
      B (disabled)
    </ToggleGroup.Item>
    <ToggleGroup.Item value="c">C</ToggleGroup.Item>
  </ToggleGroup.Root>
);
ItemDisabled.storyName = "Item Disabled";
