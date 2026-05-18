# Accordion

접을 수 있는 섹션 목록. headless 컴포넌트 — 스타일 없음.

## 사용

```tsx
import { Accordion } from "@bones-ui/react";

<Accordion.Root type="single" collapsible>
  <Accordion.Item value="item-1">
    <Accordion.Trigger>제목</Accordion.Trigger>
    <Accordion.Content>내용</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

스타일은 `data-state` 셀렉터로 작성:

```css
/* 닫힌 Content 숨기기 */
.my-content[data-state="closed"] { display: none; }

/* 열림/닫힘 전환 애니메이션 (grid 트릭) */
.my-content {
  display: grid;
  grid-template-rows: 0fr;
  overflow: hidden;
  transition: grid-template-rows 250ms ease;
}
.my-content[data-state="open"] { grid-template-rows: 1fr; }
.my-content > div { overflow: hidden; }

/* Trigger 화살표 회전 */
.my-chevron { transition: transform 180ms; }
.my-trigger[data-state="open"] .my-chevron { transform: rotate(180deg); }
```

## API

### `<Accordion.Root>`

`<div>`로 렌더. 전체 상태를 관리하는 최상위 컴포넌트.

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `type` | `"single" \| "multiple"` | — | **필수**. 한 번에 하나만 열리는지 여럿이 열리는지 |
| `value` | `string` \| `string[]` | — | 제어 값. `single`은 `string`, `multiple`은 `string[]` |
| `defaultValue` | `string` \| `string[]` | — | 비제어 초기값 |
| `onValueChange` | `(value) => void` | — | 값이 바뀔 때 호출 |
| `collapsible` | `boolean` | `false` | `type="single"`에서만 유효. 열린 항목을 다시 클릭해 닫을 수 있는지 |
| `disabled` | `boolean` | `false` | 모든 Item 비활성. Item 레벨 `disabled`로 개별 override 가능 |
| `asChild` | `boolean` | `false` | 자식 요소를 베이스로 렌더 |

div의 모든 표준 props 패스스루.

### `<Accordion.Item>`

`<div>`로 렌더. 하나의 섹션을 감싸는 컨테이너.

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `value` | `string` | — | **필수**. Root가 열림 상태를 추적하는 식별자. 같은 Root 안에서 유일해야 함 |
| `disabled` | `boolean` | — | 해당 항목만 비활성. Root의 `disabled`와 독립적으로 동작 |
| `asChild` | `boolean` | `false` | 자식 요소를 베이스로 렌더 |

**부착되는 데이터 속성**:
- `data-state="open" | "closed"`
- `data-open` (열린 상태에서만)
- `data-disabled` (비활성 상태에서만)

`<Accordion.Root>` 외부에서 사용 시 throw.

### `<Accordion.Trigger>`

`<button type="button">`으로 렌더. 클릭/Space/Enter로 해당 Item을 토글.

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `asChild` | `boolean` | `false` | 자식 요소를 베이스로 렌더 |

button의 모든 표준 props 패스스루.

**자동 주입되는 속성**:
- `aria-expanded` ← Item 열림 상태
- `aria-controls` ← 대응하는 Content의 id
- `id` ← Content의 `aria-labelledby`가 참조

**부착되는 데이터 속성**:
- `data-state="open" | "closed"`
- `data-open` (열린 상태에서만)
- `data-disabled` (비활성 상태에서만)

`<Accordion.Item>` 외부에서 사용 시 throw.

### `<Accordion.Content>`

`<section>`으로 렌더. 열림/닫힘에 따라 `data-state`가 바뀜. **숨김 처리는 CSS로 직접 작성** — `hidden` 속성을 쓰지 않으므로 CSS transition 적용 가능.

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `asChild` | `boolean` | `false` | 자식 요소를 베이스로 렌더 |

**자동 주입되는 속성**:
- `aria-labelledby` ← 대응하는 Trigger의 id

**부착되는 데이터 속성**:
- `data-state="open" | "closed"`
- `data-open` (열린 상태에서만)
- `data-disabled` (비활성 상태에서만)

`<Accordion.Item>` 외부에서 사용 시 throw.

## 패턴

### 단일 모드 (type="single")

한 번에 하나의 Item만 열림. 다른 항목을 클릭하면 이전 항목이 닫힘.

```tsx
// 기본: 열린 항목을 다시 클릭해도 닫히지 않음
<Accordion.Root type="single">
  ...
</Accordion.Root>

// collapsible: 열린 항목을 다시 클릭하면 닫힘
<Accordion.Root type="single" collapsible>
  ...
