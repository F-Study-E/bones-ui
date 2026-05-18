# @bones-ui/react

React 기반 headless UI 컴포넌트 라이브러리. 스타일 없이 동작하며 접근성(a11y)을 기본 내장.

## 설치

```bash
pnpm add @bones-ui/react
# or
npm install @bones-ui/react
# or
yarn add @bones-ui/react
```

## 사용법

```tsx
import { Accordion, Switch, Popover, Tooltip } from "@bones-ui/react";

function App() {
  return (
    <Accordion.Root type="single" collapsible>
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Accordion.Trigger>섹션 1</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>내용</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
```

## 제공 컴포넌트

- `Accordion` — 접고 펴는 패널 그룹 (single / multiple)
- `Switch` — on/off 토글
- `ToggleGroup` — 다중 선택 토글 그룹
- `Tooltip` — 호버/포커스 시 나타나는 보조 설명
- `Popover` — 트리거에 위치한 팝업 컨테이너
- `Slot` / `Primitive` — `asChild` 패턴 빌딩 블록
- 훅: `useControllableState`, `useComposeRefs`, `composeRefs`

## 설계 원칙

- **Headless**: 스타일 없음. CSS는 사용자가 자유롭게 작성.
- **접근성**: ARIA 속성과 키보드 내비게이션 기본 내장. `vitest-axe`로 자동 검증.
- **합성 가능**: 모든 part는 `asChild` + `forwardRef` 지원.
- **제어/비제어**: `value` / `defaultValue` / `onValueChange` 트리오로 둘 다 지원.
- **상태 노출**: `data-state="open"` 으로 CSS 셀렉터 작성 가능.

## 라이선스

MIT
