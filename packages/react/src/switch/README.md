# Switch

이진 on/off 토글. headless 컴포넌트 — 스타일 없음.

## 사용

```tsx
import { Switch } from "@bones/react";

<Switch.Root checked={on} onCheckedChange={setOn}>
  <Switch.Thumb />
</Switch.Root>
```

스타일은 `data-state` 셀렉터로 작성:

```css
.my-switch { background: gray; }
.my-switch[data-state="checked"] { background: blue; }
.my-switch[data-disabled] { opacity: 0.5; cursor: not-allowed; }

.my-thumb { transform: translateX(2px); }
.my-thumb[data-state="checked"] { transform: translateX(19px); }
```

## API

### `<Switch.Root>`

`<button role="switch">`로 렌더(asChild 시 다른 요소). 클릭/Space/Enter로 토글.

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `checked` | `boolean` | — | 제어 값. 넘기면 controlled 모드 |
| `defaultChecked` | `boolean` | `false` | 비제어 초기값 |
| `onCheckedChange` | `(checked: boolean) => void` | — | 값이 바뀔 때 호출. controlled에서는 driver, uncontrolled에서는 관찰자 |
| `disabled` | `boolean` | — | 토글 비활성. `data-disabled` 부착 |
| `required` | `boolean` | — | form 통합 시 `aria-required` |
| `name` | `string` | — | form `<input>` name. **있고 form 안일 때만** hidden checkbox 렌더 |
| `value` | `string` | `"on"` | checked 상태에서 form submit 시 전송될 값 |
| `form` | `string` | — | hidden input의 form 속성 |
| `asChild` | `boolean` | `false` | `true`면 자식 요소를 베이스로 렌더(props/ref 머지) |

button의 모든 표준 props도 패스스루.

**부착되는 데이터 속성**:
- `data-state="checked" | "unchecked"`
- `data-checked` (체크 상태에서만)
- `data-disabled` (disabled에서만)

### `<Switch.Thumb>`

`<span>`으로 렌더. 시각적 손잡이용. Root의 상태를 동일한 데이터 속성으로 노출.

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `asChild` | `boolean` | `false` | 자식 요소를 베이스로 렌더 |

span의 모든 표준 props 패스스루.

`<Switch.Root>` 외부에서 사용 시 throw.

## 패턴

### 비제어 (Uncontrolled)

부모가 상태를 보유하지 않음. Switch가 자체 관리.

```tsx
<Switch.Root defaultChecked onCheckedChange={(c) => console.log(c)}>
  <Switch.Thumb />
</Switch.Root>
```

`onCheckedChange`는 옵셔널 — 변화 알림용 관찰자.

### 제어 (Controlled)

부모가 상태 보유. `onCheckedChange`로 setState하지 않으면 토글이 멈춤(의도적).

```tsx
const [on, setOn] = useState(false);
<Switch.Root checked={on} onCheckedChange={setOn}>
  <Switch.Thumb />
</Switch.Root>
```

### Form 통합

`<form>` 안에서 `name` prop을 주면 시각적으로 숨긴 `<input type="checkbox">`가 같이 렌더돼 `FormData`에 값이 포함됨.

```tsx
<form onSubmit={(e) => {
  e.preventDefault();
  console.log(new FormData(e.currentTarget).get("agree")); // "on"
}}>
  <Switch.Root name="agree" defaultChecked>
    <Switch.Thumb />
  </Switch.Root>
  <button type="submit">제출</button>
</form>
```

form 밖에서 `name`만 주면 hidden input은 렌더되지 않음(불필요한 DOM 노이즈 방지).

### asChild

베이스 element를 다른 것으로 교체.

```tsx
<Switch.Root asChild defaultChecked>
  <a href="/settings">
    <Switch.Thumb />
  </a>
</Switch.Root>
```

자식 element는 **포커스 가능**해야 한다(Switch.Root는 키보드 토글을 button의 기본 동작에 의존). `<button>`/`<a href>` 같은 자연 포커스 요소를 권장. `<span>`/`<div>` 같은 비-포커스 요소를 쓸 거면 `tabIndex={0}` + 키보드 핸들러 직접 처리 필요.

### 토글 취소 (preventDefault)

사용자 `onClick`에서 `event.preventDefault()`를 호출하면 토글이 취소됨.

```tsx
<Switch.Root onClick={(e) => {
  if (!confirm("정말 끄시겠습니까?")) e.preventDefault();
}} />
```

## 키보드

| 키 | 동작 |
|----|------|
| `Space`, `Enter` | 토글 (브라우저의 button 기본 동작) |
| `Tab` | 다음 포커스 |

asChild로 비-button 요소를 사용한 경우, 키보드 토글은 사용자가 직접 처리해야 함.

## 접근성

- `role="switch"` (Root에 자동 부착)
- `aria-checked` ← `checked` 상태와 동기화
- `aria-required` ← `required` prop
- `disabled`일 때 클릭/키보드 모두 무시
- 라벨링은 `<label htmlFor>` 또는 `aria-label`/`aria-labelledby`로 사용자가 연결

## 구현 메모

- **Context로 Root → Thumb 상태 전달**. Thumb은 `data-state` 표시만 담당
- **`<button type="button">` 베이스** — Space/Enter 토글을 브라우저 기본 동작에 위임
- **`composeEventHandlers`** — 사용자 핸들러 → 내부 토글 순서. 사용자가 `preventDefault()`하면 내부 토글 스킵
- **`useControllableState`**(`@bones/hooks`)로 controlled/uncontrolled 통합 처리
- **`BubbleInput`**: 시각적으로 숨긴 hidden checkbox. `useIsFormControl`로 form 컨텍스트일 때만 렌더, `ResizeObserver`로 control과 사이즈 동기화. native checked descriptor를 호출해 `change` 이벤트를 발화시켜 form 라이브러리(RHF/Formik) 호환

## 파일 구조

```
switch/
├── switch.tsx          # Root, Thumb 구현 + Context
├── switch.types.ts     # SwitchProps, SwitchThumbProps
├── switch.utils.ts     # composeEventHandlers
├── bubble-input.tsx    # form 통합용 hidden checkbox + usePrevious + useSize
├── switch.test.tsx     # 22개 테스트
├── index.ts            # `export * as Switch` + 타입 flat re-export
└── README.md           # 이 문서
```

## 관련 테스트

- 키보드 토글 (Space/Enter)
- 비제어/제어 동작 분리
- `disabled` 시 클릭/키보드 무시
- `preventDefault()`로 토글 취소
- Thumb data-state 동기화
- form 안에서 hidden input 렌더 + FormData 통합
- form 밖에서 hidden input 미렌더
- asChild 양쪽 part
- ref 전달 (button, span)
- `Switch.Thumb`을 `Switch.Root` 외부 사용 시 throw

[switch.test.tsx](./switch.test.tsx) 참조.
