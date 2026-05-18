# chore/npm-release

> **작성 루틴**: 작업 시작 전 "## 오늘 목표"를 먼저 쓴다. 작업 후 "## 히스토리"에 추가한다.

---

## 목표

`@bones-ui/react` 첫 npm 공개 배포(0.1.0). 사전 정리(스코프/메타데이터/LICENSE/README)와 changeset 정합성 복구 포함.

---

## 참고

- [ ] npm registry: https://www.npmjs.com/package/@bones-ui/react (배포 후)
- [ ] @bones org 소유: ehdrjs4502 (owner 확인됨)

---

## 구현 히스토리

### 2026-05-18

**오늘 목표**
- @bones-ui/react를 npm public으로 첫 배포한다.

**한 것**
- `npm whoami`, `npm org ls bones`로 publish 가능 환경 확인
- 기존 changeset 중 `@bones-ui/primitive` 참조 1건이 깨져 있어 `@bones-ui/react`로 교정
  - 이유: Slot/Primitive는 별도 패키지로 분리되지 않고 `@bones-ui/react`에 포함된 채 유지 중
- `packages/react/package.json`에 `publishConfig`(public access), `repository`, `homepage`, `bugs`, `sideEffects: false` 추가
- 루트와 `packages/react`에 MIT LICENSE 작성
- `packages/react/README.md` 작성 (npm 페이지에 표시됨)
- `pnpm version-packages`로 0.0.0 → 0.1.0 bump 및 CHANGELOG.md 생성
- `pnpm --filter @bones-ui/react build` 통과
- `npm publish --access public` 실행

**막힌 것 / 의문**
-

---

## 설계 결정 (Decision Log)

| 결정 | 대안 | 선택 이유 |
| ---- | ---- | --------- |
| 첫 버전 0.1.0 | 1.0.0 | API가 아직 일부(dialog TODO)이므로 0.x로 시작 |
| `@bones-ui/primitive` 체인지셋을 삭제 대신 `@bones-ui/react`로 재지정 | 삭제 | 작성된 의도(Slot/composeRefs 첫 구현)를 changelog에 남기기 위함 |
| `sideEffects: false` 추가 | 생략 | 모든 export가 순수 — tree-shaking 보장을 명시 |

---

## 미해결 / 나중에 볼 것

- [ ] `dialog`는 아직 미완성 (`src/index.ts`에 TODO). 다음 릴리즈에 포함.
- [ ] CI에서 자동 release 워크플로우 구성 (현재는 로컬 publish)
