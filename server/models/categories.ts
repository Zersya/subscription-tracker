import {tables, useDrizzle} from "~/server/utils/drizzle";
import {eq} from "drizzle-orm";

export function getData() {
    return useDrizzle().select().from(tables.categories).all()
}

export function createData(name: string, color: string | null) {
    return useDrizzle().insert(tables.categories).values({
        name,
        color,
        createdAt: new Date()
    }).returning().get()
}

export function updateData(id: number, data: Partial<Omit<typeof tables.categories.$inferInsert, 'id' | 'createdAt' | 'deletedAt'>>) {
    return useDrizzle().update(tables.categories)
        .set(data)
        .where(eq(tables.categories.id, id))
        .returning()
        .get()
}

export function deleteData(id: number) {
    return useDrizzle().update(tables.categories).set({deletedAt: new Date()})
        .where(eq(tables.categories.id, id))
        .returning()
        .get()
}
