import { eq, desc, and, ne } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, bookings, contactMessages, blogPosts, clientDocuments, newsletterSubscribers } from "../drizzle/schema";
import type { InsertBooking, InsertContactMessage, InsertBlogPost, InsertClientDocument, InsertNewsletterSubscriber } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
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
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const normalized = email.trim().toLowerCase();
  const result = await db.select().from(users).where(eq(users.email, normalized)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function ensureLocalAdmin(params: {
  email: string;
  password: string;
  name?: string;
}): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Auth] Cannot seed admin: database not available");
    return;
  }

  const { hashPassword } = await import("./password");
  const email = params.email.trim().toLowerCase();
  const openId = `local:${email}`;
  const name = params.name?.trim() || "Administrador";
  const existing = await getUserByEmail(email);
  const forceReset = process.env.ADMIN_RESET_PASSWORD === "true";

  if (existing) {
    const updates: Record<string, unknown> = {
      role: "admin",
      loginMethod: existing.loginMethod || "password",
      name: existing.name || name,
      openId: existing.openId.startsWith("local:") ? existing.openId : openId,
    };

    // Only set/reset password when missing or explicitly forced (prod-safe)
    if (!existing.passwordHash || forceReset) {
      updates.passwordHash = await hashPassword(params.password);
      console.log(
        forceReset
          ? `[Auth] Admin password force-reset for ${email}`
          : `[Auth] Admin password set (was empty) for ${email}`
      );
    } else {
      console.log(`[Auth] Admin already exists: ${email} (password unchanged)`);
    }

    await db.update(users).set(updates).where(eq(users.id, existing.id));
    return;
  }

  const passwordHash = await hashPassword(params.password);
  await db.insert(users).values({
    openId,
    email,
    name,
    passwordHash,
    role: "admin",
    loginMethod: "password",
    lastSignedIn: new Date(),
  });
  console.log(`[Auth] Admin user created: ${email}`);
}

// ---- Bookings ----
export async function createBooking(data: InsertBooking) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(bookings).values(data);
  const rows = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.email, data.email),
        eq(bookings.date, data.date),
        eq(bookings.time, data.time)
      )
    )
    .orderBy(desc(bookings.id))
    .limit(1);
  return rows[0]?.id ?? 0;
}

export async function getBookingByStripeSessionId(sessionId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(bookings)
    .where(eq(bookings.stripeSessionId, sessionId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateBookingPayment(
  id: number,
  data: {
    paymentStatus?: "unpaid" | "paid" | "refunded" | "failed";
    status?: "pending" | "confirmed" | "cancelled";
    stripeSessionId?: string | null;
    stripePaymentIntentId?: string | null;
    amountCents?: number | null;
    currency?: string | null;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bookings).set(data).where(eq(bookings.id, id));
}


export async function getBookings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).orderBy(desc(bookings.createdAt));
}

export async function getBookingById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateBookingStatus(id: number, status: "pending" | "confirmed" | "cancelled") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bookings).set({ status }).where(eq(bookings.id, id));
}

export async function getBookingsByDate(date: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings)
    .where(and(eq(bookings.date, date), ne(bookings.status, "cancelled")));
}

// ---- Reminder helpers ----
export async function getConfirmedBookingsForReminder(targetDate: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings)
    .where(and(
      eq(bookings.date, targetDate),
      eq(bookings.status, "confirmed"),
      eq(bookings.reminderSent, false)
    ));
}

export async function markReminderSent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bookings).set({ reminderSent: true }).where(eq(bookings.id, id));
}

// ---- Contact Messages ----
export async function createContactMessage(data: InsertContactMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(contactMessages).values(data);
}

export async function getContactMessages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

// ---- Blog Posts ----
export async function createBlogPost(data: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(blogPosts).values(data);
}

export async function getPublishedPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt));
}

export async function getRecentPublishedPosts(sinceDaysAgo: number = 7) {
  const db = await getDb();
  if (!db) return [];
  const since = new Date(Date.now() - sinceDaysAgo * 24 * 60 * 60 * 1000);
  const { gte } = await import("drizzle-orm");
  return db.select().from(blogPosts)
    .where(and(eq(blogPosts.published, true), gte(blogPosts.createdAt, since)))
    .orderBy(desc(blogPosts.createdAt));
}

export async function getAllPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}

export async function getPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  let normalized = slug.trim();
  try {
    normalized = decodeURIComponent(normalized);
  } catch {
    /* keep trimmed */
  }
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, normalized)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateBlogPost(id: number, data: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

// ---- Client Documents ----
export async function createClientDocument(data: InsertClientDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(clientDocuments).values(data);
}

export async function getClientDocuments() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clientDocuments).orderBy(desc(clientDocuments.createdAt));
}

// ---- Newsletter Subscribers ----
export async function subscribeNewsletter(data: InsertNewsletterSubscriber) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Use INSERT IGNORE to handle duplicate emails gracefully
  await db.insert(newsletterSubscribers).values(data).onDuplicateKeyUpdate({ set: { active: true } });
}

export async function getNewsletterSubscribers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.active, true)).orderBy(desc(newsletterSubscribers.createdAt));
}

export async function unsubscribeNewsletter(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(newsletterSubscribers).set({ active: false }).where(eq(newsletterSubscribers.email, email));
}
