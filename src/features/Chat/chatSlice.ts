import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { Chat, Message, Thread } from "./interfaceChat";
import { User } from "../User/interfaceUser";

const initialState: Chat = {
  activeThread: null,
  users: [],
  threads: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveThread: (state, action: PayloadAction<Thread | null>) => {
      state.activeThread = action.payload;
    },
    resetActiveThread: (state) => {
      state.activeThread = null;
    },
    setThreadList: (state, action: PayloadAction<Thread[]>) => {
      state.threads = action.payload;
    },
    addMessage: (
      state,
      action: PayloadAction<{ threadId: string; message: Message }>
    ) => {
      const { threadId, message } = action.payload;
      const findIndexThread = state.threads.findIndex(
        (thread) => thread.id === threadId
      );
      state.threads[findIndexThread].messages.push(message);
    },
    updateTyping: (
      state,
      action: PayloadAction<{
        threadId: string;
        isTyping: boolean;
        user: string;
      }>
    ) => {
      const { threadId, isTyping, user } = action.payload;
      const findIndexThread = state.threads.findIndex(
        (thread) => thread.id === threadId
      );
      const thread = state.threads[findIndexThread];
      if (isTyping && !thread.typingUsers.includes(user)) {
        thread.typingUsers.push(user);
      } else if (!isTyping && thread.typingUsers.includes(user)) {
        thread.typingUsers = thread.typingUsers.filter((u) => u !== user);
      }
    },
    addListUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
  },
});

export const {
  resetActiveThread,
  setActiveThread,
  setThreadList,
  addMessage,
  updateTyping,
  addListUsers,
} = chatSlice.actions;

export const selectActiveThread = (state: RootState) => state.chat.activeThread;
export const selectThreads = (state: RootState) => state.chat.threads;
export const selectMessageList = (state: RootState) => {
  const findIndexThread = state.chat.threads.findIndex(
    (thread) => thread.id === state.chat.activeThread?.id
  );
  return state.chat.threads[findIndexThread].messages;
};
export const selectTypingUsers = (state: RootState) => {
  const findIndexThread = state.chat.threads.findIndex(
    (thread) => thread.id === state.chat.activeThread?.id
  );
  return state.chat.threads[findIndexThread].typingUsers;
};
export const selectUsers = (state: RootState) => state.chat.users;

export default chatSlice.reducer;
