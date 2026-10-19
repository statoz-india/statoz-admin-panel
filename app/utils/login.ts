/**
 * Trim and lower-case an email. Send-otp and login both send this exact
 * string: the backend checks the code against the address it was sent to, so
 * `Admin@statoz.in` vs `admin@statoz.in` fails as "Invalid OTP".
 */
export function normalizeEmail(email: unknown): string {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

const LOGIN_ERRORS = new Map<string, string>([
  ["Email and otp are required field", "Enter your email and the code."],
  [
    "OTP expired or not found",
    "This code has expired or was already used. Request a new one.",
  ],
  ["Invalid OTP", "That code isn't right. Check it and try again."],
  [
    "User should be superadmin to access admin panel",
    "This account isn't an admin.",
  ],
  ["User does not exist", "No account uses this email."],
]);

/** What to tell the admin when send-otp or login fails. */
export function loginErrorMessage(
  status: number,
  backendMessage: unknown,
  fallback: string,
): string {
  // 5 failed attempts from one IP within 15 minutes.
  if (status === 429) return "Too many attempts. Wait 15 minutes, then try again.";
  const message = typeof backendMessage === "string" ? backendMessage : "";
  return LOGIN_ERRORS.get(message) ?? (message || fallback);
}
