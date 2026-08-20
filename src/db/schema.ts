import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  displayName: text('display_name').notNull(),
  profileSlug: text('profile_slug').notNull().unique(),
  isPublic: boolean('is_public').notNull().default(false),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const userProgress = pgTable(
  'user_progress',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    collectibleId: text('collectible_id').notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.collectibleId] }),
    index('user_progress_user_idx').on(table.userId),
  ],
)

export const authRateLimits = pgTable(
  'auth_rate_limits',
  {
    key: text('key').primaryKey(),
    attempts: integer('attempts').notNull().default(0),
    windowStartedAt: timestamp('window_started_at', { withTimezone: true }).notNull(),
    blockedUntil: timestamp('blocked_until', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('auth_rate_limits_blocked_until_idx').on(table.blockedUntil)],
)

export type UserRow = typeof users.$inferSelect
export type NewUserRow = typeof users.$inferInsert
