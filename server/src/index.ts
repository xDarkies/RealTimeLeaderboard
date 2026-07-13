import { createServer } from "node:http"
import { Server } from "socket.io"
import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import { parseCookie } from "cookie"
import AuthRouter from "./auth/auth.routes.js"
import type UserScore from "./types/userScore.js"
import { redis, prisma } from "./database.js"

const allowedOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:5173,http://127.0.0.1:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

const port = Number(process.env.PORT ?? 3000)
const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret) {
    throw new Error("JWT_SECRET must be set")
}

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
            return
        }

        callback(new Error("Not allowed by CORS"))
    },
    credentials: true
}))

const server = createServer(app)
const io = new Server(server, {
    pingTimeout: 5000,
    pingInterval: 10000,
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
})

app.use("/api/auth", AuthRouter)

io.use((socket, next) => {
    try {
        const rawCookies = socket.handshake.headers.cookie

        if (!rawCookies) {
            return next(new Error("Authentication error: No cookies found"))
        }

        const cookies = parseCookie(rawCookies)
        const token = cookies.token

        if (!token) {
            return next(new Error("Authentication error: Token missing"))
        }

        jwt.verify(token, jwtSecret, (err, decoded: any) => {
            if (err) {
                return next(new Error("Authentication error: Invalid token"))
            }

            socket.data.userId = decoded.userId
            socket.data.username = decoded.username

            next()
        })
    } catch (error) {
        return next(new Error("Authentication error: Internal validation failure"))
    }
})

io.on("connection", async (socket) => {
    console.log("User connected to server")

    const initialScores = await prisma.score.findMany({
        orderBy: { score: "desc" },
        include: { user: true }
    })

    const leaderboard: Array<Array<{ rank: number; score: number; username: string }>> = [[], [], []]
    const seenUsers = [new Set<string>(), new Set<string>(), new Set<string>()]
    const uniqueScores: Array<Array<typeof initialScores[number]>> = [[], [], []]

    for (const score of initialScores) {
        const index = getGameIndex(score.game)
        const seenUserSet = seenUsers[index]
        const scoreBucket = uniqueScores[index]

        if (seenUserSet && scoreBucket && !seenUserSet.has(score.userId)) {
            seenUserSet.add(score.userId)
            scoreBucket.push(score)
            if (scoreBucket.length === 10) {
                break
            }
        }
    }

    for (const [index, scoresArr] of uniqueScores.entries()) {
        let rank = 1
        const leaderboardBucket = leaderboard[index]

        for (const score of scoresArr) {
            await redis.zAdd(score.game, [{ score: score.score, value: score.user.username }])
            leaderboardBucket?.push({ rank: rank++, score: score.score, username: score.user.username })
        }
    }

    socket.emit("leaderboardTetris", leaderboard[0])
    socket.emit("leaderboardPacman", leaderboard[1])
    socket.emit("leaderboardSkate", leaderboard[2])

    socket.on("submit-score", async (data: UserScore) => {
        if (!socket.data.userId) {
            return socket.emit("error", "Authentication required")
        }

        const username = socket.data.username ?? data.username
        const normalizedGame = data.game ?? "Tetris"

        await redis.zAdd(normalizedGame, [{ score: data.score, value: username }])
        const length = await redis.ZCOUNT(normalizedGame, 0, "inf")
        if (length > 10) {
            await redis.zPopMin(normalizedGame)
        }

        await prisma.score.create({
            data: {
                userId: socket.data.userId,
                score: data.score,
                game: normalizedGame
            }
        })

        const index = getGameIndex(normalizedGame)
        leaderboard[index] = []
        const scores = await redis.zRange(normalizedGame, 0, -1, { REV: true })
        let rank = 1

        for (const score of scores) {
            leaderboard[index].push({
                rank: rank++,
                score: Number(await redis.zScore(normalizedGame, score) ?? 0),
                username: score
            })
        }

        io.emit(`leaderboard${normalizedGame}`, leaderboard[index])
    })
})

const getGameIndex = (game: string) => {
    switch (game) {
        case "Tetris":
            return 0
        case "Pacman":
            return 1
        case "Skate":
            return 2
        default:
            return 0
    }
}

;(async () => {
    try {
        await redis.connect()
        server.listen(port, () => {
            console.log(`Server listening on port ${port}`)
        })
    } catch (err) {
        console.error("Redis connection failed", err)
        process.exit(1)
    }
})()

process.on("SIGINT", async () => {
    await redis.quit()
    process.exit(0)
})