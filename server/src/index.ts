import {createServer} from "node:http"
import {Server} from "socket.io"
import express from "express"
import cors from "cors"

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
})

io.on('connection', socket => {
    console.log('User connected to server')
    socket.on('message', (message) => {
        io.emit('message', message)
    })
})

server.listen(3000, () => {
    console.log('Server listening on port 3000')
})