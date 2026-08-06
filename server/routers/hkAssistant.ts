import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { invokeLLM } from '../_core/llm';
import * as db from '../db';

const HK_SYSTEM_PROMPT = `You are H.K., the TechBridge AI Triage Assistant named after Horace King, the master bridge builder.

Your core principles:
1. NEVER GUESS - If you don't know something, say so clearly
2. NEVER ASK FOR CREDENTIALS - Protect user privacy absolutely
3. DETERMINISTIC ROUTING - Guide users to the correct portal/resource
4. STEP-BY-STEP GUIDANCE - Walk through each step clearly
5. HUMAN ESCALATION - Know when to escalate to a Digital Navigator

Your expertise includes:
- Digital access and technology support
- AMC (Advanced Material Composite) hypothesis and material science
- Cybersecurity concepts and best practices
- Community technology initiatives
- Research methodology and academic resources

When a user asks a question:
1. Understand their actual need (not just their words)
2. Provide clear, step-by-step guidance
3. Use simple language, avoid jargon
4. Offer next steps and escalation paths
5. Remember context from the conversation

Format your responses with:
- Clear sections using markdown
- Numbered steps for procedures
- Links to resources when available
- Escalation options when needed`;

const AMC_CONTEXT = `
Advanced Material Composite (AMC) Hypothesis Overview:

The AMC is a multi-functional composite material developed from hemp-derived carbon with integrated crystalline phases (quartz, tourmaline, magnetite, rare-earth elements).

Key Properties:
- Electrical Conductivity: 10²–10⁶ S/m
- Multi-Modal Energy Harvesting: Piezoelectric + Thermoelectric + Spin-Seebeck
- Quantum Sensing: Room-temperature operation with T₂ coherence >5 μs
- Biocompatibility: ISO 10993-5 compliant
- Thermal Stability: -50°C to +500°C

Patent Claims (25 total):
- Composition & Material Claims (1–15): Material properties, crystalline phases, electrical/thermal/optical properties
- Manufacturing Method Claims (16–18): Fiber preparation, pyrolysis, composite assembly
- Device & System Claims (19–25): Energy harvesting devices, quantum sensors, biomedical implants, DNA storage, environmental sensors, wearable generators, integrated systems

Applications:
1. Energy Harvesting: Self-powered devices, wearable generators
2. Quantum Sensing: Magnetic field sensors, precision measurements
3. Biomedical: Implantable devices, biocompatible substrates
4. Data Storage: DNA storage on hemp-derived substrates
5. Environmental Monitoring: Multi-parameter sensors

Research Status:
- Preprint published with comprehensive validation
- 2 USPTO patent applications filed (63/934,269)
- Experimental validation: 150+ experiments conducted
- Validation rate: 92% of core hypothesis claims
`;

