<script setup lang="ts">
    import io from "socket.io-client"

    const client = io("ws://localhost:3000")

    client.on("connect", () => {
      console.log("Connected to server")
    })

    client.on("leaderboard", (data) => {
      console.log(data)
    })
</script>

<template>
</template>

<style scoped>
</style>