</Accordion.Root>
```

### 다중 모드 (type="multiple")

여러 Item이 동시에 열릴 수 있음. 열린 항목을 다시 클릭하면 닫힘.

```tsx
<Accordion.Root type="multiple">
  ...
</Accordion.Root>
```

### 비제어 (Uncontrolled)

```tsx
<Accordion.Root type="single" defaultValue="item-1">
  <Accordion.Item value="item-1">...</Accordion.Item>
  <Accordion.Item value="item-2">...</Accordion.Item>
</Accordion.Root>
```

### 제어 (Controlled)

```tsx
const [value, setValue] = useState("");

<Accordion.Root type="single" value={value} onValueChange={setValue}>
  ...
</Accordion.Root>
```

### Item 단위 disabled

Root `disabled`는 전체 비활성, Item `disabled`는 해당 항목만 비활성.

```tsx
<Accordion.Root type="single">
  <Accordion.Item value="q1">...</Accordion.Item>
  <Accordion.Item value="q2" disabled>...</Accordion.Item>  {/* 이 항목만 비활성 */}
</Accordion.Root>
```

### 열림/닫힘 애니메이션

Content는 항상 DOM에 존재하므로 CSS transition 적용 가능. `grid-template-rows` 트릭을 쓰면 높이를 몰라도 자연스러운 애니메이션이 된다.

```tsx
<Accordion.Content className="content">
  <div className="inner">{children}</div>  {/* 래퍼 div 필수 */}
</Accordion.Content>
```

```css
.content {
  display: grid;
  grid-template-rows: 0fr;
  overflow: hidden;
  transition: grid-template-rows 250ms ease;
}
.content[data-state="open"] { grid-template-rows: 1fr; }
.inner { overflow: hidden; }
```

### 토글 취소 (preventDefault)

Trigger의 `onClick`에서 `event.preventDefault()`를 호출하면 토글이 취소됨.

```tsx
<Accordion.Trigger onClick={(e) => {
  if (!confirm("열겠습니까?")) e.preventDefault();
}}>
  제목
</Accordion.Trigger>
```

## 키보드

| 키 | 동작 |
|----|------|
| `Space`, `Enter` | 항목 토글 (브라우저 button 기본 동작) |
| `Tab` | 다음 포커스로 이동 |

## 접근성

- Trigger: `aria-expanded`, `aria-controls` 자동 주입
- Content: `role="region"` (section 암묵적), `aria-labelledby` 자동 주입
- `disabled`일 때 클릭/키보드 모두 무시
- 라벨링은 Trigger 텍스트가 자동으로 Content의 accessible name이 됨 (`aria-labelledby` 연결)

## 구현 메모

- **두 Context 계층** — Root Context(값·토글 함수·disabled)와 Item Context(value·isOpen·isDisabled·id쌍)로 분리. Trigger와 Content는 Item Context만 소비
- **Root 내부에서 value를 항상 `string[]`로 통일** — single/multiple 구분 없이 `ctx.value.includes(itemValue)` 하나로 처리
- **`AccordionSingleImpl` / `AccordionMultipleImpl` 내부 분리** — `useControllableState`의 제네릭 타입이 달라 Root 하나에서 조건 분기하면 훅 순서가 조건부로 변함(훅 규칙 위반)
- **`React.useId()`로 triggerId / contentId 자동 생성** — 사용자가 id를 신경 쓰지 않아도 aria 연결이 보장됨. SSR 안전
- **`hidden` 속성 미사용** — CSS transition을 막지 않기 위해 숨김 처리를 `data-state` CSS에 위임
- **Content를 `<section>`으로 렌더** — `role="region"` 암묵적 부여. Biome `a11y/useSemanticElements` 준수

## 파일 구조

```
accordion/
├── accordion.tsx        # Root, Item, Trigger, Content 구현 + Context
├── accordion.types.ts   # AccordionRootProps, AccordionItemProps 등
├── accordion.test.tsx   # 27개 테스트
├── index.ts             # `export * as Accordion` + 타입 flat re-export
└── README.md            # 이 문서
```

## 관련 테스트

- 기본 렌더 (button, 초기 data-state)
- single 모드 — 전환, collapsible 여부
- multiple 모드 — 동시 열기, 닫기
- 비제어/제어 동작 분리
- Root·Item 레벨 `disabled`
- `preventDefault()`로 토글 취소
- aria-controls ↔ Content id 연결, aria-labelledby ↔ Trigger id 연결
- `data-state` / `data-open` 이중 부착
- 컨텍스트 외부 사용 시 throw (Root 외부 Item, Item 외부 Trigger)
- ref 전달 (Root div, Trigger button, Content section)

[accordion.test.tsx](./accordion.test.tsx) 참조.
