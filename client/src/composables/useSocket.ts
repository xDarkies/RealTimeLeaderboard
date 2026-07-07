import { ref, onMounted, onUnmounted} from "vue"
import {io, type Socket}  from "socket.io-client"
import { useAuth } from "./useAuth"

const { User } = useAuth()
type Leaderboard = {
    rank: number,
    username: string,
    score: number
}

let socket: Socket | null = null
const leaderboard = ref<Leaderboard[]>([])
const isConnected = ref(false)

export function useSocket() {
    if(!socket){
        socket = io("ws://localhost:3000", {
            withCredentials: true
        })

        socket.on("connect", () => {
            isConnected.value = true;
        })

        socket.on("disconnect", () => {
            isConnected.value = false;
        })

        socket.on("leaderboard", (data: Leaderboard[]) => {
            leaderboard.value = data;
        })
        
    }
    const submitScore = ( score: number) => {
        const username = User.value.username;
        if(!username) return
        socket?.emit("submit-score", {username, score, game: ""})
    }

    return {
        socket,
        leaderboard,
        isConnected,
        submitScore
    }
}