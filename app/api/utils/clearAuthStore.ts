// e.g. in lib/auth.ts or store
import { useAuthStore } from "@/app/store/authStore";

export function redirectToLogin(router: { push: (path: string) => void }) {
  useAuthStore.getState().logout();
  router.push("/login");
}
