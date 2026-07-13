<script setup lang="ts">
    import { ref } from "vue"
    import { useAuth  } from "@/composables/useAuth";
    import SubmitScoreForm from "./SubmitScoreForm.vue";
    const { logout } = useAuth()
</script>

<template>
    <section>
        <SubmitScoreForm />
      <button class="btn-secondary btnLogout" @click="logout">
        Log out  <i class="fa fa-sign-out" aria-hidden="true"></i>
    </button>
    </section>
</template>

<style lang="css" scoped>
    section {
        background: rgba(23, 229, 171, 0.62);
        border-radius: 0px 16px 16px 0px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(3.4px);
        -webkit-backdrop-filter: blur(3.4px);
        border: 5px solid rgba(23, 229, 171, 0.62);
        border-left: none;
        padding: 10px;
    }
    .btnLogout {
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translate(-50%, 0);
    }
</style>