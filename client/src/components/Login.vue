<script setup lang="ts">
    import { ref } from "vue"
    import { useAuth } from '@/composables/useAuth'

    const { login } = useAuth()

    const email = ref("")
    const password = ref("")
    const errorMessage = ref<string | null>(null)

    const handleSubmit = async () => {
        errorMessage.value = null
        const result = await login(email.value, password.value)

        if (!result.success) {
            errorMessage.value = result.error ?? "Login failed"
        }
    }
</script>

<template>
    <section>
        <h1>Sign in</h1>
        <form @submit.prevent="handleSubmit">
            <div style="display: flex; gap: 20px;">
                <div>
                    <label for="email">Email: </label><br>
                    <label for="password">Password: </label>
                </div>
                <div>
                    <input id="email" type="email" placeholder="Enter email" v-model="email">
                    <input id="password" type="password" placeholder="Enter password" v-model="password">
                </div>
            </div>
            <p v-if="errorMessage" class="message error">{{ errorMessage }}</p>
            <div id="btn">
                <button type="submit" class="btn-primary">Sign in</button>
            </div>
        </form>
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

    .message {
        margin-top: 1rem;
        text-align: center;
        font-weight: 600;
    }

    .error {
        color: #c62828;
    }

</style>