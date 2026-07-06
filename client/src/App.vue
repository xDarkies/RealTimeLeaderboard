<script setup lang="ts">
    import Auth from './components/Auth.vue';
    import Leaderboard from './components/Leaderboard.vue';
    import { useAuth } from './composables/useAuth';

    const {isLoggedIn, authMe} = useAuth()
    authMe()
</script>

<template>
  <div v-if="!isLoggedIn.valueOf()">
    <Auth />
  </div>
  <div v-else>
    <Leaderboard />
  </div>
</template>

<style scoped>
</style>
