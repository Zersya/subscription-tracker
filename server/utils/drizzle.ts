import { drizzle } from 'drizzle-orm/d1'
export { sql, eq, and, or } from 'drizzle-orm'

import * as schema from '../database/schema'

export const tables = schema

export function useDrizzle() {
    return drizzle(hubDatabase(), { schema })
}

export type User = typeof schema.users.$inferSelect
export type Subscription = typeof schema.subscriptions.$inferSelect
export type RecurringEvent = typeof schema.recurringEvents.$inferSelect
export type Category = typeof schema.categories.$inferSelect
export type SubscriptionCategory = typeof schema.subscriptionCategories.$inferSelect
export type Payment = typeof schema.payments.$inferSelect
export type Notification = typeof schema.notifications.$inferSelect
