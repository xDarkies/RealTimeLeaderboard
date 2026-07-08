<script setup lang="ts">
    import {ref} from "vue"
    import { useAuth } from "@/composables/useAuth";
    import { useSocket } from "@/composables/useSocket";
    const {User} = useAuth()
    const {submitScore} = useSocket()
    const score = ref(0)

    const OnSubmit = () => {
        submitScore(score.value)
    }
</script>

<template>
    <section>
        <form @submit.prevent="OnSubmit">
            <h1>Username: <span class="highlight"> {{ User.valueOf().username }} </span></h1>
            <label for="score">Score: </label>
            <input type="number" id="score" name="score" v-model="score" placeholder="Enter your score" min="0">
            <button type="submit" class="btn-secondary">Submit</button>
        </form>
        <button id="btnClose" class="btn-primary" @click="$emit('close-form')">X</button>
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
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        border: 5px solid rgba(255, 255, 255, 0.3);
        padding: 40px 50px
    }
    input{
        border-radius: 10px;
        padding: 5px;
        margin: 10px;
    }
    h1{
        font-weight: 600;
        text-align: center;
    }
    label{
        font-weight: 600;
    }
    .highlight{
        color: #252525;
    }
    #btnClose{
        position: absolute;
        top: 10px;
        right: 10px
    }
</style>