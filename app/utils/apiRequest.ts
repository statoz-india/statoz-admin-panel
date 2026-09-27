/** A failed call to this app's API, with the backend's per-field `errors` when it sent any. */
export class ApiRequestError extends Error {
  errors: string[];
  /** HTTP status of the response (0 when none was received). */
  status: number;

  constructor(message: string, errors: string[] = [], status = 0) {
    super(message);
    this.name = "ApiRequestError";
    this.errors = errors;
    this.status = status;
  }
}

/** Calls this app's API and unwraps its `{ success, data, message }` envelope. */
export async function apiRequest<T>(
  url: string,
  init: RequestInit,
  fallbackMessage: string,
): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const body = await res.json().catch(() => ({}));

  if (!res.ok || !body?.success) {
    const errors: string[] = Array.isArray(body?.errors)
      ? body.errors.filter((e: unknown): e is string => typeof e === "string")
      : [];
    throw new ApiRequestError(
      body?.message || fallbackMessage,
      errors,
      res.status,
    );
  }

  return body.data as T;
}
