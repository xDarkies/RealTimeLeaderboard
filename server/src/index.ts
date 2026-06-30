import {createServer} from "node:http"
import {Server} from "socket.io"
import express from "express"
import cors from "cors"
import AuthRouter from "./auth/auth.routes.js"
import type UserScore from "./types/userScore.js"
import type userScore from "./types/userScore.js"

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

const leaderboard: UserScore[] = []

io.on('connection', socket => {
    console.log('User connected to server')
    socket.on('message', (message) => {
        io.emit('message', message)
    })

    socket.on('submit-score', (data: userScore) => {
        leaderboard.push(data)
        leaderboard.sort((a, b) => a.score - b.score )
    })
})


server.listen(3000, () => {
    console.log('Server listening on port 3000')
})