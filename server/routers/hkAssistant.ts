import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import * as db from "../db";

const HK_SYSTEM_PROMPT = `You are the optional server-connected H.K. prototype for TRAI and TechBridge, named after Horace King, the master bridge builder. The deployed public portfolio uses a separate bounded static guide and does not call this model.

Your core principles:
1. NEVER GUESS - If you don't know something, say so clearly
2. NEVER ASK FOR CREDENTIALS - Protect user privacy absolutely
3. DETERMINISTIC ROUTING - Guide users to the correct portal/resource
4. STEP-BY-STEP GUIDANCE - Walk through each step clearly
5. HUMAN ESCALATION - Know when to escalate to a Digital Navigator
6. STATUS DISCIPLINE - Never imply that TechBridge hubs, Navigators, sessions, or measured outcomes currently exist; the pilot is designed but not operating
7. AUTHORITY BOUNDARY - Never represent Queen Califia or any model as having autonomous operational authority

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
5. Use supplied context only when it is relevant and never treat model memory as verified evidence

Format your responses with:
- Clear sections using markdown
- Numbered steps for procedures
- Links to resources when available
- Escalation options when needed`;

const AMC_CONTEXT = `
Advanced Material Composite (AMC) Hypothesis Overview:

Tamerian proposes a bio-derived multifunctional composite for self-powered sensing. The architecture combines hemp-derived carbon with specified crystalline phases (quartz, tourmaline, magnetite, and rare-earth-doped particles) in a polymer binder.

Claimed ranges and research targets — not achieved measurements:
- Electrical conductivity: patent range 10²–10⁶ S/m
- Energy harvesting: proposed piezoelectric + thermoelectric + spin-Seebeck coupling
- Quantum sensing: coherence hypothesis >500 ns at 300 K, with a 1–10 μs research target; not confirmed
- Biocompatibility: ISO 10993-5 testing is part of the validation plan; compliance is not established
- Thermal stability: patent target -50°C to +500°C; not independently validated

Patent record:
- U.S. provisional application 63/934,269
- Filed Dec 11 2025
- 25 claims

Research status:
- 2026 preprint; not peer reviewed
- 51 peer-reviewed papers cited for constituent mechanisms
- Integrated performance has not been independently validated
- The prescribed validation program covers constituent characterization, coupled-system testing, manufacturing scale-up, durability, and field validation
`;

