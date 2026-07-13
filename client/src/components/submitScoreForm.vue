<script setup lang="ts">
    import { ref } from "vue"
    import { useAuth } from "@/composables/useAuth"
    import { useSocket } from "@/composables/useSocket"

    const { User } = useAuth()
    const { submitScore } = useSocket()
    const score = ref(0)
    const game = ref("Tetris")
    const statusMessage = ref<string | null>(null)

    const OnSubmit = () => {
        const numericScore = Number(score.value)

        if (!Number.isFinite(numericScore) || numericScore < 0) {
            statusMessage.value = "Please enter a valid score"
            return
        }

        submitScore(numericScore, game.value)
        statusMessage.value = "Score submitted"
    }
</script>

<template>
    <section>
        <form @submit.prevent="OnSubmit">
            <h1>Username: <span class="highlight"> {{ User?.username ?? 'Guest' }} </span></h1>
            <div id="inputs">
                <label for="score">Score: </label>
                <input type="number" id="score" name="score" v-model="score" placeholder="Enter your score" min="0">
                <select v-model="game">
                    <option value="Tetris">Tetris</option>
                    <option value="Pacman">Pacman</option>
                    <option value="Skate">Skate</option>
                </select>
                <button type="submit" class="btn-secondary">Submit</button>
            </div>
            <p v-if="statusMessage" class="message">{{ statusMessage }}</p>
        </form>
    </section>
</template>

<style lang="css" scoped>
    section{
        width: 100%;
        height: 100%;
    }
    input, select{
        border-radius: 10px;
        padding: 5px;
        margin: 2px;
        width: 100%;
    }
    h1{
        font-weight: 600;
        text-align: center;
        color: #d8e6ee;
    }
    label{
        font-weight: 600;
        color: #d8e6ee;
    }
    .highlight{
        color: #d8e6ee;
        font-weight: 700;
    }
    button {
        width: 100%;
        margin: 2px;
    }

    .message {
        margin-top: 0.5rem;
        color: #d8e6ee;
        text-align: center;
        font-size: 0.9rem;
    }
</style>