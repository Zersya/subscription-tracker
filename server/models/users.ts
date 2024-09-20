import {tables, useDrizzle} from "~/server/utils/drizzle";
import {eq} from "drizzle-orm";

export function getData() {
    return useDrizzle().select().from(tables.users).all()
}

export function createData(name: string, email: string, password: string, avatar: string | null) {
    return useDrizzle().insert(tables.users).values({
        name,
        email,
        password,
        avatar,
        createdAt: new Date()
    }).returning().get()
}

export function updateData(id: number, data: Partial<Omit<typeof tables.users.$inferInsert, 'id' | 'createdAt' | 'deletedAt'>>) {
    return useDrizzle().update(tables.users)
        .set(data)
        .where(eq(tables.users.id, id))
        .returning()
        .get()
}

export function deleteData(id: number) {
    return useDrizzle().update(tables.users).set({deletedAt: new Date()})
        .where(eq(tables.users.id, id))
        .returning()
        .get()
}
