import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    avatar: text('avatar'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export const subscriptions = sqliteTable('subscriptions', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().references(() => users.id),
    name: text('name').notNull(),
    description: text('description'),
    price: real('price').notNull(),
    currency: text('currency').notNull(),
    billingCycle: text('billing_cycle').notNull(), // 'monthly', 'yearly', 'weekly', etc.
    billingDay: integer('billing_day'), // Day of the month for monthly subscriptions
    startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
    endDate: integer('end_date', { mode: 'timestamp' }),
    nextBillingDate: integer('next_billing_date', { mode: 'timestamp' }).notNull(),
    status: text('status').notNull().default('active'), // 'active', 'cancelled', 'paused'
    color: text('color'), // For calendar view
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().defaultNow(),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export const recurringEvents = sqliteTable('recurring_events', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    subscriptionId: integer('subscription_id').notNull().references(() => subscriptions.id),
    eventType: text('event_type').notNull(), // 'payment', 'renewal', etc.
    recurrenceRule: text('recurrence_rule').notNull(), // RRULE format
    lastOccurrence: integer('last_occurrence', { mode: 'timestamp' }),
    nextOccurrence: integer('next_occurrence', { mode: 'timestamp' }).notNull(),
});

export const categories = sqliteTable('categories', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull().unique(),
    color: text('color'), // For calendar view
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export const subscriptionCategories = sqliteTable('subscription_categories', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    subscriptionId: integer('subscription_id').notNull().references(() => subscriptions.id),
    categoryId: integer('category_id').notNull().references(() => categories.id),
});

export const payments = sqliteTable('payments', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    subscriptionId: integer('subscription_id').notNull().references(() => subscriptions.id),
    amount: real('amount').notNull(),
    currency: text('currency').notNull(),
    paymentDate: integer('payment_date', { mode: 'timestamp' }).notNull(),
    status: text('status').notNull(), // 'success', 'failed', 'pending'
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export const notifications = sqliteTable('notifications', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().references(() => users.id),
    subscriptionId: integer('subscription_id').references(() => subscriptions.id),
    type: text('type').notNull(), // 'payment_due', 'subscription_expiring', etc.
    message: text('message').notNull(),
    isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});
