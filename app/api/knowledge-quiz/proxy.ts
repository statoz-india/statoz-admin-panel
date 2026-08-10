/** Helpers shared by the knowledge-quiz proxy routes. */

export function backendErrorMessage(raw: string, fallback: string): string {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Non-JSON bodies are error pages (an HTML 404 from the proxy, a gateway
    // error), not messages worth showing an editor.
    const text = raw.trim();
    return text && !text.startsWith("<") && text.length <= 200 ? text : fallback;
  }
  if (typeof parsed.message === "string") return parsed.message;
  if (typeof parsed.error === "string") return parsed.error;
  return fallback;
}