export const hkAssistantRouter = router({
  // Query H.K. Assistant with Claude API
  query: publicProcedure
    .input(
      z.object({
        question: z.string().min(1).max(2000),
        conversationHistory: z
          .array(
            z.object({
              role: z.enum(['user', 'assistant']),
              content: z.string(),
            })
          )
          .optional(),
        sessionId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Load persistent memory if sessionId provided
        let persistentHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];
        if (input.sessionId) {
          const memoryEntries = await db.getConversationHistory(input.sessionId, 10);
          persistentHistory = memoryEntries.reverse().map(m => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          }));
        }
        const combinedHistory = persistentHistory.length > 0
          ? persistentHistory
          : (input.conversationHistory || []);

        // Build conversation with context
        const messages = [
          {
            role: 'system' as const,
            content: `${HK_SYSTEM_PROMPT}\n\n${AMC_CONTEXT}`,
          },
          ...combinedHistory,
          {
            role: 'user' as const,
            content: input.question,
          },
        ];

        // Call Claude API via invokeLLM
        const response = await invokeLLM({
          messages,
        });

        /* The model may return either a plain string or an array of content
           blocks. Normalize here, at the boundary, so every consumer of this
           procedure receives a string. Previously the raw union leaked into
           the client and broke its typing. */
        const raw = response.choices[0]?.message?.content;
        const assistantMessage: string =
          typeof raw === 'string'
            ? raw
            : Array.isArray(raw)
              ? raw
                  .map((part: unknown) =>
                    typeof part === 'string'
                      ? part
                      : (part && typeof part === 'object' && 'text' in part
                          ? String((part as { text?: unknown }).text ?? '')
                          : '')
                  )
                  .join('')
              : '';
        const finalMessage: string =
          assistantMessage.trim() || 'I apologize, but I was unable to process your question.';

        // Save to persistent memory and award points
        if (input.sessionId) {
          await db.saveConversationMessage(input.sessionId, 'user', input.question);
          await db.saveConversationMessage(input.sessionId, 'assistant', finalMessage);
          const history = await db.getConversationHistory(input.sessionId, 5);
          if (history.length <= 2) {
            await db.addPoints(input.sessionId, 15, 'hk-conversationalist');
            await db.createNotification({
              sessionId: input.sessionId,
              type: 'achievement',
              title: 'H.K. Conversationalist',
              message: 'You started a conversation with H.K. Assistant! +15 points',
            });
          } else {
            await db.addPoints(input.sessionId, 2);
          }
        }

        return {
          success: true,
          response: finalMessage,
          conversationId: `hk-${Date.now()}`,
          sessionId: input.sessionId,
        };
      } catch (error) {
        console.error('[H.K. Assistant] Error:', error);
        return {
          success: false,
          response:
            'I encountered an issue processing your question. Please try again or escalate to a Digital Navigator.',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }),

  // Get conversation history for a session
  getHistory: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const history = await db.getConversationHistory(input.sessionId, 20);
      return {
        messages: history.reverse().map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.createdAt,
        })),
      };
    }),

  // Get AMC hypothesis context
  getAMCContext: publicProcedure.query(() => {
    return {
      title: 'Advanced Material Composite (AMC) Hypothesis',
      overview:
        'Multi-functional composite from hemp-derived carbon with integrated crystalline phases',
      keyProperties: {
        conductivity: '10²–10⁶ S/m',
        energyHarvesting: 'Piezoelectric + Thermoelectric + Spin-Seebeck',
        quantumSensing: 'Room-temperature, T₂ > 5 μs',
        biocompatibility: 'ISO 10993-5 compliant',
        thermalStability: '-50°C to +500°C',
      },
      patentClaims: {
        total: 25,
        composition: '1–15',
        manufacturing: '16–18',
        device: '19–25',
      },
      applications: [
        'Energy Harvesting',
        'Quantum Sensing',
        'Biomedical Implants',
        'DNA Storage',
        'Environmental Monitoring',
      ],
      researchStatus: {
        preprint: 'Published',
        patents: '2 USPTO applications filed',
        experiments: '150+ conducted',
        validationRate: '92%',
      },
    };
  }),

  // Get triage guidance for specific topics
  getTriage: publicProcedure
    .input(
      z.object({
        topic: z.enum([
          'digital-access',
          'amc-hypothesis',
          'cybersecurity',
          'material-science',
          'research',
          'community-impact',
        ]),
      })
    )
    .query(({ input }) => {
      const triageGuides: Record<string, Record<string, unknown>> = {
        'digital-access': {
          title: 'Digital Access Support',
          steps: [
            'Identify your specific need (email, job search, education, etc.)',
            'Visit your nearest TechBridge hub',
            'Meet with a Digital Navigator',
            'Get step-by-step guidance',
          ],
          resources: [
            'TechBridge Hub Locator',
            'H.K. AI 24/7 Triage',
            'Digital Navigator Network',
          ],
          escalation: 'Contact local hub for complex issues',
        },
        'amc-hypothesis': {
          title: 'AMC Hypothesis Information',
          steps: [
            'Review the preprint publication',
            'Explore the 25 patent claims',
            'Understand the 7-step manufacturing process',
            'Learn about applications',
          ],
          resources: [
            'AMC Preprint',
            'Patent Claims Explorer',
            'Manufacturing Process Visualization',
            'Research Lab Section',
          ],
          escalation: 'Contact research team for technical questions',
        },
        cybersecurity: {
          title: 'Cybersecurity Support',
          steps: [
            'Identify your security concern',
            'Review relevant case studies',
            'Understand best practices',
            'Implement recommendations',
          ],
          resources: [
            'Case Studies Section',
            'Security Resources',
            'Threat Intelligence',
            'Compliance Guides',
          ],
          escalation: 'Escalate to security team for incidents',
        },
        'material-science': {
          title: 'Material Science Resources',
          steps: [
            'Explore the AMC composite architecture',
            'Review patent claims (1–15 for composition)',
            'Understand manufacturing methods (16–18)',
            'Learn device applications (19–25)',
          ],
          resources: [
            'Material Science Section',
            'Patent Explorer',
            'Manufacturing Visualization',
            'Research Publications',
          ],
          escalation: 'Contact material science team',
        },
        research: {
          title: 'Research & Academic Support',
          steps: [
            'Review published preprint',
            'Explore experimental methodology',
            'Understand validation results',
            'Access research data',
          ],
          resources: [
            'Research Lab Section',
            'Preprint Publication',
            'Experimental Data',
            'Patent Applications',
          ],
          escalation: 'Contact research team for collaboration',
        },
        'community-impact': {
          title: 'Community Impact Initiatives',
          steps: [
            'Learn about TechBridge model',
            'Explore hub network',
            'Understand impact metrics',
            'Get involved',
          ],
          resources: [
            'Community Impact Section',
            'Hub Network Map',
            'TechMinutes Dashboard',
            'Impact Reports',
          ],
          escalation: 'Contact community team for participation',
        },
      };

      return triageGuides[input.topic] || triageGuides['digital-access'];
    }),
});

export type HKAssistantRouter = typeof hkAssistantRouter;
