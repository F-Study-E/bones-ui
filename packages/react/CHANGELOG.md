# @bones-ui/react

## 0.1.0

### Minor Changes

- 96b5acd: `Slot`, `composeRefs`, `useComposeRefs` 첫 구현. `asChild` 패턴과 ref 합성을 위한 핵심 프리미티브.
- b9f6d8b: `Switch` 컴포넌트와 `useControllableState` 훅 첫 구현. `Switch` + `Switch.Thumb` 합성, `checked` / `defaultChecked` / `onCheckedChange` 제어 인터페이스, hidden checkbox를 통한 form 통합, `asChild`와 `data-state` 이중 부착 지원.
- 2074419: `Tooltip` 컴포넌트 첫 구현. `Tooltip.Root` / `Tooltip.Trigger` / `Tooltip.Content` 합성 패턴, `open` / `defaultOpen` / `onOpenChange` 제어 인터페이스, `delayDuration` 호버 딜레이, 포커스 즉시 열림, Escape 키 닫힘, `aria-describedby` + `role="tooltip"` 완전한 a11y 지원, `data-state` + `asChild` 포함.
