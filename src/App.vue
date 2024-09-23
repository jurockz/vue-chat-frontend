<script setup lang="ts">
import { ref } from "vue";
import Chat from "./components/Chat.vue";
import Login from "./components/Login.vue";

const username = ref<string>("");

const updateUsername = (newUsername: string) => {
  username.value = newUsername;
};
</script>

<template>
  <div class="page_chat_container">
    <Chat :username="username" v-if="username" />
    <Login :username="username" :updateUsername="updateUsername" v-else />
  </div>
</template>

<style scoped>
.page_chat_container {
  width: 100%;
  height: 100vh;
  height: 100dvh;
  display: flex;
  justify-content: center;
}
</style>
