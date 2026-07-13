<script setup lang="ts">
    import { computed, ref } from "vue"
    import { useAuth } from '@/composables/useAuth'

    const { signup } = useAuth()

    const username = ref("")
    const email = ref("")
    const password = ref("")
    const rpassword = ref("")
    const errorMessage = ref<string | null>(null)

    const isMatchingPasswordColor = computed(() => {
        return password.value === rpassword.value ? "white" : "red"
    })

    const handleSubmit = async () => {
        errorMessage.value = null
        const result = await signup(username.value, email.value, password.value, rpassword.value)

        if (!result.success) {
            errorMessage.value = result.error ?? "Signup failed"
        }
    }
</script>

<template>
    <section>
        <h1>Sign up</h1>
        <form @submit.prevent="handleSubmit">
            <div style="display: flex; gap: 20px;">
                <div>
                    <label for="username">Username: </label><br>
                    <label for="email">Email: </label><br>
                    <label for="password">Password: </label>
                    <label for="rpassword">Password: </label>
                </div>
                <div>
                    <input id="username" type="text" placeholder="Enter username" v-model="username">
                    <input id="email" type="email" placeholder="Enter email" v-model="email">
                    <input id="password" type="password" placeholder="Enter password" v-model="password">
                    <input id="rpassword" type="password" placeholder="Repeat password" v-model="rpassword" :style="{ border: `1px solid ${isMatchingPasswordColor}` }">
                </div>
            </div>
            <p v-if="errorMessage" class="message error">{{ errorMessage }}</p>
            <div id="btn">
                <button type="submit" class="btn-secondary">Sign up</button>
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
        background: rgba(19, 212, 212, 0.47);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(3.4px);
        -webkit-backdrop-filter: blur(3.4px);
        border: 1px solid rgba(19, 212, 212, 1);
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
        color: #F2FAFF;
        width: 100%;
    }

    #labels {
        float: left;
        margin-right: 20px;
    }
    label {
        color: #F2FAFF
    }

    button {
        width: 100%;
    }

    #btn{
        display: flex;
        margin: 25px 0;
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