# @bones/react — CLAUDE.md

## 컴포넌트 파일 구조

컴포넌트는 `src/` 안에 **컴포넌트명 폴더** 단위로 관리한다.

```
src/
└── dialog/
    ├── dialog.tsx        # 컴포넌트 구현
    ├── dialog.hook.ts    # 컴포넌트 전용 훅
    ├── dialog.utils.ts   # 유틸 함수
    ├── dialog.types.ts   # 타입 정의
    ├── dialog.test.tsx   # 테스트
    └── index.ts          # export 전용 — 로직 작성 금지
```

### 규칙

- 모든 컴포넌트 작업은 `packages/react/src/` 안에서 한다
- 파일 단위 컴포넌트 금지 — 반드시 폴더로 구성한다
- `index.ts`는 export 전용이다. 로직, 타입, 구현 코드를 작성하지 않는다
- 컴파운드 패턴 컴포넌트는 구현을 파일별로 분리한다
  - `[name].tsx` — 컴포넌트 구현
  - `[name].hook.ts` — 컴포넌트 전용 훅 (필요 시)
  - `[name].utils.ts` — 유틸 함수 (필요 시)
  - `[name].types.ts` — 타입 정의 (필요 시)
  - `[name].test.tsx` — 테스트
