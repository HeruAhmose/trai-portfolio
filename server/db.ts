import { eq, desc } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/mysql2';
import {
  InsertUser,
  users,
  visitorEvents,
  inquiries,
  timelineEvents,
  notificationPreferences,
  notifications,
  InsertNotification,
  userPoints,
  InsertUserPoints,
  searchEvents,
  conversationMemory,
} from '../drizzle/schema';
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn('[Database] Failed to connect:', error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error('User openId is required for upsert');
  }

  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot upsert user: database not available');
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ['name', 'email', 'loginMethod'] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error('[Database] Failed to upsert user:', error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot get user: database not available');
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Visitor Events
export async function trackVisitorEvent(event: typeof visitorEvents.$inferInsert) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot track event: database not available');
    return;
  }

  try {
    await db.insert(visitorEvents).values(event);
  } catch (error) {
    console.error('[Database] Failed to track event:', error);
  }
}

export async function getRecentEvents(limit = 50) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(visitorEvents)
      .orderBy(desc(visitorEvents.createdAt))
      .limit(limit);
  } catch (error) {
    console.error('[Database] Failed to get events:', error);
    return [];
  }
}

// Inquiries
export async function createInquiry(inquiry: typeof inquiries.$inferInsert) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot create inquiry: database not available');
    return null;
  }

  try {
    const result = await db.insert(inquiries).values(inquiry);
    return result;
  } catch (error) {
    console.error('[Database] Failed to create inquiry:', error);
    throw error;
  }
}

export async function getInquiries(limit = 50) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(inquiries)
      .orderBy(desc(inquiries.createdAt))
      .limit(limit);
  } catch (error) {
    console.error('[Database] Failed to get inquiries:', error);
    return [];
  }
}

export async function updateInquiryStatus(
  inquiryId: number,
  status: 'new' | 'read' | 'responded' | 'archived'
) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot update inquiry: database not available');
    return;
  }

  try {
    await db
      .update(inquiries)
      .set({ status, updatedAt: new Date() })
      .where(eq(inquiries.id, inquiryId));
  } catch (error) {
    console.error('[Database] Failed to update inquiry:', error);
  }
}

// Timeline Events
export async function getTimelineEvents() {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(timelineEvents)
      .orderBy(desc(timelineEvents.eventDate));
  } catch (error) {
    console.error('[Database] Failed to get timeline events:', error);
    return [];
  }
}

export async function getTimelineEventsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(timelineEvents)
      .where(eq(timelineEvents.category, category as any))
      .orderBy(desc(timelineEvents.eventDate));
  } catch (error) {
    console.error('[Database] Failed to get timeline events:', error);
    return [];
  }
}

// Notification Preferences
export async function getNotificationPreferences(userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('[Database] Failed to get notification preferences:', error);
    return null;
  }
}

export async function updateNotificationPreferences(
  userId: number,
  prefs: Partial<typeof notificationPreferences.$inferInsert>
) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot update preferences: database not available');
    return;
  }

  try {
    await db
      .update(notificationPreferences)
      .set({ ...prefs, updatedAt: new Date() })
      .where(eq(notificationPreferences.userId, userId));
  } catch (error) {
    console.error('[Database] Failed to update preferences:', error);
  }
}


// Theme Preferences
import { themePreferences, themePresets } from '../drizzle/schema';

export async function getThemePreferences(userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(themePreferences)
      .where(eq(themePreferences.userId, userId))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('[Database] Failed to get theme preferences:', error);
    return null;
  }
}

export async function saveThemePreferences(
  userId: number,
  prefs: Omit<typeof themePreferences.$inferInsert, 'userId' | 'createdAt' | 'updatedAt'>
) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot save theme preferences: database not available');
    return;
  }

  try {
    const existing = await getThemePreferences(userId);

    if (existing) {
      await db
        .update(themePreferences)
        .set({ ...prefs, updatedAt: new Date() })
        .where(eq(themePreferences.userId, userId));
    } else {
      await db.insert(themePreferences).values({
        userId,
        ...prefs,
      });
    }
  } catch (error) {
    console.error('[Database] Failed to save theme preferences:', error);
  }
}

export async function deleteThemePreferences(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot delete theme preferences: database not available');
    return;
  }

  try {
    await db.delete(themePreferences).where(eq(themePreferences.userId, userId));
  } catch (error) {
    console.error('[Database] Failed to delete theme preferences:', error);
  }
}

// Theme Presets
export async function getThemePresets(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(themePresets)
      .where(eq(themePresets.userId, userId))
      .orderBy(desc(themePresets.createdAt));
  } catch (error) {
    console.error('[Database] Failed to get theme presets:', error);
    return [];
  }
}

export async function getThemePresetById(presetId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(themePresets)
      .where(eq(themePresets.id, presetId))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('[Database] Failed to get theme preset:', error);
    return null;
  }
}

export async function createThemePreset(preset: typeof themePresets.$inferInsert) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot create theme preset: database not available');
    return null;
  }

  try {
    const result = await db.insert(themePresets).values(preset);
    return result;
  } catch (error) {
    console.error('[Database] Failed to create theme preset:', error);
    throw error;
  }
}

export async function updateThemePreset(
  presetId: number,
  data: Partial<typeof themePresets.$inferInsert>
) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot update theme preset: database not available');
    return;
  }

  try {
    await db
      .update(themePresets)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(themePresets.id, presetId));
  } catch (error) {
    console.error('[Database] Failed to update theme preset:', error);
  }
}

export async function deleteThemePreset(presetId: number) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot delete theme preset: database not available');
    return;
  }

  try {
    await db.delete(themePresets).where(eq(themePresets.id, presetId));
  } catch (error) {
    console.error('[Database] Failed to delete theme preset:', error);
  }
}

