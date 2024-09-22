<script setup lang="ts">
import { messageI } from "../types/types";

defineProps<{
  message: messageI;
  ownMessage: boolean;
  username: string;
  username_color: string;
  first: boolean;
}>();
</script>

<template>
  <div class="main_container">
    <div class="message_container" :class="{ own_message: ownMessage }">
      <div
        class="message_wrapper"
        :class="{ own_message: ownMessage, first: first }"
      >
        <div
          class="username"
          :style="{ color: username_color }"
          v-if="!ownMessage && first"
        >
          {{ username }}
        </div>
        <div class="text">{{ message.message }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main_container {
  width: 100%;
  margin-bottom: 3px;
}

.message_container {
  padding-left: 60px;
  padding-right: 60px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.message_container.own_message {
  align-items: flex-end;
}

.message_wrapper {
  position: relative;
  background-color: white;
  padding: 8px 20px;
  border-radius: 4px;
  max-width: 75%;
}

.message_wrapper.first:after {
  content: "";
  position: absolute;
  left: -10px;
  right: auto;
  top: 0;
  border: 10px solid transparent;
  border-right: 0;
  border-top-color: white;
}

.message_wrapper.first {
  border-top-left-radius: 0;
}

.message_wrapper.own_message {
  background-color: #d9fdd3;
}

.message_wrapper.own_message.first {
  border-top-right-radius: 0;
}

.message_wrapper.own_message.first:after {
  content: "";
  position: absolute;
  right: -10px;
  left: auto;
  top: 0;
  border: 10px solid transparent;
  border-left: 0;
  border-top-color: #d9fdd3;
}

.username {
  padding-bottom: 5px;
}
</style>
