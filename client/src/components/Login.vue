<script setup lang="ts">
    import { ref } from "vue"
    import { useAuth } from '@/composables/useAuth';

    const { login } = useAuth()

    const email = ref("")
    const password = ref("")

</script>

<template>
    <section>
        <h1>Sign in</h1>
        <div style="display: flex; gap: 20px;">
            <div>
                <label for="email">Email: </label><br>
                <label for="password">Password: </label>
            </div>
            <div>
                <input id="email" type="input" placeholder="Enter email" v-model="email">
                <input id="password" type="password" placeholder="Enter password" v-model="password">
            </div>
        </div>
        <div id="btn">
            <button @click="login(email.valueOf(),password.valueOf())" class="btn-primary">Sign in</button>
        </div>
    </section>
</template>

<style lang="css" scoped>
    h1 {
        color: whitesmoke;
        font-weight: 700;
        text-align: center;
        margin-bottom: 30px;
    }

    section {
        width: 40%;
        border-radius: 20px;
        padding: 1.5rem;
        /* From https://css.glass */
        background: rgba(225, 217, 217, 0.38);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(3.4px);
        -webkit-backdrop-filter: blur(3.4px);
        border: 1px solid rgba(225, 217, 217, 1);
    }

    input {
        background: rgba(225, 217, 217, 0.38);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(3.4px);
        border: 1px solid rgba(225, 217, 217, 1);
        outline: none;
        border-radius: 3px;
        border: 1px solid white;
        color: #1A1A1A;
        width: 100%;
    }
    label {
        color: whitesmoke;
    }

    button {
        width: 100%;
    }

    #btn{
        display: flex;
        margin: 50px 0;
        justify-content: center;
    }

</style>