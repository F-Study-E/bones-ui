# feat/switch

> **작성 루틴**: 작업 시작 전 "## 오늘 목표"를 먼저 쓴다. 작업 후 "## 히스토리"에 추가한다.

---

## 목표

- `@bones/react`에 첫 상태 컴포넌트인 **Switch** 추가 (Switch.Root + Switch.Thumb)
- 그 과정에서 토대 정리:
  - `@bones/hooks` 패키지 부트스트랩 + `useControllableState` 신설
  - 도트 표기 export 컨벤션(`Switch.Root`)으로 전환 — 이후 Dialog/Popover의 템플릿
  - 기존 `primitive.tsx` dts 빌드 에러 픽스
- 워크스페이스 차원의 IDE/포매터 기본값 정리(`.vscode/`, CLAUDE.md 코드 스타일 섹션)

---

## 참고

- [ ] 관련 이슈 / PR
- [ ] Radix UI Switch — API/구현 참고 출처

---

## 구현 히스토리

<!-- 새 항목은 맨 위에 추가 -->

### 2026-05-03

**오늘 목표**
- Switch 컴포넌트 + 스토리 + 테스트
- @bones/hooks 부트스트랩 + useControllableState
- 도트 표기 export 컨벤션 채택
- 4개 커밋으로 분리 (chore / refactor / feat-hooks / feat-switch)

**한 것**
- `@bones/hooks` 패키지 신설 — `package.json`, `tsconfig`, `tsup`, `vitest` 설정. `useCallbackRef`, `useControllableState` 구현 + 단위 테스트 9개 (모두 통과)
- `Switch.Root` + `Switch.Thumb` 구현
  - Radix 컨벤션의 `checked` / `defaultChecked` / `onCheckedChange` 인터페이스
  - `role="switch"`, `aria-checked`, `data-state="checked|unchecked"` + `data-checked` 이중 부착
  - `<button type="button">` 베이스 → Space/Enter 키보드 토글 무료 획득
  - `BubbleInput`(시각적으로 숨긴 checkbox)으로 `<form>` 통합 — `name` prop이 있고 form 컨텍스트일 때만 렌더, ResizeObserver로 control 사이즈 동기화
  - `composeEventHandlers` 헬퍼 — 사용자 `onClick`에서 `preventDefault()`로 토글 취소 가능
  - `asChild` + `forwardRef` 양쪽 part 모두 지원
- 단위 테스트 22개(키보드, 제어/비제어, disabled, asChild, form 통합, ref 전달 등) — 모두 통과
- Ladle 스토리 7개(Default, Controlled, Uncontrolled, DefaultChecked, Disabled, InForm, AsChild) 작성
- export 컨벤션을 flat → 도트로 전환. CLAUDE.md 갱신, Switch도 그 컨벤션으로 작성
- 기존 `primitive.tsx`의 `reduce` 인덱스 할당 union/intersection 문제 픽스 (`Object.fromEntries` + 최종 캐스트로 우회)
- 워크스페이스 `.vscode/settings.json` + `extensions.json` 추가 — Biome을 모든 JS/TS/JSON 기본 포매터로, format-on-save + organize imports 활성화. `extensions.json`으로 Biome 확장 권장 등록
- CLAUDE.md에 `### 코드 스타일` 섹션 추가 — `lineWidth: 100` 명시
- changeset(@bones/react minor + @bones/hooks minor) 추가
- 4개 커밋으로 분리: `chore`, `refactor(react)`, `feat(hooks)`, `feat(switch)`

**막힌 것 / 의문**
- TypeScript `exactOptionalPropertyTypes`로 인해 `asChild={undefined}` 명시적 전달이 안 됨 → 해당 prop은 destructure하지 않고 rest로 흘려보내는 패턴 사용
- AsChild 스토리에서 Biome a11y 룰이 충돌 — `<span>`에 role="switch"는 focusable 아니라 막히고, 빼면 tabIndex 부여가 막힘. asChild 런타임 슬롯 머지를 정적 분석이 알 수 없는 본질적 한계라 `biome-ignore` + 명시적 사유 주석으로 처리

---

<!-- 아래는 에러 발생 시 복사해서 사용 -->

### 🐛 에러 기록

**에러 메시지**
```
src/primitive/primitive.tsx(44,3): error TS2322:
Type 'PrimitiveForwardRefComponent<"button"> | ... | PrimitiveForwardRefComponent<"ul">'
is not assignable to type 'PrimitiveForwardRefComponent<"button"> & ... & PrimitiveForwardRefComponent<"ul">'
```

**원인 파악**
- `NODES.reduce((acc, node) => { acc[node] = Component as Primitives[typeof node]; ... }, {} as Primitives)` 패턴.
- 루프 안에서 `node`는 union 타입(`Node = "a" | "button" | ...`). 따라서 `Primitives[typeof node]`는 모든 슬롯의 union으로 분배(distributive lookup).
- `acc[node] = X` 인덱스 할당의 좌변은 임의의 키를 받을 수 있어야 해서, `X`가 모든 슬롯에 대입 가능해야 함 → intersection 요구.
- 우변(union)을 좌변(intersection)에 할당 시도 → 실패. 특히 `exactOptionalPropertyTypes: true` 환경에서 `defaultProps`의 invariance가 더 엄격해 더욱 명시적으로 깨짐
- 단위 테스트는 통과했지만 `tsup`의 dts 산출 단계가 `tsc`를 실제로 돌려 실패 → `dist/index.d.ts` 생성 안 됨 → docs(IDE) 측에서 `@bones/react` 타입을 못 찾는 부작용까지

