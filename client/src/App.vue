<script setup lang="ts">
    import { onMounted } from 'vue'
    import Auth from './components/Auth.vue'
    import Leaderboard from './components/Leaderboard.vue'
    import Sidebar from './components/Sidebar.vue'
    import { useAuth } from './composables/useAuth'

    const { isLoggedIn, isLoading, authMe } = useAuth()

    onMounted(() => {
        authMe()
    })
</script>

<template>
  <div v-if="isLoading">Checking session...</div>
  <div v-else-if="!isLoggedIn">
    <Auth />
  </div>
  <main v-else>
    <Sidebar />
    <Leaderboard />
  </main>
</template>

<style scoped>
   main {
    display: flex;
   }
</style>