export const hkAssistantRouter = router({
  // Query the optional server-connected H.K. prototype through invokeLLM.
  query: publicProcedure
    .input(
      z.object({
        question: z.string().min(1).max(2000),
        conversationHistory: z
          .array(
            z.object({
              role: z.enum(["user", "assistant"]),
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
        let persistentHistory: Array<{
          role: "user" | "assistant";
          content: string;
        }> = [];
        if (input.sessionId) {
          const memoryEntries = await db.getConversationHistory(
            input.sessionId,
            10
          );
          persistentHistory = memoryEntries.reverse().map(m => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          }));
        }
        const combinedHistory =
          persistentHistory.length > 0
            ? persistentHistory
            : input.conversationHistory || [];

        // Build conversation with context
        const messages = [
          {
            role: "system" as const,
            content: `${HK_SYSTEM_PROMPT}\n\n${AMC_CONTEXT}`,
          },
          ...combinedHistory,
          {
            role: "user" as const,
            content: input.question,
          },
        ];

        // Call the configured external model through the provider-agnostic boundary.
        const response = await invokeLLM({
          messages,
        });

        /* The model may return either a plain string or an array of content
           blocks. Normalize here, at the boundary, so every consumer of this
           procedure receives a string. Previously the raw union leaked into
           the client and broke its typing. */
        const raw = response.choices[0]?.message?.content;
        const assistantMessage: string =
          typeof raw === "string"
            ? raw
            : Array.isArray(raw)
              ? raw
                  .map((part: unknown) =>
                    typeof part === "string"
                      ? part
                      : part && typeof part === "object" && "text" in part
                        ? String((part as { text?: unknown }).text ?? "")
                        : ""
                  )
                  .join("")
              : "";
        const finalMessage: string =
          assistantMessage.trim() ||
          "I apologize, but I was unable to process your question.";

        // Save to persistent memory and award points
        if (input.sessionId) {
          await db.saveConversationMessage(
            input.sessionId,
            "user",
            input.question
          );
          await db.saveConversationMessage(
            input.sessionId,
            "assistant",
            finalMessage
          );
          const history = await db.getConversationHistory(input.sessionId, 5);
          if (history.length <= 2) {
            await db.addPoints(input.sessionId, 15, "hk-conversationalist");
            await db.createNotification({
              sessionId: input.sessionId,
              type: "achievement",
              title: "H.K. Conversationalist",
              message:
                "You started a conversation with H.K. Assistant! +15 points",
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
        console.error("[H.K. Assistant] Error:", error);
        return {
          success: false,
          response:
            "I encountered an issue processing your question. Please try again or escalate to a Digital Navigator.",
          error: error instanceof Error ? error.message : "Unknown error",
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
      title: "Advanced Material Composite (AMC) Hypothesis",
      overview:
        "Bio-derived multifunctional composite proposed for self-powered sensing",
      keyProperties: {
        conductivity: "Patent range 10²–10⁶ S/m; not an achieved measurement",
        energyHarvesting:
          "Proposed piezoelectric + thermoelectric + spin-Seebeck coupling",
        quantumSensing:
          "Coherence hypothesis >500 ns at 300 K; 1–10 μs research target; not confirmed",
        biocompatibility:
          "ISO 10993-5 testing planned; compliance is not established",
        thermalStability:
          "Patent target -50°C to +500°C; not independently validated",
      },
      patentClaims: {
        total: 25,
        composition: "1–15",
        manufacturing: "16–18",
        device: "19–25",
      },
      applications: [
        "Energy Harvesting",
        "Quantum Sensing",
        "Biomedical Implants",
        "DNA Storage",
        "Environmental Monitoring",
      ],
      researchStatus: {
        preprint: "2026 preprint; not peer reviewed",
        patents: "U.S. provisional application 63/934,269 filed; 25 claims",
        literature: "51 peer-reviewed papers cited for constituent mechanisms",
        integratedValidation: "Not independently validated",
      },
    };
  }),

  // Get triage guidance for specific topics
  getTriage: publicProcedure
    .input(
      z.object({
        topic: z.enum([
          "digital-access",
          "amc-hypothesis",
          "cybersecurity",
          "material-science",
          "research",
          "community-impact",
        ]),
      })
    )
    .query(({ input }) => {
      const triageGuides: Record<string, Record<string, unknown>> = {
        "digital-access": {
          title: "Digital Access Support",
          steps: [
            "Identify your specific need (email, job search, education, etc.)",
            "Use the bounded public guidance for a safe first step",
            "Contact the project team about the proposed pilot if additional help is needed",
            "Use established local service providers for needs that cannot wait for the pilot",
          ],
          resources: [
            "TechBridge public pilot design",
            "Deterministic H.K. browser triage",
            "Public project contact",
          ],
          escalation:
            "TechBridge is not yet operating hubs; contact an established local provider or the project team",
        },
        "amc-hypothesis": {
          title: "AMC Hypothesis Information",
          steps: [
            "Review the preprint publication",
            "Explore the 25 patent claims",
            "Understand the 7-step manufacturing process",
            "Learn about applications",
          ],
          resources: [
            "AMC Preprint",
            "Patent Claims Explorer",
            "Manufacturing Process Visualization",
            "Research Lab Section",
          ],
          escalation: "Contact research team for technical questions",
        },
        cybersecurity: {
          title: "Cybersecurity Support",
          steps: [
            "Identify your security concern",
            "Preserve evidence and avoid disclosing credentials",
            "Review the public command demo and validation plan without treating it as an operational security service",
            "Use a qualified incident-response provider for an active incident",
          ],
          resources: [
            "Queen Califia public command demo",
            "Validation Plans section",
            "NIST Cybersecurity Framework",
          ],
          escalation:
            "For an active incident, use a qualified security professional or the relevant service provider",
        },
        "material-science": {
          title: "Material Science Resources",
          steps: [
            "Explore the AMC composite architecture",
            "Review patent claims (1–15 for composition)",
            "Understand manufacturing methods (16–18)",
            "Learn device applications (19–25)",
          ],
          resources: [
            "Material Science Section",
            "Patent Explorer",
            "Manufacturing Visualization",
            "Research Publications",
          ],
          escalation: "Contact material science team",
        },
        research: {
          title: "Research & Academic Support",
          steps: [
            "Review the 2026 preprint with its not-peer-reviewed status",
            "Explore the proposed experimental methodology",
            "Separate application ranges from achieved measurements",
            "Use the 51-paper citation record for constituent mechanisms",
          ],
          resources: [
            "Research Lab Section",
            "Preprint and evidence boundary",
            "Proposed validation methods",
            "Patent Applications",
          ],
          escalation: "Contact research team for collaboration",
        },
        "community-impact": {
          title: "Community Pilot Design",
          steps: [
            "Learn about the proposed TechBridge model",
            "Review the planned hub and Navigator targets",
            "Understand the TechMinutes measurement design",
            "Contact the project team about pilot participation",
          ],
          resources: [
            "Community Impact Section",
            "Proposed hub regions",
            "TechMinutes measurement plan",
            "Public project contact",
          ],
          escalation:
            "Contact the project team; no operating hub or Navigator network is represented",
        },
      };

      return triageGuides[input.topic] || triageGuides["digital-access"];
    }),
});

export type HKAssistantRouter = typeof hkAssistantRouter;