**시도한 것들**
1. `acc[node] = Component as unknown as Primitives[typeof node]` — RHS만 캐스팅, LHS의 invariance 문제는 그대로
2. `Partial<Primitives>` 누산기 — 슬롯 타입에 `| undefined` 더해질 뿐 distributive lookup 문제 동일
3. 제너릭 헬퍼 `add<E extends Node>(node: E, comp: ...)` — for-of 안에서 호출 시 `typeof node`가 여전히 union이라 실패

**해결**
- `Object.fromEntries(NODES.map((node) => [node, Component]))` + 최종 `as Primitives` 캐스트.
- 인덱스 할당이 사라지면서 invariance 충돌도 사라짐. 런타임 결과는 동일.

**배운 것**
- `(acc as Record<K, V>)[node] = X`에서 `node: K가 union`이면 좌변은 intersection을 요구한다는 걸 인덱스 할당 invariance로 복습.
- `tsup --dts`는 내부적으로 `tsc`를 돌리므로 `tsc --noEmit`이 깨지면 dts도 깨진다. 단위 테스트만으로는 발견 불가 — `pnpm build`까지 자주 돌려야 함.

---

## 설계 결정 (Decision Log)

> "왜 이렇게 만들었는가"를 남기는 공간.

| 결정 | 대안 | 선택 이유 |
| ---- | ---- | --------- |
| `checked` / `defaultChecked` / `onCheckedChange` 네이밍 | `value` / `defaultValue` / `onValueChange` (CLAUDE.md "삼총사") | boolean 토글의 자연스러운 도메인 용어, HTML `<input type=checkbox>`와 일치, Radix 표준 |
| `Switch.Root` + `Switch.Thumb` 도트 표기 | `Switch` + `SwitchThumb` flat | 부품 많아질 때(Dialog 등) 시각적 그룹핑 압도적, Radix/Headless UI/Ark UI 표준. 모던 번들러는 namespace re-export를 정상 tree-shake |
| 도트 표기를 1차 API로 결정 | flat을 1차 + 도트는 secondary | "둘 다 지원"은 학습 비용 분산. 일관성 위해 한 쪽으로 통일 |
| `useControllableState`를 `@bones/hooks`에 신설 | `switch` 폴더 안에 로컬 훅 | Dialog/Popover/Checkbox에서 동일하게 재사용. 공용 훅 패키지의 첫 입주자 |
| Form 통합을 hidden checkbox(`BubbleInput`)로 구현 | form 통합 미지원 | RHF/Formik 호환, 기본 `<form>` 통합도 자연스러움. `name` 없으면 렌더 안 해 zero-cost |
| `<button type="button">` 베이스 + 키보드 핸들러 미작성 | 명시적 `onKeyDown` 처리 | 브라우저 기본 동작이 Space/Enter 토글을 click 이벤트로 보내므로 별도 코드 불필요 — 적게 쓸수록 좋음 |
| 사용자 `preventDefault()`로 토글 취소 가능 | preventDefault 무시 | `composeEventHandlers`의 표준 동작. preventDefault는 "사용자가 의도적으로 막은 것" 시그널이라 존중 |
| `useIsFormControl`로 form 안 여부 감지 | 항상 hidden input 렌더 | form 밖에서는 의미 없는 input이 DOM에 남음. `closest("form")` 한 번이면 결정 가능 |
| `composeEventHandlers`를 `switch.utils.ts`에 위치 | 처음부터 `@bones/utils` | YAGNI. 두 번째 컴포넌트(Dialog 등)에서 import하기 시작하면 그때 승격 |
| `displayName = "Switch.Root"` 형식 | `"SwitchRoot"` | DevTools에서 도트 표기 그대로 보여 일관성 |
| AsChild 스토리에 `biome-ignore` 1줄 | 다른 element로 우회 / 스토리 삭제 | asChild 런타임 슬롯 머지를 정적 분석이 알 수 없는 본질적 한계. 명시적 사유 주석으로 의도 노출 |
| dts 픽스를 `Object.fromEntries`로 | `as any` + `biome-ignore` | 동일한 결과를 더 깔끔하게. 리뷰어가 우회 의도 직관 파악 가능 |

---

## 미해결 / 나중에 볼 것

- [ ] vitest-axe 셋업 (현재 `setup.ts`에 TODO만 있음). 모든 컴포넌트 a11y 테스트에 통합되도록 다음 컴포넌트 작업 시 정리
- [ ] `composeEventHandlers` 두 번째 컴포넌트가 import 시작하면 `@bones/utils` 또는 새 위치로 승격
- [ ] 사전 존재 changeset `primitive-slot-compose-refs.md`가 제거된 `@bones/primitive` 패키지를 참조 — `version-packages` 단계에서 stale 경고 가능. 별건으로 정리
- [ ] `<button type="button">` 베이스인 Switch에 Space 키 핸들러를 명시적으로 두지 않았음 — 사용자가 `asChild`로 비-button 요소(div 등)를 넣으면 키보드 토글이 동작하지 않음. README 또는 d.ts JSDoc으로 한계 명시 필요
