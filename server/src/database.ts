import { PrismaClient } from "./generated/prisma/client.js"
import { PrismaPg } from "@prisma/adapter-pg"
import { createClient } from "redis"

const databaseUrl = process.env.DATABASE_URL
const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379"

if (!databaseUrl) {
    throw new Error("DATABASE_URL must be set")
}

export const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl })
})

export const redis = createClient({ url: redisUrl })