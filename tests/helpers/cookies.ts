/**
 * In-memory stand-in for `next/headers` `cookies()`, wired up globally in
 * `tests/setup.ts`. Route handlers read and write the same jar a test sets up.
 */

const jar = new Map<string, string>();

export const cookieJar = {
  set(name: string, value: string) {
    jar.set(name, value);
  },
  get(name: string): string | undefined {
    return jar.get(name);
  },
  has(name: string): boolean {
    return jar.has(name);
  },
  clear() {
    jar.clear();
  },
};

/** Log in as an admin: what the login route leaves behind. */
export function signIn(accessToken = "test-access-token", refreshToken = "test-refresh-token") {
  cookieJar.set("accessToken", accessToken);
  if (refreshToken) cookieJar.set("refreshToken", refreshToken);
}

export async function cookies() {
  return {
    get: (name: string) => (jar.has(name) ? { name, value: jar.get(name)! } : undefined),
    getAll: () => [...jar.entries()].map(([name, value]) => ({ name, value })),
    has: (name: string) => jar.has(name),
    set: (name: string, value: string) => {
      jar.set(name, value);
    },
    delete: (name: string) => {
      jar.delete(name);
    },
  };
}
