# Bones UI — CLAUDE.md

## 프로젝트 개요

React 기반 headless UI 라이브러리 모노레포. 최종 목표: npm 공개 배포.

- **v0 (현재)**: 스타일 없는 headless 컴포넌트 (`@bones/react`)
- **v1 (예정)**: 스타일 레이어 별도 패키지 추가 — `@bones/react`는 수정하지 않음

## 패키지 구조

```
packages/
├── react/      @bones/react      메인 headless 컴포넌트 (npm public)
├── primitive/  @bones/primitive  Slot, composeRefs (npm public)
├── hooks/      @bones/hooks      공용 훅 (npm public)
└── utils/      @bones/utils      내부 유틸 (private, npm 배포 안 함)
apps/
├── docs/        Ladle 문서
└── playground/  개발용 샌드박스
```

의존 방향 (단방향 엄수): `utils ← hooks ← primitive ← react`

## 컨벤션

### 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 파일명 | `kebab-case` | `dialog-trigger.tsx` |
| 컴포넌트 | `PascalCase` | `DialogTrigger` |
| 훅 | `camelCase` + `use` 접두사 | `useControllableState` |
| 타입 (외부) | `PascalCase` | `DialogProps` |
| 타입 (내부) | `PascalCase` + `Internal` 접미사 | `DialogInternalState` |

### export 구조

```ts
// 개별 export (tree-shaking 친화)
export { DialogRoot, DialogTrigger, DialogClose } from "./dialog";
// namespace object (라이브러리 작성자 편의)
export * as DialogPrimitive from "./dialog";
```

### Git

- 브랜치: `feat/` `fix/` `chore/` `docs/` `refactor/`
- 커밋: Conventional Commits, 메시지는 **한글 우선** — `feat(dialog): 모달 모드 추가`
- `packages/*` 변경 PR에는 `.changeset/*.md` 필수 (Claude가 작성, 사람이 확인)
- 커밋 훅: Husky + lint-staged (Biome lint/format 자동 실행)

## 컴포넌트 개발 규칙

### 개발 순서

1. `packages/react/src/[component]/` 구현
2. `apps/docs/src/[component].stories.tsx` story 작성
3. `[component].test.tsx` 테스트 작성
4. `pnpm changeset`
5. PR

story 없이 `index.ts` export 추가 금지.

### API 원칙

- 모든 part: `asChild` + `forwardRef` 필수
- 제어/비제어: `value` / `defaultValue` / `onValueChange` 삼총사
- 상태 노출: `data-state="open"` + `data-open` 이중 부착
- 이벤트: `onOpenChange`, `onValueChange` 네이밍, `preventDefault()` 취소 가능하게 설계
- `className` 조건부 로직 금지 — CSS는 `data-*` 셀렉터로

## 테스트 규칙

- a11y 테스트 필수 (`vitest-axe`)
- keyboard navigation 필수
- 쿼리 우선순위: `getByRole` > `getByText` > `getByTestId`

## 릴리즈

```bash
pnpm changeset        # 변경 기록 (minor/patch/major 선택)
pnpm version-packages # 버전 bump + CHANGELOG (CI)
pnpm release          # build + npm publish (CI)
```

## 루틴 (Routine)

브랜치를 새로 생성할 때마다 반드시 아래를 수행한다.

1. `.dev_log/[브랜치명].md`를 `.dev_log/_branch-template.md`에서 복사해 생성한다
2. `ROUTINE.md`를 열어 작업 루틴을 안내한다

```bash
cp .log/_branch-template.md .log/[브랜치명].md
```

- 로그 파일은 반드시 `.dev_log/` 안에 위치한다
- 브랜치당 로그 파일 하나. 같은 브랜치에서 계속 이어쓴다

## 금지 사항

- `@bones/utils` npm 배포 대상 변경
- 패키지 의존 방향 역전
- story 없이 컴포넌트 export
- changeset 없이 `packages/*` 변경 PR
- `@bones/react`에 스타일 추가 (v1 전까지)
