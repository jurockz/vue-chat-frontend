<script setup lang="ts">
import { onBeforeUnmount, onMounted, onUpdated, ref } from "vue";
import Message from "./Message.vue";
import { messageGroupI, messageI } from "../types/types";
import SendIcon from "../assets/send.svg";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const props = defineProps<{
  username: string;
}>();

const socket = io("http://localhost:3500");

const messageInput = ref<HTMLDivElement | null>(null);
const messages = ref<messageGroupI[]>([]);
const messageContainer = ref<HTMLDivElement | null>(null);

onMounted(async () => {
  try {
    const response = await fetch("http://localhost:3500/chat/api/messages");
    if (response.ok) {
      const data = await response.json();
      messages.value = data;
      // scrollToBottom();
    } else {
      console.error("Failed to fetch messages");
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
  }

  // Subscribe to socket: all
  socket.on("all", (messageGroup: messageGroupI) => {
    addMessage(messageGroup);
    // scrollToBottom();
  });
});

onBeforeUnmount(() => {
  socket.disconnect();
});

function enterDown(event: KeyboardEvent) {
  if (event.key === "Enter" && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    sendMessage();
  }
}

const sendMessage = () => {
  if (messageInput.value) {
    const message = messageInput.value.innerText.trim();
    if (message) {
      const group: messageGroupI = {
        username: props.username,
        color: getColor(props.username),
        messages: [{ id: uuidv4(), message }],
      };
      addMessage(group);
      socket.emit("sendMessage", group);
      // scrollToBottom();
    }
    messageInput.value.innerText = "";
  }
};

const addMessage = (messageGroup: messageGroupI) => {
  const alreadyAdded = messageExists(messageGroup.messages[0]);

  if (alreadyAdded) return;
  const messagesLength = messages.value.length;
  if (
    messagesLength !== 0 &&
    messages.value[messagesLength - 1].username === messageGroup.username
  ) {
    messages.value[messagesLength - 1].messages.push(messageGroup.messages[0]);
  } else {
    messages.value.push(messageGroup);
  }
};

const messageExists = (message: messageI) => {
  return messages.value.some((group) =>
    group.messages.some((m) => m.id === message.id)
  );
};

const getColor = (usernameToFind: string) => {
  for (const messageGroup of messages.value) {
    if (messageGroup.username === usernameToFind) {
      return messageGroup.color;
    }
  }
  return createRandomColor();
};

const createRandomColor = () => {
  const getRandomChannelValue = () => Math.floor(Math.random() * 110 + 90);

  const r = getRandomChannelValue();
  const g = getRandomChannelValue();
  const b = getRandomChannelValue();

  const toHex = (c: number) => c.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const scrollToBottom = () => {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

onUpdated(() => {
  scrollToBottom();
});
</script>

<template>
  <div class="chat_container">
    <div class="message_container" ref="messageContainer">
      <div class="messaage_group" v-for="messageGroup in messages.values()">
        <Message
          v-for="(message, messageIndex) in messageGroup.messages.values()"
          :message="message"
          :own-message="messageGroup.username === username.valueOf()"
          :username="messageGroup.username"
          :username_color="messageGroup.color"
          :first="messageIndex === 0"
        />
      </div>
    </div>
    <div class="input_container">
      <div
        ref="messageInput"
        contenteditable="true"
        @keydown="enterDown"
        class="message_input"
        placeholder="Enter a message...."
      ></div>
      <SendIcon class="send_button" @click="sendMessage" />
    </div>
  </div>
</template>

<style scoped>
.chat_container {
  width: 100%;
  height: 100%;
  background-color: #efeae3;
  display: flex;
  flex-direction: column;
}

.message_container {
  flex: 1 1 0px;
  padding-top: 10px;
  padding-bottom: 10px;
  overflow-y: scroll;
}

.input_container {
  display: flex;
  align-items: flex-end;
  max-height: 20%;
  background-color: #f0f2f5;
  padding: 10px 10px;
}

.message_input {
  box-sizing: border-box;
  margin: 5px 13px;
  outline: none;
  border-radius: 20px;
  padding: 10px 20px;
  border: none;
  font-size: 20px;
  background-color: white;
  flex: 1 1 auto;
  overflow-y: scroll;
  max-height: 100%;
}

.message_input:empty::before {
  content: "Gib eine Nachicht ein.";
  color: #888;
  font-size: 20px;
  pointer-events: none;
}

.messaage_group {
  margin-bottom: 12px;
}

.send_button {
  width: 40px;
  height: 40px;
  min-height: 40px;
  min-width: 40px;
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
