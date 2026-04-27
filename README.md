# Bones UI

React 기반 headless UI 라이브러리. 스타일 없이 동작, 접근성 기본 내장.

## 기술 스택

| 영역 | 선택 | 비고 |
|------|------|------|
| 언어 | TypeScript (strict) | 라이브러리 DX의 근본 |
| 프레임워크 | React 18 | |
| 패키지 매니저 | pnpm workspaces | symlink 방식, 속도/디스크 효율 최고 |
| 빌드 오케스트레이션 | Turborepo | 캐싱만 얹는 구조 |
| 번들러 | tsup | ESM+CJS+dts 한 방에 |
| 문서/플레이그라운드 | Ladle | Storybook 호환, 훨씬 빠름 |
| 린터/포매터 | Biome | 하나로 해결, Rust 기반 |
| 버전/릴리즈 | Changesets | 모노레포 표준 |
| 테스트 | Vitest + @testing-library/react + vitest-axe | a11y 자동 검증 |
| E2E/a11y | Playwright + @axe-core/playwright (예정) | |
| CI | GitHub Actions + Turborepo remote cache | |

## 패키지

| 패키지 | 설명 |
|--------|------|
| `@bones/react` | 메인 headless 컴포넌트 |
| `@bones/primitive` | Slot, composeRefs 등 저수준 유틸 |
| `@bones/hooks` | useControllableState 등 공용 훅 |

## 개발 환경 설정

```bash
pnpm install
pnpm dev
```

## 주요 명령어

```bash
pnpm dev          # 전체 watch 모드
pnpm build        # 전체 빌드
pnpm test         # 전체 테스트
pnpm lint         # lint 검사
pnpm format       # format 자동 수정
pnpm typecheck    # 타입 검사
pnpm clean        # 빌드 결과물 삭제
```

특정 패키지만:

```bash
pnpm --filter @bones/react build
pnpm --filter @bones/react test
```

## 컴포넌트 문서 구조

각 컴포넌트 문서는 다음 순서로 작성한다.

```
Overview → Anatomy → Installation → API Reference → Examples → Accessibility
```

## 로드맵

- **v0**: headless 컴포넌트 (`@bones/react`)
- **v1**: 스타일 레이어 추가 (`@bones/css`, `@bones/theme`)
