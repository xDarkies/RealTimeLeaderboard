import {createServer} from "node:http"
import {Server} from "socket.io"
import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken"
import AuthRouter from "./auth/auth.routes.js"
import type UserScore from "./types/userScore.js"
import type userScore from "./types/userScore.js"
import { redis, prisma } from "./database.js"
import { parseCookie } from "cookie"

const app = express()
app.use(express.json())

const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

app.use("/api/auth", AuthRouter)


io.on('connection', async socket => {

    const cookieString = socket.handshake.headers.cookie ?? '';
    const cookies = parseCookie(cookieString)
    const authToken = cookies.token ?? null

    if(!authToken){
        socket.disconnect();
        return;
    }
    try{
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET!)
    }catch(error){
        socket.disconnect()
        return
    }

    console.log('User connected to server')
    let scores = await prisma.score.findMany({
        take: 15,
        orderBy: {
            score: "desc"
        },
        include: {user: true}
    })

    await redis.connect();
    let leaderboard = [];
    let i = 1;
    for(const score of scores){
        await redis.zAdd("scores",[{score: score.score, value: score.user.username}])
        leaderboard.push({rank: i++, score: score.score, username: score.user.username})
    }
    socket.emit("leaderboard", leaderboard)

    socket.on('submit-score', async (data: UserScore) => {
        await redis.zAdd("scores",[{score: data.score, value: data.user}])
        const length = await redis.ZCOUNT("scores",0,"inf")
        if(length > 15) await redis.zPopMin("scores")

        const user = await prisma.user.findUnique({where: {username: data.user}})

        if(!user)
            return socket.emit("No user found")

        await prisma.score.create({
            data: {
                userId: user.id,
                score: data.score
            }
        })

        leaderboard = [];
        const scores = await redis.zRange("scores", 0, -1)
        let i = 1;
        for(const score of scores){
            leaderboard.push({rank: i++, score: await redis.zScore("scores", score) || 0, username: score})
        }
        io.emit("leaderboard", leaderboard)
    })

})

io.on("disconnect", async () => await redis.quit())


server.listen(3000, () => {
    console.log('Server listening on port 3000')
})