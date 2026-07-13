<script setup lang="ts">
    import { ref, computed } from "vue" 
    import { useSocket } from '@/composables/useSocket';
    const {leaderboard, isConnected, games} = useSocket()
    const submitScoreFormVisible = ref(false)
    const changeSSFVisibility = () => submitScoreFormVisible.value = !submitScoreFormVisible.value;
    const game = ref(0)
    const leaderboardSize = computed(()=> (leaderboard.value?.[game.value]?.length) ?? 0)

    const changeGame = (inc: number) => {
        game.value += inc
        if(game.value > 2) game.value = 0
        if(game.value < 0) game.value = 2
    }


</script>

<template>
    <section>
        <h1>Leaderboard</h1>
        <nav>
            <button @click="changeGame(-1)" class="btnArrows">
                <i class="fa fa-arrow-left" aria-hidden="true" style="color: #B9D3E0;"></i>
            </button>
            <text>
                {{ games[game] }}
            </text>
            <button @click="changeGame(1)" class="btnArrows">
                <i class="fa fa-arrow-right" aria-hidden="true" style="color: #B9D3E0;"></i>
            </button>
        </nav>
        <ol>
            <li id="liHeader">
                <span>Rank</span> <span>Score</span> <span>Nickname</span>
            </li>
            <li v-for="score in leaderboard[game]" :key="score?.rank">
                <span>{{ score.rank }}</span> <span>{{ score.score }}</span> <span>{{ score.username }}</span>
            </li>
            <template v-for="n in 10">
                <li v-if="n > leaderboardSize">
                <span>{{ n }}</span> <span>none</span> <span>none</span>
                </li>
            </template>
        </ol>
    </section>
</template>

<style lang="css" scoped>
    section {
        width: 70%;
        border-radius: 30px;
        background: #221ba1;
        background: linear-gradient(228deg, rgba(34, 27, 161, 1) 0%, rgba(28, 28, 212, 1) 35%, rgba(28, 92, 212, 1) 70%, rgba(22, 186, 219, 1) 100%);
        padding: 10px 30px 20px 30px;
        margin: 15px 50px;
        height: 95vh;
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
    .btnArrows {
        background: none;
        border: none;
        flex-grow: 3;
        font-size: larger;
    }
    nav{
        width: 100%;
        display: flex;
        padding: 0.5rem 1rem;
        background-color: #1C50D4;
        border-radius: 15px;
    }
    text{
        flex-grow: 7;
        text-align: center;
        font-size: 1.5rem;
        color: #B9D3E0;
        border-left: 2px solid #B9D3E0;
        border-right: 2px solid #B9D3E0;
    }
</style>