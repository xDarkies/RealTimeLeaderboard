<script setup lang="ts">
import Login from './Login.vue';
import Signup from './Signup.vue';


</script>

<template>
    <main>
        <Login />
        <Signup />
    </main>
</template>

<style lang="css" scoped>
    main {
        width: 90%;
        position: absolute;
        left: 50%;
        top:50%;
        transform: translate(-50%,-50%);
        display: flex;
        justify-content: center;
        gap: 2rem;
    }
</style>