import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { visitorEvents } from '../../drizzle/schema';
import {
  trackVisitorEvent,
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  getTimelineEvents,
  getTimelineEventsByCategory,
} from '../db';

export const portfolioRouter = router({
  // Track visitor events
  trackEvent: publicProcedure
    .input(
      z.object({
        visitorId: z.string(),
        eventType: z.enum([
          'page_view',
          'case_study_view',
          'patent_claim_view',
          'section_visit',
          'hk_assistant_query',
          'contact_inquiry',
          'collaboration_request',
          'download_preprint',
        ] as const),
        section: z.string().optional(),
        details: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const eventData: typeof visitorEvents.$inferInsert = {
          visitorId: input.visitorId,
          eventType: input.eventType,
          section: input.section || undefined,
          details: input.details || undefined,
          userAgent: 'web-client',
          ipAddress: '0.0.0.0',
        };
        await trackVisitorEvent(eventData);

        return { success: true };
      } catch (error) {
        console.error('[Portfolio] Failed to track event:', error);
        return { success: false, error: 'Failed to track event' };
      }
    }),

  // Submit inquiry/collaboration request
  submitInquiry: publicProcedure
    .input(
      z.object({
        visitorId: z.string(),
        name: z.string().min(1).max(255),
        email: z.string().email(),
        inquiryType: z.enum(['collaboration', 'partnership', 'research', 'technical', 'general'] as const),
        subject: z.string().min(1).max(255),
        message: z.string().min(10).max(5000),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await createInquiry({
          visitorId: input.visitorId,
          name: input.name,
          email: input.email,
          inquiryType: input.inquiryType,
          subject: input.subject,
          message: input.message,
          status: 'new',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Track the inquiry as an event
        const inquiryEventData: typeof visitorEvents.$inferInsert = {
          visitorId: input.visitorId,
          eventType: 'contact_inquiry',
          section: input.inquiryType,
          details: { email: input.email, subject: input.subject },
          userAgent: 'web-client',
          ipAddress: '0.0.0.0',
        };
        await trackVisitorEvent(inquiryEventData);

        return {
          success: true,
          message: 'Thank you for your inquiry. We will respond shortly.',
        };
      } catch (error) {
        console.error('[Portfolio] Failed to submit inquiry:', error);
        return { success: false, error: 'Failed to submit inquiry' };
      }
    }),

  // Get timeline events
  getTimeline: publicProcedure
    .input(
      z.object({
        category: z.enum([
          'cybersecurity',
          'materials',
          'community',
          'research',
          'patent',
          'publication',
          'milestone',
        ] as const).optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const events = input.category
          ? await getTimelineEventsByCategory(input.category)
          : await getTimelineEvents();

        return {
          success: true,
          events: events || [],
          count: events?.length || 0,
        };
      } catch (error) {
        console.error('[Portfolio] Failed to get timeline:', error);
        return { success: false, events: [], count: 0, error: 'Failed to get timeline' };
      }
    }),

  // Get inquiries (admin only)
  getInquiries: publicProcedure.query(async () => {
    try {
      const inquiries = await getInquiries(100);
      return {
        success: true,
        inquiries: inquiries || [],
        count: inquiries?.length || 0,
      };
    } catch (error) {
      console.error('[Portfolio] Failed to get inquiries:', error);
      return { success: false, inquiries: [], count: 0, error: 'Failed to get inquiries' };
    }
  }),

  // Update inquiry status (admin only)
  updateInquiryStatus: publicProcedure
    .input(
      z.object({
        inquiryId: z.number(),
        status: z.enum(['new', 'read', 'responded', 'archived'] as const),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await updateInquiryStatus(input.inquiryId, input.status);
        return { success: true };
      } catch (error) {
        console.error('[Portfolio] Failed to update inquiry status:', error);
        return { success: false, error: 'Failed to update inquiry status' };
      }
    }),
});

export type PortfolioRouter = typeof portfolioRouter;
