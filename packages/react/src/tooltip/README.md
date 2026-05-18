# Tooltip

호버/포커스 시 부가 정보를 표시하는 레이어. headless 컴포넌트 — 스타일 없음.

## 사용

```tsx
import { Tooltip } from "@bones-ui/react";

<Tooltip.Root>
  <Tooltip.Trigger>버튼</Tooltip.Trigger>
  <Tooltip.Content>설명 텍스트</Tooltip.Content>
</Tooltip.Root>
```

스타일은 `data-state` 셀렉터로 작성:

```css
.my-content { position: absolute; background: #1f2937; color: #fff; padding: 4px 8px; border-radius: 4px; }
.my-content[data-state="closed"] { display: none; }
.my-content[data-state="open"] { display: block; }
```

## API

### `<Tooltip.Root>`

상태와 ID를 자식에게 제공하는 Provider. DOM 요소 없이 렌더됨.

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `open` | `boolean` | — | 제어 값. 넘기면 controlled 모드 |
| `defaultOpen` | `boolean` | `false` | 비제어 초기값 |
| `onOpenChange` | `(open: boolean) => void` | — | 열림/닫힘이 바뀔 때 호출 |
| `delayDuration` | `number` | `700` | 마우스 호버 후 열리기까지의 지연 시간(ms). `0`이면 즉시 열림 |

### `<Tooltip.Trigger>`

`<button type="button">`으로 렌더(asChild 시 다른 요소). 호버·포커스 이벤트를 내부에서 관리.

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `asChild` | `boolean` | `false` | `true`면 자식 요소를 베이스로 렌더(props/ref 머지) |

button의 모든 표준 props 패스스루.

**부착되는 데이터 속성**:
- `data-state="open" | "closed"`

**관리되는 ARIA 속성**:
- `aria-describedby` ← 툴팁이 열려 있을 때만 Content의 id를 연결

`<Tooltip.Root>` 외부에서 사용 시 throw.

### `<Tooltip.Content>`

`<div role="tooltip">`으로 렌더. 항상 DOM에 존재하며 `data-state`와 `aria-hidden`으로 노출 여부를 제어.

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `asChild` | `boolean` | `false` | 자식 요소를 베이스로 렌더 |

div의 모든 표준 props 패스스루.

**부착되는 속성**:
- `data-state="open" | "closed"`
- `aria-hidden="true"` (닫힌 상태에서만)
- `id` (Trigger의 `aria-describedby`와 자동 연결)

`<Tooltip.Root>` 외부에서 사용 시 throw.

## 패턴

### 기본 (비제어)

```tsx
<Tooltip.Root delayDuration={500}>
  <Tooltip.Trigger>도움말</Tooltip.Trigger>
  <Tooltip.Content className="my-content">
    더 자세한 설명입니다
  </Tooltip.Content>
</Tooltip.Root>
```

### 제어 (Controlled)

부모가 열림 상태를 직접 관리.

```tsx
const [open, setOpen] = useState(false);

<Tooltip.Root open={open} onOpenChange={setOpen}>
  <Tooltip.Trigger>버튼</Tooltip.Trigger>
  <Tooltip.Content className="my-content">설명</Tooltip.Content>
</Tooltip.Root>
```

### 지연 없이 즉시 열기

```tsx
<Tooltip.Root delayDuration={0}>
  <Tooltip.Trigger>즉시</Tooltip.Trigger>
  <Tooltip.Content className="my-content">바로 보임</Tooltip.Content>
</Tooltip.Root>
```

### asChild

Trigger를 다른 요소로 교체. 포커스 가능한 요소여야 키보드 접근성이 보장됨.

```tsx
<Tooltip.Root>
  <Tooltip.Trigger asChild>
    <a href="/help">도움말 링크</a>
  </Tooltip.Trigger>
  <Tooltip.Content className="my-content">링크 설명</Tooltip.Content>
</Tooltip.Root>
```

비-포커스 요소(`span`, `div`)를 쓸 경우 `tabIndex={0}`을 직접 추가해야 키보드 포커스가 동작함.

