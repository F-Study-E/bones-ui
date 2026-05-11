type EventLike = { defaultPrevented: boolean };

export function composeEventHandlers<E extends EventLike>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);
    if (!checkForDefaultPrevented || !event.defaultPrevented) {
      ourEventHandler?.(event);
    }
  };
}
