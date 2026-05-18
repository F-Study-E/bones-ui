import { Popover } from "@bones-ui/react";
import * as React from "react";

export default {
  title: "Popover",
};

const styles = `
.demo-trigger {
  all: unset;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  background: #fff;
  border: 1px solid #d1d5db;
  cursor: pointer;
  color: #111;
  transition: background 120ms;
}
.demo-trigger:hover { background: #f3f4f6; }
.demo-trigger:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }
.demo-trigger[data-state="open"] { background: #eff6ff; border-color: #93c5fd; }

.demo-content {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  min-width: 220px;
  font-size: 14px;
  color: #111;
}
.demo-content:focus { outline: none; }

.demo-content-title {
  font-weight: 600;
  margin: 0 0 8px;
  font-size: 15px;
}
.demo-content-body {
  margin: 0 0 12px;
  color: #6b7280;
  line-height: 1.5;
}

.demo-close {
  all: unset;
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  background: #f3f4f6;
  cursor: pointer;
  color: #374151;
  transition: background 120ms;
}
.demo-close:hover { background: #e5e7eb; }
.demo-close:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }

.demo-scene {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  gap: 16px;
}

.demo-anchor-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border: 2px dashed #93c5fd;
  border-radius: 8px;
  font-size: 12px;
  color: #6b7280;
}

.demo-placement-grid {
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 120px 40px;
}
.demo-placement-grid .spacer { width: 120px; height: 40px; }
`;

function StyleBlock() {
  return <style>{styles}</style>;
}

// ---- Default ----

export const Default = () => (
  <>
    <StyleBlock />
    <div className="demo-scene">
      <Popover.Root>
        <Popover.Trigger className="demo-trigger">팝오버 열기</Popover.Trigger>
        <Popover.Content className="demo-content">
          <p className="demo-content-title">팝오버 제목</p>
          <p className="demo-content-body">
            트리거 아래에 떠오르는 패널입니다. Escape 키나 외부 클릭으로 닫힙니다.
          </p>
          <Popover.Close className="demo-close">닫기</Popover.Close>
        </Popover.Content>
      </Popover.Root>
    </div>
  </>
);

// ---- Controlled ----

export const Controlled = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <StyleBlock />
      <div className="demo-scene" style={{ flexDirection: "column", gap: 24 }}>
        <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>
          현재 상태: <strong>{open ? "열림" : "닫힘"}</strong>
        </p>
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger className="demo-trigger">{open ? "닫기" : "열기"}</Popover.Trigger>
          <Popover.Content className="demo-content">
            <p className="demo-content-title">제어 모드</p>
            <p className="demo-content-body">
              부모가 <code>open</code> 상태를 직접 관리합니다.
            </p>
            <Popover.Close className="demo-close">닫기</Popover.Close>
          </Popover.Content>
        </Popover.Root>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={{ fontSize: 13, padding: "4px 12px", cursor: "pointer" }}
        >
          외부 버튼으로 토글
        </button>
      </div>
    </>
  );
};

// ---- Placements ----

export const Placements = () => (
  <>
    <StyleBlock />
    <div className="demo-placement-grid">
      {/* top row */}
      <div className="spacer" />
      <Popover.Root>
        <Popover.Trigger className="demo-trigger">Top</Popover.Trigger>
        <Popover.Content className="demo-content" side="top">
          <p style={{ margin: 0 }}>side=top</p>
        </Popover.Content>
      </Popover.Root>
      <div className="spacer" />

      {/* middle row */}
      <Popover.Root>
        <Popover.Trigger className="demo-trigger">Left</Popover.Trigger>
        <Popover.Content className="demo-content" side="left">
          <p style={{ margin: 0 }}>side=left</p>
        </Popover.Content>
      </Popover.Root>
      <div className="spacer" />
      <Popover.Root>
        <Popover.Trigger className="demo-trigger">Right</Popover.Trigger>
        <Popover.Content className="demo-content" side="right">
          <p style={{ margin: 0 }}>side=right</p>
        </Popover.Content>
      </Popover.Root>

      {/* bottom row */}
      <div className="spacer" />
      <Popover.Root>
        <Popover.Trigger className="demo-trigger">Bottom</Popover.Trigger>
        <Popover.Content className="demo-content" side="bottom">
          <p style={{ margin: 0 }}>side=bottom</p>
        </Popover.Content>
      </Popover.Root>
      <div className="spacer" />
    </div>
  </>
);

// ---- Align ----

export const Align = () => (
  <>
    <StyleBlock />
    <div className="demo-scene" style={{ flexDirection: "column", gap: 12 }}>
      {(["start", "center", "end"] as const).map((align) => (
        <Popover.Root key={align}>
          <Popover.Trigger
            className="demo-trigger"
            style={{ width: 160, justifyContent: "center" }}
          >
            align={align}
          </Popover.Trigger>
          <Popover.Content className="demo-content" align={align}>
            <p style={{ margin: 0 }}>align={align}</p>
          </Popover.Content>
        </Popover.Root>
      ))}
    </div>
  </>
);

// ---- WithAnchor ----

export const WithAnchor = () => (
  <>
    <StyleBlock />
    <div className="demo-scene" style={{ flexDirection: "column", gap: 20 }}>
      <Popover.Root>
        <Popover.Anchor className="demo-anchor-box">앵커</Popover.Anchor>
        <Popover.Trigger className="demo-trigger">트리거 (위치는 앵커 기준)</Popover.Trigger>
        <Popover.Content className="demo-content" side="right">
          <p className="demo-content-title">커스텀 앵커</p>
          <p className="demo-content-body">Trigger가 아닌 Anchor 기준으로 위치가 계산됩니다.</p>
          <Popover.Close className="demo-close">닫기</Popover.Close>
        </Popover.Content>
      </Popover.Root>
    </div>
  </>
);

// ---- AsChild ----

export const AsChild = () => (
  <>
    <StyleBlock />
    <div className="demo-scene">
      <Popover.Root>
        <Popover.Trigger asChild>
          {/* biome-ignore lint/a11y/useValidAnchor: asChild 데모용 — 런타임에 Trigger가 role/aria 속성을 주입하므로 대화형 요소가 됨 */}
          <a href="#" style={{ fontSize: 14, color: "#2563eb", cursor: "pointer" }}>
            링크처럼 보이는 트리거 (asChild)
          </a>
        </Popover.Trigger>
        <Popover.Content className="demo-content">
          <p className="demo-content-title">asChild 트리거</p>
          <p className="demo-content-body">
            Trigger가 <code>a</code> 태그로 렌더됩니다. ARIA 속성은 그대로 주입됩니다.
          </p>
          <Popover.Close className="demo-close">닫기</Popover.Close>
        </Popover.Content>
      </Popover.Root>
    </div>
  </>
);
