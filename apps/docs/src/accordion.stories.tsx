import { Accordion } from "@bones-ui/react";
import type { Story } from "@ladle/react";
import * as React from "react";

export default {
  title: "Accordion",
};

const styles = `
.demo-accordion { width: 320px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
.demo-item { border-bottom: 1px solid #e5e7eb; }
.demo-item:last-child { border-bottom: none; }
.demo-trigger {
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background: white;
  transition: background 120ms;
}
.demo-trigger:hover { background: #f9fafb; }
.demo-trigger[data-disabled] { opacity: 0.5; cursor: not-allowed; }
.demo-trigger:focus-visible { outline: 2px solid #2563eb; outline-offset: -2px; }
.demo-chevron { font-size: 12px; transition: transform 180ms; flex-shrink: 0; }
.demo-trigger[data-state="open"] .demo-chevron { transform: rotate(180deg); }
.demo-content { padding: 0 16px 14px; font-size: 14px; color: #6b7280; line-height: 1.6; }
.demo-content[data-state="closed"] { display: none; }

/* 애니메이션 스타일 */
.demo-animated-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 250ms ease;
  overflow: hidden;
}
.demo-animated-content[data-state="open"] { grid-template-rows: 1fr; }
.demo-animated-inner { overflow: hidden; padding: 0 16px; }
.demo-animated-content[data-state="open"] .demo-animated-inner { padding-bottom: 14px; }
`;

function StyleBlock() {
  return <style>{styles}</style>;
}

const items = [
  {
    value: "q1",
    label: "아코디언이란 무엇인가요?",
    content: "아코디언은 접을 수 있는 섹션들로 구성된 UI 컴포넌트입니다.",
  },
  {
    value: "q2",
    label: "headless란 무엇인가요?",
    content: "headless는 로직만 제공하고 스타일은 사용자가 직접 정의하는 방식입니다.",
  },
  {
    value: "q3",
    label: "asChild prop은 무엇인가요?",
    content: "asChild는 내부 DOM 요소 대신 자식 컴포넌트를 렌더링하게 합니다.",
  },
];

export const Single: Story = () => (
  <>
    <StyleBlock />
    <Accordion.Root type="single" className="demo-accordion">
      {items.map((item) => (
        <Accordion.Item key={item.value} value={item.value} className="demo-item">
          <Accordion.Trigger className="demo-trigger">
            {item.label}
            <span className="demo-chevron" aria-hidden="true">
              ▼
            </span>
          </Accordion.Trigger>
          <Accordion.Content className="demo-content">{item.content}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  </>
);
Single.storyName = "Single (단일 — 다른 항목 클릭으로만 전환)";

export const SingleCollapsible: Story = () => (
  <>
    <StyleBlock />
    <Accordion.Root type="single" collapsible className="demo-accordion">
      {items.map((item) => (
        <Accordion.Item key={item.value} value={item.value} className="demo-item">
          <Accordion.Trigger className="demo-trigger">
            {item.label}
            <span className="demo-chevron" aria-hidden="true">
              ▼
            </span>
          </Accordion.Trigger>
          <Accordion.Content className="demo-content">{item.content}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  </>
);
SingleCollapsible.storyName = "SingleCollapsible (같은 항목 클릭으로 닫기 가능)";

export const Multiple: Story = () => (
  <>
    <StyleBlock />
    <Accordion.Root type="multiple" className="demo-accordion">
      {items.map((item) => (
        <Accordion.Item key={item.value} value={item.value} className="demo-item">
          <Accordion.Trigger className="demo-trigger">
            {item.label}
            <span className="demo-chevron" aria-hidden="true">
              ▼
            </span>
          </Accordion.Trigger>
          <Accordion.Content className="demo-content">{item.content}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  </>
);
Multiple.storyName = "Multiple (다중 열기)";

export const Controlled: Story = () => {
  const [value, setValue] = React.useState("q1");
  return (
    <>
      <StyleBlock />
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        열린 항목: {value || "없음"}
      </p>
      <Accordion.Root
        type="single"
        collapsible
        value={value}
        onValueChange={setValue}
        className="demo-accordion"
      >
        {items.map((item) => (
          <Accordion.Item key={item.value} value={item.value} className="demo-item">
            <Accordion.Trigger className="demo-trigger">
              {item.label}
              <span className="demo-chevron" aria-hidden="true">
                ▼
              </span>
            </Accordion.Trigger>
            <Accordion.Content className="demo-content">{item.content}</Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </>
  );
};
Controlled.storyName = "Controlled (제어 모드)";

export const DefaultOpen: Story = () => (
  <>
    <StyleBlock />
    <Accordion.Root type="single" defaultValue="q2" className="demo-accordion">
      {items.map((item) => (
        <Accordion.Item key={item.value} value={item.value} className="demo-item">
          <Accordion.Trigger className="demo-trigger">
            {item.label}
            <span className="demo-chevron" aria-hidden="true">
              ▼
            </span>
          </Accordion.Trigger>
          <Accordion.Content className="demo-content">{item.content}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  </>
);
DefaultOpen.storyName = "DefaultOpen (비제어 초기값)";

export const Disabled: Story = () => (
  <>
    <StyleBlock />
    <Accordion.Root type="single" className="demo-accordion">
      <Accordion.Item value="q1" className="demo-item">
        <Accordion.Trigger className="demo-trigger">
          정상 항목
          <span className="demo-chevron" aria-hidden="true">
            ▼
          </span>
        </Accordion.Trigger>
        <Accordion.Content className="demo-content">내용이 있습니다.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="q2" disabled className="demo-item">
        <Accordion.Trigger className="demo-trigger">
          비활성 항목 (Item disabled)
          <span className="demo-chevron" aria-hidden="true">
            ▼
          </span>
        </Accordion.Trigger>
        <Accordion.Content className="demo-content">
          이 내용은 접근할 수 없습니다.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </>
);
Disabled.storyName = "Disabled (비활성)";

export const Animated: Story = () => (
  <>
    <StyleBlock />
    <Accordion.Root type="single" collapsible className="demo-accordion">
      {items.map((item) => (
        <Accordion.Item key={item.value} value={item.value} className="demo-item">
          <Accordion.Trigger className="demo-trigger">
            {item.label}
            <span className="demo-chevron" aria-hidden="true">
              ▼
            </span>
          </Accordion.Trigger>
          <Accordion.Content className="demo-animated-content">
            <div
              className="demo-animated-inner"
              style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}
            >
              {item.content}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  </>
);
Animated.storyName = "Animated (CSS grid 트릭)";
