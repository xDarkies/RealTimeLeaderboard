<script setup lang="ts">
    import { useSocket } from '@/composables/useSocket';
    const {leaderboard, isConnected, submitScore } = useSocket()
</script>

<template>
    <button class="btn-primary" @click="submitScore(2000)">
        Submit score
    </button>
    <h1 v-for="score in leaderboard">
        {{ score }}
    </h1>
</template>

<style lang="css" scoped>

</style>