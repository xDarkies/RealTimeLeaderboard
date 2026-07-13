import { ref, computed } from "vue"

type AuthUser = {
    id: string
    username: string
    email: string
} | null

const User = ref<AuthUser>(null)
const isLoading = ref(true)
const authError = ref<string | null>(null)

const clearAuthError = () => {
    authError.value = null
}

export function useAuth() {
    const isLoggedIn = computed(() => Boolean(User.value))

    async function signup(username: string, email: string, password: string, rpassword: string) {
        clearAuthError()

        try {
            const usernameRegex = /^[0-9A-Za-z]{6,16}$/
            const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

            if (password !== rpassword) {
                return { success: false, error: "Passwords are not the same" }
            }
            if (!usernameRegex.test(username)) {
                return { success: false, error: "Username must be between 6 and 16 characters" }
            }
            if (!emailRegex.test(email)) {
                return { success: false, error: "Email must be in email format" }
            }
            if (!passwordRegex.test(password)) {
                return { success: false, error: "Password must be at least 8 characters long and contain one uppercase letter, one number and one special character" }
            }

            const response = await fetch("/api/auth/signup", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            })

            const data = await response.json().catch(() => ({}))

            if (!response.ok) {
                throw new Error(data.error || data.message || "Signup failed")
            }

            User.value = data.user ?? null
            return { success: true, user: data.user }
        } catch (error: any) {
            authError.value = error.message
            return { success: false, error: error.message }
        }
    }

    async function login(email: string, password: string) {
        clearAuthError()

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })

            const data = await response.json().catch(() => ({}))

            if (!response.ok) {
                throw new Error(data.error || data.message || "Login failed")
            }

            User.value = data.user ?? null
            return { success: true }
        } catch (error: any) {
            authError.value = error.message
            return { success: false, error: error.message }
        }
    }

    async function logout() {
        clearAuthError()

        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include"
            })

            const data = await response.json().catch(() => ({}))

            if (!response.ok) {
                throw new Error(data.error || data.message || "Logout failed")
            }

            User.value = null
            return { success: true }
        } catch (error: any) {
            authError.value = error.message
            return { success: false, error: error.message }
        }
    }

    async function authMe() {
        isLoading.value = true
        clearAuthError()

        try {
            const response = await fetch("/api/auth/me", {
                method: "GET",
                credentials: "include"
            })

            const data = await response.json().catch(() => ({}))
            if (!response.ok) {
                throw new Error(data.error || data.message || "Authentication failed")
            }

            User.value = data.user ?? null
            return { success: true }
        } catch (error: any) {
            User.value = null
            authError.value = error.message
            return { success: false, error: error.message }
        } finally {
            isLoading.value = false
        }
    }

    return {
        User,
        isLoading,
        isLoggedIn,
        authError,
        clearAuthError,
        signup,
        login,
        logout,
        authMe
    }
}