### CSS 애니메이션

Content는 항상 DOM에 존재하므로 진입/퇴장 애니메이션 모두 구현 가능.

```css
.my-content {
  transition: opacity 150ms, transform 150ms;
}
.my-content[data-state="closed"] {
  opacity: 0;
  transform: scale(0.95);
  pointer-events: none;
}
.my-content[data-state="open"] {
  opacity: 1;
  transform: scale(1);
}
```

### 포지셔닝

이 컴포넌트는 위치를 직접 지정하지 않음. CSS `position: absolute` + 부모 `position: relative`로 처리하거나, floating-ui 같은 포지셔닝 라이브러리와 조합.

```tsx
<div style={{ position: "relative", display: "inline-block" }}>
  <Tooltip.Root>
    <Tooltip.Trigger>버튼</Tooltip.Trigger>
    <Tooltip.Content style={{ position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)" }}>
      설명
    </Tooltip.Content>
  </Tooltip.Root>
</div>
```

## 키보드

| 키 | 동작 |
|----|------|
| `Tab` / `Shift+Tab` | Trigger에 포커스 진입 시 즉시 열림, 이탈 시 닫힘 |
| `Escape` | 툴팁 즉시 닫힘 |

마우스 호버는 `delayDuration` 후 열리고, 키보드 포커스는 항상 즉시 열림.

## 접근성

- `role="tooltip"` (Content에 자동 부착)
- `aria-describedby` ← 열릴 때 Trigger에 Content id를 연결, 닫히면 제거
- `aria-hidden="true"` ← 닫힌 Content를 스크린 리더에서 숨김
- 인터랙티브 툴팁(Content 내부에 버튼 등)은 이 컴포넌트 범위 밖. Popover를 사용.

## 구현 메모

- **Content는 항상 DOM에 존재** — CSS 진입/퇴장 애니메이션을 위해 조건부 렌더 대신 `aria-hidden` + `data-state` 토글 방식 채택
- **이중 열기 경로** — 마우스 호버는 `openWithDelay`(타이머), 키보드 포커스는 `openImmediate`(즉시). delay 중 mouseleave나 blur가 오면 타이머 취소
- **Content 호버 유지** — Trigger `mouseleave` 시 300ms grace period를 두고, 그 안에 Content에 진입하면 `openImmediate`로 닫힘을 취소. Content에서 나가면 즉시 닫힘
- **`useControllableState`**(`../hooks`)로 controlled/uncontrolled 통합 처리
- **`useId`** (React 18)로 Trigger ↔ Content ARIA 연결 id 생성
- **`composeEventHandlers`** — 사용자 핸들러 → 내부 핸들러 순서. 사용자가 `preventDefault()`하면 내부 동작 스킵

## 파일 구조

```
tooltip/
├── tooltip.tsx         # Root, Trigger, Content 구현 + Context
├── tooltip.hook.ts     # useTooltip (delay 타이머, open 상태)
├── tooltip.types.ts    # TooltipRootProps, TooltipTriggerProps, TooltipContentProps
├── tooltip.utils.ts    # composeEventHandlers
├── tooltip.test.tsx    # 18개 테스트
├── index.ts            # `export * as Tooltip` + 타입 flat re-export
└── README.md           # 이 문서
```

## 관련 테스트

- 마우스 호버 + delay 경과 후 열림
- delay 중 이탈 시 열리지 않음
- 트리거 이탈 후 grace period 300ms 경과 시 닫힘
- 트리거 이탈 후 콘텐츠 진입 시 열린 상태 유지
- 콘텐츠 이탈 시 즉시 닫힘
- 포커스 즉시 열림
- blur 시 닫힘
- Escape 키 닫힘
- 비제어/제어 동작 분리
- `aria-describedby` ↔ Content id 연결
- `aria-hidden` 토글 (열림/닫힘)
- `data-state` Trigger/Content 동기화
- Trigger/Content를 Root 외부 사용 시 throw

[tooltip.test.tsx](./tooltip.test.tsx) 참조.
