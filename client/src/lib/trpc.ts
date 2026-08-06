import { createTRPCReact } from "@trpc/react-query";

/**
 * Temporary client proxy for the static GitHub Pages deployment.
 *
 * Replace this shim with createTRPCReact<AppRouter>() after the separately
 * hosted API exports its AppRouter type from a shared package.
 */
export const trpc = createTRPCReact<any>() as any;