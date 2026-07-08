<script setup lang="ts">
    import { ref, computed } from "vue" 
    import { useSocket } from '@/composables/useSocket';
    import SubmitScoreForm from './submitScoreForm.vue';
    const {leaderboard, isConnected} = useSocket()
    const submitScoreFormVisible = ref(false)
    const changeSSFVisibility = () => submitScoreFormVisible.value = !submitScoreFormVisible.value;
    const leaderboardSize = computed(()=>leaderboard.value.length)
</script>

<template>
    <button class="btn-primary" @click="changeSSFVisibility">
        Submit score
    </button>
    <section>
        <h1>Leaderboard</h1>
        <ol>
            <li id="liHeader">
                <span>Rank</span> <span>Score</span> <span>Nickname</span>
            </li>
            <li v-for="score in leaderboard">
                <span>{{ score.rank }}</span> <span>{{ score.score }}</span> <span>{{ score.username }}</span>
            </li>
            <template v-for="n in 10">
                <li v-if="n > leaderboardSize">
                <span>{{ n }}</span> <span>none</span> <span>none</span>
                </li>
            </template>
        </ol>
    </section>
    <div v-if="submitScoreFormVisible">
        <SubmitScoreForm @close-form="changeSSFVisibility"/>
    </div>

</template>

<style lang="css" scoped>
    button {
        margin: 30px 50px;
    }
    section {
        width: 70%;
        border-radius: 30px;
        background: #221ba1;
        background: linear-gradient(228deg, rgba(34, 27, 161, 1) 0%, rgba(28, 28, 212, 1) 35%, rgba(28, 92, 212, 1) 70%, rgba(22, 186, 219, 1) 100%);
        padding: 10px 30px 20px 30px;
        margin: 0 auto;
    }
    h1 {
       text-align: center; 
       font-weight: 600;
       color: #B9D3E0;
    }
    ol {
        list-style-type: none;
        padding: 0;
    }
    li {
        display: flex;
        justify-content: space-between;
        border-radius: 10px;
        padding: 5px;
        margin: 5px;
    }
    li span {
        text-align: center;
        width: 30%;
        color: #B9D3E0;
    }
    #liHeader span{
        font-weight: 700;
    }
    li:nth-child(even){
        background-color: #1C50D4;
    }
    li:nth-child(odd){
        background-color: #2E1CD4;
    }
</style>