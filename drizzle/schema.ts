import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  json,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** OAuth identifier (openId) returned from the configured identity provider. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Visitor events tracking for portfolio interactions
 */
export const visitorEvents = mysqlTable("visitorEvents", {
  id: int("id").autoincrement().primaryKey(),
  visitorId: varchar("visitorId", { length: 64 }).notNull(), // Anonymous visitor ID
  eventType: mysqlEnum("eventType", [
    "page_view",
    "case_study_view",
    "patent_claim_view",
    "section_visit",
    "hk_assistant_query",
    "contact_inquiry",
    "collaboration_request",
    "download_preprint",
  ]).notNull(),
  section: varchar("section", { length: 64 }), // e.g., 'cybersecurity', 'materials', 'community', 'research'
  details: json("details"), // Additional event data
  userAgent: text("userAgent"),
  ipAddress: varchar("ipAddress", { length: 45 }), // IPv4 or IPv6
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VisitorEvent = typeof visitorEvents.$inferSelect;
export type InsertVisitorEvent = typeof visitorEvents.$inferInsert;

/**
 * Inquiry submissions for collaboration and contact
 */
export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  visitorId: varchar("visitorId", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  inquiryType: mysqlEnum("inquiryType", [
    "collaboration",
    "partnership",
    "research",
    "technical",
    "general",
  ]).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "responded", "archived"])
    .default("new")
    .notNull(),
  notificationSent: timestamp("notificationSent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

/**
 * Notification preferences for portfolio owner
 */
export const notificationPreferences = mysqlTable("notificationPreferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Link to users table
  emailOnCaseStudyView: int("emailOnCaseStudyView").default(1).notNull(), // 1 = true, 0 = false
  emailOnPatentView: int("emailOnPatentView").default(1).notNull(),
  emailOnSectionVisit: int("emailOnSectionVisit").default(0).notNull(),
  emailOnInquiry: int("emailOnInquiry").default(1).notNull(),
  emailOnCollaboration: int("emailOnCollaboration").default(1).notNull(),
  dailyDigest: int("dailyDigest").default(1).notNull(),
  weeklyReport: int("weeklyReport").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NotificationPreference =
  typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreference =
  typeof notificationPreferences.$inferInsert;

/**
 * Portfolio milestones and timeline events
 */
export const timelineEvents = mysqlTable("timelineEvents", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", [
    "cybersecurity",
    "materials",
    "community",
    "research",
    "patent",
    "publication",
    "milestone",
  ]).notNull(),
  eventDate: timestamp("eventDate").notNull(),
  year: int("year").notNull(),
  impact: text("impact"), // Description of impact
  metrics: json("metrics"), // Associated metrics
  relatedCaseStudyId: varchar("relatedCaseStudyId", { length: 64 }),
  relatedPatentId: varchar("relatedPatentId", { length: 64 }),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TimelineEvent = typeof timelineEvents.$inferSelect;
export type InsertTimelineEvent = typeof timelineEvents.$inferInsert;

/**
 * User theme preferences - stores customized theme settings per user
 */
export const themePreferences = mysqlTable("themePreferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(), // One theme preference per user
  variant: mysqlEnum("variant", [
    "dark-cyberpunk",
    "light-neon",
    "high-contrast",
    "minimal",
  ])
    .default("dark-cyberpunk")
    .notNull(),
  intensity: int("intensity").default(85).notNull(), // 0-100
  glowIntensity: int("glowIntensity").default(75).notNull(), // 0-100
  animationSpeed: int("animationSpeed").default(100).notNull(), // 50-200 (stored as percentage)
  accentColor: varchar("accentColor", { length: 7 })
    .default("#ff00ff")
    .notNull(), // Hex color
  presetName: varchar("presetName", { length: 255 }), // Optional name for this preset
  isDefault: int("isDefault").default(0).notNull(), // 1 = true, 0 = false
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ThemePreference = typeof themePreferences.$inferSelect;
export type InsertThemePreference = typeof themePreferences.$inferInsert;

/**
 * Saved theme presets - allows users to save multiple theme configurations
 */
export const themePresets = mysqlTable("themePresets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  variant: mysqlEnum("variant", [
    "dark-cyberpunk",
    "light-neon",
    "high-contrast",
    "minimal",
  ]).notNull(),
  intensity: int("intensity").notNull(),
  glowIntensity: int("glowIntensity").notNull(),
  animationSpeed: int("animationSpeed").notNull(),
  accentColor: varchar("accentColor", { length: 7 }).notNull(),
  isPublic: int("isPublic").default(0).notNull(), // 1 = true, 0 = false (for sharing)
  usageCount: int("usageCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ThemePreset = typeof themePresets.$inferSelect;
export type InsertThemePreset = typeof themePresets.$inferInsert;

/**
 * Real-time notifications for portfolio visitors
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  sessionId: varchar("sessionId", { length: 128 }),
  type: mysqlEnum("type", [
    "achievement",
    "milestone",
    "system",
    "engagement",
    "ai_insight",
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  data: json("data"),
  isRead: int("isRead").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Gamification: session-based points and badges
 */
export const userPoints = mysqlTable("userPoints", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 128 }).notNull().unique(),
  userId: int("userId"),
  points: int("points").default(0).notNull(),
  level: int("level").default(1).notNull(),
  badges: json("badges"),
  achievements: json("achievements"),
  weeklyPoints: int("weeklyPoints").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type UserPoints = typeof userPoints.$inferSelect;
export type InsertUserPoints = typeof userPoints.$inferInsert;

/**
 * Search analytics: track what users search for
 */
export const searchEvents = mysqlTable("searchEvents", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 128 }),
  query: varchar("query", { length: 500 }).notNull(),
  resultsCount: int("resultsCount").default(0).notNull(),
  clickedResultId: varchar("clickedResultId", { length: 128 }),
  clickedResultType: varchar("clickedResultType", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type SearchEvent = typeof searchEvents.$inferSelect;

/**
 * AI conversation memory for H.K. Assistant
 */
export const conversationMemory = mysqlTable("conversationMemory", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 128 }).notNull(),
  userId: int("userId"),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  sentiment: varchar("sentiment", { length: 32 }),
  topics: json("topics"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ConversationMemory = typeof conversationMemory.$inferSelect;