export async function incrementPresetUsage(presetId: number) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot increment preset usage: database not available');
    return;
  }

  try {
    const preset = await getThemePresetById(presetId);
    if (preset) {
      await db
        .update(themePresets)
        .set({
          usageCount: (preset.usageCount || 0) + 1,
        })
        .where(eq(themePresets.id, presetId));
    }
  } catch (error) {
    console.error('[Database] Failed to increment preset usage:', error);
  }
}

export async function getPublicThemePresets(limit = 20) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(themePresets)
      .where(eq(themePresets.isPublic, 1))
      .orderBy(desc(themePresets.usageCount))
      .limit(limit);
  } catch (error) {
    console.error('[Database] Failed to get public theme presets:', error);
    return [];
  }
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function createNotification(notif: InsertNotification) {
  const db = await getDb();
  if (!db) return null;
  try {
    await db.insert(notifications).values(notif);
    const result = await db.select().from(notifications)
      .where(eq(notifications.sessionId, notif.sessionId ?? ''))
      .orderBy(desc(notifications.createdAt)).limit(1);
    return result[0] ?? null;
  } catch (error) {
    console.error('[Database] Failed to create notification:', error);
    return null;
  }
}

export async function getNotifications(sessionId: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(notifications)
      .where(eq(notifications.sessionId, sessionId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  } catch (error) {
    console.error('[Database] Failed to get notifications:', error);
    return [];
  }
}

export async function markNotificationRead(id: number) {
  const db = await getDb();
  if (!db) return;
  try {
    await db.update(notifications).set({ isRead: 1 }).where(eq(notifications.id, id));
  } catch (error) {
    console.error('[Database] Failed to mark notification read:', error);
  }
}

export async function markAllNotificationsRead(sessionId: string) {
  const db = await getDb();
  if (!db) return;
  try {
    await db.update(notifications).set({ isRead: 1 }).where(eq(notifications.sessionId, sessionId));
  } catch (error) {
    console.error('[Database] Failed to mark all notifications read:', error);
  }
}

// ─── Gamification ─────────────────────────────────────────────────────────────

export async function getOrCreateUserPoints(sessionId: string) {
  const db = await getDb();
  if (!db) return { id: 0, sessionId, points: 0, level: 1, badges: [], achievements: [], weeklyPoints: 0, userId: null, createdAt: new Date(), updatedAt: new Date() };
  try {
    const existing = await db.select().from(userPoints)
      .where(eq(userPoints.sessionId, sessionId)).limit(1);
    if (existing[0]) return existing[0];
    const newEntry: InsertUserPoints = { sessionId, points: 0, level: 1, badges: [], achievements: [], weeklyPoints: 0 };
    await db.insert(userPoints).values(newEntry);
    const created = await db.select().from(userPoints)
      .where(eq(userPoints.sessionId, sessionId)).limit(1);
    return created[0] ?? { id: 0, sessionId, points: 0, level: 1, badges: [], achievements: [], weeklyPoints: 0, userId: null, createdAt: new Date(), updatedAt: new Date() };
  } catch (error) {
    console.error('[Database] Failed to get/create user points:', error);
    return { id: 0, sessionId, points: 0, level: 1, badges: [], achievements: [], weeklyPoints: 0, userId: null, createdAt: new Date(), updatedAt: new Date() };
  }
}

export async function addPoints(sessionId: string, pointsToAdd: number, badge?: string) {
  const db = await getDb();
  if (!db) return null;
  try {
    const current = await getOrCreateUserPoints(sessionId);
    const newPoints = (current.points ?? 0) + pointsToAdd;
    const newLevel = Math.floor(newPoints / 100) + 1;
    const badges = Array.isArray(current.badges) ? [...(current.badges as string[])] : [];
    if (badge && !badges.includes(badge)) badges.push(badge);
    await db.update(userPoints).set({
      points: newPoints,
      level: newLevel,
      badges,
      weeklyPoints: (current.weeklyPoints ?? 0) + pointsToAdd,
    }).where(eq(userPoints.sessionId, sessionId));
    return { points: newPoints, level: newLevel, badges, pointsAdded: pointsToAdd };
  } catch (error) {
    console.error('[Database] Failed to add points:', error);
    return null;
  }
}

export async function getLeaderboard(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(userPoints)
      .orderBy(desc(userPoints.points))
      .limit(limit);
  } catch (error) {
    console.error('[Database] Failed to get leaderboard:', error);
    return [];
  }
}

// ─── Search Analytics ─────────────────────────────────────────────────────────

export async function trackSearch(query: string, resultsCount: number, sessionId?: string) {
  const db = await getDb();
  if (!db) return;
  try {
    await db.insert(searchEvents).values({ query, resultsCount, sessionId });
  } catch (error) {
    console.error('[Database] Failed to track search:', error);
  }
}

export async function getTopSearches(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(searchEvents)
      .orderBy(desc(searchEvents.createdAt))
      .limit(limit);
  } catch (error) {
    console.error('[Database] Failed to get top searches:', error);
    return [];
  }
}

// ─── Conversation Memory ──────────────────────────────────────────────────────

export async function saveConversationMessage(sessionId: string, role: 'user' | 'assistant', content: string, sentiment?: string) {
  const db = await getDb();
  if (!db) return;
  try {
    await db.insert(conversationMemory).values({ sessionId, role, content, sentiment });
  } catch (error) {
    console.error('[Database] Failed to save conversation message:', error);
  }
}

export async function getConversationHistory(sessionId: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(conversationMemory)
      .where(eq(conversationMemory.sessionId, sessionId))
      .orderBy(desc(conversationMemory.createdAt))
      .limit(limit);
  } catch (error) {
    console.error('[Database] Failed to get conversation history:', error);
    return [];
  }
}
