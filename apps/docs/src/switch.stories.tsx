import { Switch } from "@bones/react";
import * as React from "react";

export default {
  title: "Switch",
};

const styles = `
.demo-switch {
  all: unset;
  width: 42px;
  height: 25px;
  background: #999;
  border-radius: 9999px;
  position: relative;
  cursor: pointer;
  display: inline-block;
  transition: background 120ms;
  box-sizing: border-box;
}
.demo-switch[data-state="checked"] { background: #2563eb; }
.demo-switch[data-disabled] { opacity: 0.5; cursor: not-allowed; }
.demo-switch:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }

.demo-thumb {
  display: block;
  width: 21px;
  height: 21px;
  background: white;
  border-radius: 9999px;
  transform: translateX(2px);
  transition: transform 120ms;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
}
.demo-thumb[data-state="checked"] { transform: translateX(19px); }

.demo-row { display: flex; align-items: center; gap: 12px; padding: 8px; }
label { user-select: none; }
`;

function StyleBlock() {
  return <style>{styles}</style>;
}

export const Default = () => (
  <>
    <StyleBlock />
    <div className="demo-row">
      <Switch.Root className="demo-switch" id="default">
        <Switch.Thumb className="demo-thumb" />
      </Switch.Root>
      <label htmlFor="default">알림 받기</label>
    </div>
  </>
);

export const Controlled = () => {
  const [checked, setChecked] = React.useState(false);
  return (
    <>
      <StyleBlock />
      <div className="demo-row">
        <Switch.Root
          className="demo-switch"
          id="controlled"
          checked={checked}
          onCheckedChange={setChecked}
        >
          <Switch.Thumb className="demo-thumb" />
        </Switch.Root>
        <label htmlFor="controlled">제어 모드: {checked ? "켜짐" : "꺼짐"}</label>
      </div>
    </>
  );
};

export const Uncontrolled = () => {
  const [observed, setObserved] = React.useState(false);
  return (
    <>
      <StyleBlock />
      <div className="demo-row">
        <Switch.Root className="demo-switch" id="uncontrolled" onCheckedChange={setObserved}>
          <Switch.Thumb className="demo-thumb" />
        </Switch.Root>
        <label htmlFor="uncontrolled">
          비제어 모드 (현재 관찰값: {observed ? "켜짐" : "꺼짐"})
        </label>
      </div>
      <p style={{ padding: "0 8px", fontSize: 13, color: "#666" }}>
        부모는 <code>checked</code>를 넘기지 않고 <code>onCheckedChange</code>로 변화만 관찰. 토글
        상태는 Switch 내부에서 관리됨.
      </p>
    </>
  );
};

export const DefaultChecked = () => (
  <>
    <StyleBlock />
    <div className="demo-row">
      <Switch.Root className="demo-switch" defaultChecked id="default-checked">
        <Switch.Thumb className="demo-thumb" />
      </Switch.Root>
      <label htmlFor="default-checked">기본 켜짐</label>
    </div>
  </>
);

export const Disabled = () => (
  <>
    <StyleBlock />
    <div className="demo-row">
      <Switch.Root className="demo-switch" disabled id="disabled-off">
        <Switch.Thumb className="demo-thumb" />
      </Switch.Root>
      <label htmlFor="disabled-off">비활성 (꺼짐)</label>
    </div>
    <div className="demo-row">
      <Switch.Root className="demo-switch" disabled defaultChecked id="disabled-on">
        <Switch.Thumb className="demo-thumb" />
      </Switch.Root>
      <label htmlFor="disabled-on">비활성 (켜짐)</label>
    </div>
  </>
);

export const InForm = () => {
  const [submitted, setSubmitted] = React.useState<string>("");
  return (
    <>
      <StyleBlock />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          setSubmitted(JSON.stringify(Object.fromEntries(data), null, 2));
        }}
      >
        <div className="demo-row">
          <Switch.Root className="demo-switch" name="newsletter" id="newsletter">
            <Switch.Thumb className="demo-thumb" />
          </Switch.Root>
          <label htmlFor="newsletter">뉴스레터 구독</label>
        </div>
        <div className="demo-row">
          <Switch.Root className="demo-switch" name="marketing" defaultChecked id="marketing">
            <Switch.Thumb className="demo-thumb" />
          </Switch.Root>
          <label htmlFor="marketing">마케팅 수신 동의</label>
        </div>
        <div className="demo-row">
          <button type="submit">제출</button>
        </div>
        {submitted && <pre>{submitted}</pre>}
      </form>
    </>
  );
};

export const AsChild = () => (
  <>
    <StyleBlock />
    <div className="demo-row">
      <Switch.Root asChild defaultChecked id="aschild">
        {/* biome-ignore lint/a11y/noNoninteractiveTabindex: Switch.Root가 런타임에 role="switch" + aria-checked를 주입해 대화형 요소가 됨 (asChild slot merge) */}
        <span className="demo-switch" tabIndex={0}>
          <Switch.Thumb className="demo-thumb" />
        </span>
      </Switch.Root>
      <label htmlFor="aschild">asChild로 span 렌더 (role/aria는 Switch.Root가 주입)</label>
    </div>
  </>
);
