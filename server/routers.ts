import { getSessionCookieOptions } from "./_core/cookies";
import { COOKIE_NAME } from "@shared/const";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { advancedFeaturesRouter } from "./routers/advancedFeatures";
import { analyticsRouter } from "./routers/analytics";
import { hkAssistantRouter } from "./routers/hkAssistant";
import { portfolioRouter } from "./routers/portfolio";
import { notificationsRouter, gamificationRouter, searchRouter, aiInsightsRouter, systemRouter2 } from "./routers/features";

export const appRouter = router({
  system: systemRouter,
  advanced: advancedFeaturesRouter,
  analytics: analyticsRouter,
  hk: hkAssistantRouter,
  portfolio: portfolioRouter,
  notifications: notificationsRouter,
  gamification: gamificationRouter,
  search: searchRouter,
  aiInsights: aiInsightsRouter,
  systemInfo: systemRouter2,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  theme: router({
    getPreferences: protectedProcedure.query(async ({ ctx }) => {
      return db.getThemePreferences(ctx.user.id);
    }),
    savePreferences: protectedProcedure
      .input(
        z.object({
          variant: z.enum(['dark-cyberpunk', 'light-neon', 'high-contrast', 'minimal']),
          intensity: z.number().min(0).max(100),
          glowIntensity: z.number().min(0).max(100),
          animationSpeed: z.number().min(50).max(200),
          accentColor: z.string(),
          presetName: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.saveThemePreferences(ctx.user.id, input);
        return { success: true };
      }),
    getPresets: protectedProcedure.query(async ({ ctx }) => {
      return db.getThemePresets(ctx.user.id);
    }),
    createPreset: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          variant: z.enum(['dark-cyberpunk', 'light-neon', 'high-contrast', 'minimal']),
          intensity: z.number().min(0).max(100),
          glowIntensity: z.number().min(0).max(100),
          animationSpeed: z.number().min(50).max(200),
          accentColor: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return db.createThemePreset({ userId: ctx.user.id, ...input, isPublic: 0 });
      }),
    deletePreset: protectedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
      await db.deleteThemePreset(input);
      return { success: true };
    }),
    getPublicPresets: publicProcedure.query(async () => {
      return db.getPublicThemePresets();
    }),
  }),
});

export type AppRouter = typeof appRouter;
