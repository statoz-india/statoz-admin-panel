import type { WheelEvent } from "react";

/**
 * Stop a scroll over a focused number input from silently changing its value.
 * Attach as `onWheel` on any `<input type="number">`.
 */
export function stopWheelFromChangingFocusedNumberInput(
  e: WheelEvent<HTMLInputElement>,
) {
  if (document.activeElement === e.currentTarget) {
    e.preventDefault();
    e.currentTarget.blur();
  }
}
