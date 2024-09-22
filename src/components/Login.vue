<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  username: string;
  updateUsername: (newUsername: string) => void;
}>();

const messageInput = ref<HTMLInputElement | null>(null);

function enterDown(event: KeyboardEvent) {
  if (event.key === "Enter") {
    update();
  }
}

const update = () => {
  if (messageInput.value && messageInput.value.value) {
    props.updateUsername(messageInput.value.value.toLowerCase());
  }
};
</script>

<template>
  <div class="main_login">
    <div class="login_wrapper">
      <input
        ref="messageInput"
        placeholder="Gebe deinen Namen ein."
        type="text"
        class="login_input"
        @keydown="enterDown"
      />
      <button class="login_btn" @click="update">Login</button>
    </div>
  </div>
</template>

<style scoped>
.main_login {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login_wrapper {
  display: flex;
  flex-direction: column;
}

.login_input {
  outline: none;
  font-size: 22px;
  padding: 10px 15px;
  margin-bottom: 10px;
  border: none;
  background-color: #f0f2f5;
  border-radius: 5px;
}

.login_btn {
  border: none;
  border-radius: 5px;
  background-color: #d9fdd3;
  padding: 10px 15px;
  font-size: 25px;
  color: grey;
}
</style>
