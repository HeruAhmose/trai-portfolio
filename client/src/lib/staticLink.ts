import type { TRPCLink } from "@trpc/client";
import { observable } from "@trpc/server/observable";
import type { AppRouter } from "../../../server/routers";

/**
 * GitHub Pages has no application server behind the SPA. A non-root Vite base
 * identifies that static deployment without introducing another environment
 * flag or weakening the normal server build.
 */
export const STATIC_MODE =
  typeof import.meta.env.BASE_URL === "string" &&
  import.meta.env.BASE_URL !== "/";

function staticFixture(path: string, input: unknown): unknown {
  const payload = (input ?? {}) as Record<string, unknown>;

  switch (path) {
    case "auth.me":
      return null;
    case "auth.logout":
      return { success: true };

    case "gamification.getStatus":
      return {
        points: 0,
        level: 1,
        badges: [],
        progressToNextLevel: 0,
        nextLevelPoints: 100,
        availableAchievements: [],
        achievements: [],
      };

    case "hk.getHistory":
      return { messages: [] };

    case "hk.query": {
      const question =
        typeof payload.question === "string" ? payload.question.trim() : "";
      return {
        response: question
          ? "H.K. is running as a bounded static guide with no external model. Explore the verified TRAI pages for the seven-organ architecture, research record, and organ status."
          : "H.K. is running as a bounded static guide with no external model.",
      };
    }

    case "portfolio.logEvent":
      return { success: true };

    default:
      // Unknown server-only procedures fail closed as an empty static result
      // rather than leaking a request to /api/trpc on GitHub Pages.
      return null;
  }
}

export const staticLink: TRPCLink<AppRouter> = () => {
  return ({ op }) =>
    observable(observer => {
      const timer = window.setTimeout(() => {
        try {
          observer.next({
            result: { type: "data", data: staticFixture(op.path, op.input) },
          });
          observer.complete();
        } catch (error) {
          observer.error(error as never);
        }
      }, 25);

      return () => window.clearTimeout(timer);
    });
};
