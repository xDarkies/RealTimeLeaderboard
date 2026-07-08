<script setup lang="ts">
    import { ref } from "vue" 
    import { useSocket } from '@/composables/useSocket';
    import SubmitScoreForm from './submitScoreForm.vue';
    const {leaderboard, isConnected} = useSocket()
    const submitScoreFormVisible = ref(false)
    const changeSSFVisibility = () => submitScoreFormVisible.value = !submitScoreFormVisible.value;
</script>

<template>
    <button class="btn-primary" @click="changeSSFVisibility">
        Submit score
    </button>
    <h1 v-for="score in leaderboard">
        {{ score }}
    </h1>
    <div v-if="submitScoreFormVisible">
        <SubmitScoreForm @close-form="changeSSFVisibility"/>
    </div>

</template>

<style lang="css" scoped>
    button {
        margin: 30px 50px;
    }
</style>