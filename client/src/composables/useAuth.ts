import { ref, computed} from "vue"

const User = ref<any | null>()

export function useAuth(){

    const isLoggedIn = computed(()=> User.value != null)

    async function signup(username: string, email: string, password: string, rpassword: string){
        try{
            const response = await fetch("http://localhost:3000/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            })

            const data = await response.json()

            if(!response.ok)
                throw new Error(data.error || "Signup failed")

            User.value = data.user;

            return { success: true }; 
        }catch(error: any){
            return { success: false, error: error.message };
        }
    }

    async function login(email: string, password: string){
        try{
            const response = await fetch("http://localhost:3000/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })

            const data = await response.json()

            if(!response.ok)
                throw new Error(data.error || "Login failed")

            User.value = data.user;

            return { success: true }
        }catch(error: any){
            return { success: false, error: error.message };
        }
    }

    async function logout() {
        try{
            const response = await fetch("http://localhost:3000/api/auth/logout", {
                method: "POST"
            })

            const data = await response.json()

            if(!response.ok)
                throw new Error(data.error || "Logout failed")

            User.value = null;
            
            return { success: true }

        }catch(error: any){
            return { success: false, error: error.message };
        }
    }

    return {
        User,
        isLoggedIn,
        signup,
        login,
        logout
    }
}