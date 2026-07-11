<script setup lang="ts">
    import {ref} from "vue"
    import { useAuth } from "@/composables/useAuth";
    import { useSocket } from "@/composables/useSocket";
    const {User} = useAuth()
    const {submitScore} = useSocket()
    const score = ref(0)
    const game = ref('Tetris')

    const OnSubmit = () => {
        submitScore(score.value, game.value)
    }
</script>

<template>
    <section>
        <form @submit.prevent="OnSubmit">
            <h1>Username: <span class="highlight"> {{ User.valueOf().username }} </span></h1>
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
        </form>
        <button id="btnClose" class="btn-primary" @click="$emit('close-form')"><i class="fa fa-times" aria-hidden="true"></i></button>
    </section>
</template>

<style lang="css" scoped>
    section{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        /* From https://css.glass */
        background: rgba(255, 255, 255, 0.62);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(5px);
        border: 5px solid rgba(255, 255, 255, 0.3);
        padding: 40px 50px
    }
    input, select{
        border-radius: 10px;
        padding: 5px;
        margin: 5px;
    }
    h1{
        font-weight: 600;
        text-align: center;
        color: #B9D3E0;
    }
    label{
        font-weight: 600;
    }
    .highlight{
        color: #B9D3E0;
    }
    #btnClose{
        position: absolute;
        top: 10px;
        right: 10px
    }
    #inputs {
        width: 85%;
        margin: 0 auto;
    }
</style>