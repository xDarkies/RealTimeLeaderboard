import { ref } from "vue"
import { io, type Socket } from "socket.io-client"
import { useAuth } from "./useAuth"

const { User } = useAuth()

type Leaderboard = {
    rank: number
    username: string
    score: number
}

let socket: Socket | null = null
const leaderboard = ref<[Leaderboard[], Leaderboard[], Leaderboard[]]>([[], [], []])
const isConnected = ref(false)
const games = ["Tetris", "Pacman", "Skate"]
const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000"

export function useSocket() {
    if (!socket) {
        socket = io(socketUrl, {
            withCredentials: true,
            transports: ["websocket"]
        })

        socket.on("connect", () => {
            isConnected.value = true
        })

        socket.on("disconnect", () => {
            isConnected.value = false
        })

        socket.on("connect_error", () => {
            isConnected.value = false
        })

        socket.on("leaderboardTetris", (data: Leaderboard[]) => {
            leaderboard.value[0] = data || []
        })

        socket.on("leaderboardPacman", (data: Leaderboard[]) => {
            leaderboard.value[1] = data || []
        })

        socket.on("leaderboardSkate", (data: Leaderboard[]) => {
            leaderboard.value[2] = data || []
        })
    }

    const submitScore = (score: number, game: string) => {
        const username = User.value?.username
        if (!username || !socket?.connected) return

        socket.emit("submit-score", { username, score, game })
    }

    return {
        socket,
        leaderboard,
        isConnected,
        submitScore,
        games
    }
}