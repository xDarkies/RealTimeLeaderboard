import {createServer} from "node:http"
import {Server} from "socket.io"
import express, { raw } from "express"
import cors from "cors"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import AuthRouter from "./auth/auth.routes.js"
import type UserScore from "./types/userScore.js"
import { redis, prisma } from "./database.js"
import { parseCookie } from "cookie"

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"]

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
    const rawCookies = socket.handshake.headers.cookie;

    if (!rawCookies) {
      return next(new Error("Authentication error: No cookies found"));
    }
    const cookies = parseCookie(rawCookies);
    const token = cookies.token; 

    if (!token) {
      return next(new Error("Authentication error: Token missing"));
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded: any) => {
      if (err) {
        return next(new Error("Authentication error: Invalid token"));
      }

      socket.data.userId = decoded.userId;
      socket.data.username = decoded.username;
      
      next();
    });

  } catch (error) {
    return next(new Error("Authentication error: Internal validation failure"));
  }
})

io.on('connection', async socket => {

    console.log('User connected to server')
    let scores = await prisma.score.findMany({
        take: 10,
        orderBy: {
            score: "desc"
        },
        include: {user: true}
    })

    let leaderboard = [];
    let i = 1;
    for(const score of scores){
        await redis.zAdd("scores",[{score: score.score, value: score.user.username}])
        leaderboard.push({rank: i++, score: score.score, username: score.user.username})
    }
    socket.emit("leaderboard", leaderboard)

    socket.on('submit-score', async (data: UserScore) => {
        await redis.zAdd("scores",[{score: data.score, value: data.username}])
        const length = await redis.ZCOUNT("scores",0,"inf")
        if(length > 10) await redis.zPopMin("scores")
        const user = await prisma.user.findUnique({where: {username: data.username}})

        if(!user)
            return socket.emit("error","No user found")

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

});


(async () => {
    try{
        await redis.connect()
        server.listen(3000, () => {
            console.log('Server listening on port 3000')
        });
    }catch(err){
        console.error('Redis connection failed')
        process.exit(1)
    }
})()

process.on('SIGINT', async () => {
  await redis.quit();
  process.exit();
});