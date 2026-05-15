import { Tooltip } from "@bones/react";
import * as React from "react";

export default {
  title: "Tooltip",
};

const styles = `
.demo-tooltip-wrapper {
  display: inline-block;
  position: relative;
}

.demo-trigger {
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e5e7eb;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  color: #374151;
}
.demo-trigger:hover { background: #d1d5db; }
.demo-trigger:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }

.demo-content {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  color: #fff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
}
.demo-content[data-state="closed"] { display: none; }

.demo-label-trigger {
  all: unset;
  padding: 6px 12px;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  font-size: 14px;
  cursor: pointer;
}
.demo-label-trigger:focus-visible { outline: 2px solid #1d4ed8; outline-offset: 2px; }

.demo-row { display: flex; align-items: center; gap: 16px; padding: 40px 16px 16px; }
`;

function StyleBlock() {
  return <style>{styles}</style>;
}

export const Default = () => (
  <>
    <StyleBlock />
    <div className="demo-row">
      <div className="demo-tooltip-wrapper">
        <Tooltip.Root delayDuration={500}>
          <Tooltip.Trigger className="demo-trigger">?</Tooltip.Trigger>
          <Tooltip.Content className="demo-content">도움말 내용입니다</Tooltip.Content>
        </Tooltip.Root>
      </div>
    </div>
  </>
);

export const NoDelay = () => (
  <>
    <StyleBlock />
    <div className="demo-row">
      <div className="demo-tooltip-wrapper">
        <Tooltip.Root delayDuration={0}>
          <Tooltip.Trigger className="demo-trigger">!</Tooltip.Trigger>
          <Tooltip.Content className="demo-content">지연 없이 바로 열림</Tooltip.Content>
        </Tooltip.Root>
      </div>
    </div>
  </>
);

export const DefaultOpen = () => (
  <>
    <StyleBlock />
    <div className="demo-row">
      <div className="demo-tooltip-wrapper">
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger className="demo-trigger">★</Tooltip.Trigger>
          <Tooltip.Content className="demo-content">처음부터 열린 상태</Tooltip.Content>
        </Tooltip.Root>
      </div>
    </div>
  </>
);

export const Controlled = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <StyleBlock />
      <div className="demo-row">
        <div className="demo-tooltip-wrapper">
          <Tooltip.Root open={open} onOpenChange={setOpen}>
            <Tooltip.Trigger className="demo-label-trigger">제어 모드 버튼</Tooltip.Trigger>
            <Tooltip.Content className="demo-content">제어 모드 툴팁</Tooltip.Content>
          </Tooltip.Root>
        </div>
        <span style={{ fontSize: 13, color: "#6b7280" }}>상태: {open ? "열림" : "닫힘"}</span>
      </div>
    </>
  );
};

export const AsChild = () => (
  <>
    <StyleBlock />
    <div className="demo-row">
      <div className="demo-tooltip-wrapper">
        <Tooltip.Root delayDuration={300}>
          <Tooltip.Trigger asChild>
            <a href="/help" style={{ fontSize: 14, color: "#2563eb" }}>
              링크에 툴팁
            </a>
          </Tooltip.Trigger>
          <Tooltip.Content className="demo-content">asChild로 a 태그에 적용</Tooltip.Content>
        </Tooltip.Root>
      </div>
    </div>
  </>
);
