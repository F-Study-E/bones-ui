# feat/primitive

> **작성 루틴**: 작업 시작 전 "## 오늘 목표"를 먼저 쓴다. 작업 후 "## 히스토리"에 추가한다.

---

## 목표

- `@bones/primitive` 패키지의 `Slot`, `composeRefs`, `useComposeRefs` 구현
- 단위 테스트 + vitest 설정
- 첫 changeset (minor) 추가

---

## 참고

- [ ] 관련 이슈 / PR
- [ ]

---

## 구현 히스토리

<!-- 새 항목은 맨 위에 추가 -->

### 2026-05-02

**오늘 목표**
- Slot, composeRefs 초기 구현 + 테스트

**한 것**
- `composeRefs`, `useComposeRefs` 구현 (Radix 패턴 차용)
- `Slot` 구현 — props/ref 머지, `className`/`style` 합성, 이벤트 핸들러 child→slot 순서로 모두 호출
- vitest 환경 설정 (happy-dom) + 단위 테스트 10개 (모두 통과)
- changeset(minor) 추가
- 빌드 성공 — `dist/index.{js,cjs,d.ts}` 생성

**막힌 것 / 의문**
- 파일명 컨벤션이 CLAUDE.md(kebab-case)와 실제 placeholder(PascalCase/camelCase) 사이 충돌. 일단 placeholder 따라감

---

<!-- 아래는 에러 발생 시 복사해서 사용 -->
<!--
### 🐛 에러 기록

**에러 메시지**
```
```

**원인 파악**


**시도한 것들**
1.
2.

**해결**


**배운 것**

-->

---

## 설계 결정 (Decision Log)

> "왜 이렇게 만들었는가"를 남기는 공간.

| 결정 | 대안 | 선택 이유 |
| ---- | ---- | --------- |
| 파일명 PascalCase/camelCase 유지 | kebab-case로 일괄 변경 | placeholder가 이미 그렇게 있고, hooks 패키지도 동일. 컨벤션 정리는 별도 PR |
| `Slottable` 미포함 | 함께 구현 | v0 단순화. 첫 컴포넌트가 실제로 필요할 때 추가 |
| 핸들러 호출 순서: child → slot | slot → child | child(사용자 element)가 먼저 실행되어야 사용자가 `preventDefault`로 slot 핸들러 차단 가능 |
| 빌드 위해 `composite: false` 오버라이드 | lib.json 자체 수정 | 다른 패키지는 아직 빌드 검증 전. 영향 범위 좁히기 위해 패키지 단위 오버라이드 |

---

## 미해결 / 나중에 볼 것

- [ ]
- [ ]
