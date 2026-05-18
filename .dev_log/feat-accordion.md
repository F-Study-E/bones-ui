# feat/accordion

> **작성 루틴**: 작업 시작 전 "## 오늘 목표"를 먼저 쓴다. 작업 후 "## 히스토리"에 추가한다.

---

## 목표

- `@bones-ui/react`에 **Accordion** 컴포넌트 추가 (Root / Item / Trigger / Content)
- `type="single"` (collapsible 옵션) / `type="multiple"` 두 모드 지원
- 제어·비제어 모드, Root·Item 레벨 disabled, WAI-ARIA 완전 지원

---

## 참고

- [ ] 관련 이슈 / PR
- [ ] WAI-ARIA Accordion Pattern — aria-expanded / aria-controls / aria-labelledby 구조 참고

---

## 구현 히스토리

<!-- 새 항목은 맨 위에 추가 -->

### 2026-05-14

**오늘 목표**
- Accordion 컴포넌트 구현 (Root / Item / Trigger / Content)
- 테스트 작성
- Ladle 스토리 작성

**한 것**
- `packages/react/src/accordion/` 폴더 신설
  - `accordion.types.ts` — `AccordionRootProps`(single/multiple 유니온), `AccordionItemProps`, `AccordionTriggerProps`, `AccordionContentProps`
  - `accordion.tsx` — `Root`, `Item`, `Trigger`, `Content` 구현
    - Root: `type="single"` / `type="multiple"` 분기 → 내부 `AccordionSingleImpl` / `AccordionMultipleImpl`로 위임 (ToggleGroup 패턴 동일)
    - Root Context: `value: string[]` (single도 내부에서 배열로 통일), `onItemToggle`, `disabled`
    - Item Context: `value`, `isOpen`, `isDisabled`, `triggerId`(useId), `contentId`(useId)
    - Trigger: `aria-expanded`, `aria-controls`, `id` 자동 주입, `disabled` 전파, `onClick`에서 `preventDefault()` 취소 가능
    - Content: `<section>`으로 렌더 → `role="region"` 암묵적 부여 (Biome `a11y/useSemanticElements` 준수)
    - `data-state="open|closed"` + `data-open` 이중 부착 (CLAUDE.md 컨벤션)
  - `index.ts` — `export * as Accordion` + 타입 flat export
  - `accordion.test.tsx` — 테스트 27개 (기본 렌더, single 모드, multiple 모드, 제어/비제어, disabled, 접근성, 이벤트 합성, data-state, 컨텍스트 오류, ref 전달) 모두 통과
- `packages/react/src/primitive/primitive.tsx` — `NODES`에 `"section"` 추가
- `packages/react/src/index.ts` — accordion export 추가
- `apps/docs/src/accordion.stories.tsx` — 스토리 5개 (Single, Multiple, Controlled, DefaultOpen, Disabled)

**막힌 것 / 의문**
- `role="region"` on `<div>` → Biome `a11y/useSemanticElements` 경고. `<section>`으로 교체 시 `getAttribute("role")`이 `null` 반환 (암묵적 역할이므로). 테스트를 `tagName`/`querySelector("section")` 기반으로 수정해 해결

---

## 설계 결정 (Decision Log)

> "왜 이렇게 만들었는가"를 남기는 공간.

| 결정 | 대안 | 선택 이유 |
| ---- | ---- | --------- |
| Root 내부에서 `value`를 항상 `string[]`로 통일 | single/multiple 각각 다른 타입 | Context 타입 단일화, `ctx.value.includes(itemValue)` 하나로 통일 가능 |
| `AccordionSingleImpl` / `AccordionMultipleImpl` 분리 | Root 하나에서 조건 분기 | `useControllableState` 제네릭 타입이 달라 분기하면 훅 순서가 조건부로 변함 (훅 규칙 위반) |
| Content를 `<section>`으로 렌더 | `<div role="region">` | Biome `a11y/useSemanticElements` 준수, 시맨틱 HTML이 더 올바름 |
| `hidden={!isOpen}` 으로 Content 숨김 | CSS `display:none` / 언마운트 | headless 특성상 애니메이션은 사용자 몫. `data-state`로 CSS transition 가능, 언마운트보다 DOM 보존이 접근성 안전 |
| Item에 `useId`로 triggerId / contentId 자동 생성 | 사용자가 직접 id 주입 | aria 연결은 반드시 필요하지만 사용자가 신경 쓸 필요 없게. id 충돌 없이 SSR 안전 |
| Item `disabled`가 Root `disabled`를 오버라이드 가능 | Item이 Root를 항상 따름 | 일부 항목만 활성화하는 케이스 지원. `disabled ?? ctx.disabled` 패턴으로 명시적 false도 처리 |

---

## 미해결 / 나중에 볼 것

- [ ] `hidden={!isOpen}` 제거 — `hidden`은 `display:none`을 강제해 사용자가 CSS transition을 적용할 수 없음. headless 철학상 숨김 처리는 사용자 CSS(`[data-state="closed"]`)에 위임하고 `data-state`만 제공해야 함
- [ ] 키보드 내비게이션 — WAI-ARIA Accordion Pattern은 `ArrowDown` / `ArrowUp` / `Home` / `End` 로 Trigger 간 이동을 권장. 현재 미구현
- [ ] changeset 추가 필요 (`@bones-ui/react` minor)
