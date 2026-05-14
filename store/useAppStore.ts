"use client";

import { create } from "zustand";
import type { ChatMessage } from "@/types";

type AppState = {
  messages: ChatMessage[];
  subscriptionStatus: string;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, content: string) => void;
  setSubscriptionStatus: (status: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  messages: [],
  subscriptionStatus: "FREE",
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (id, content) => set((state) => ({ messages: state.messages.map((message) => (message.id === id ? { ...message, content } : message)) })),
  setSubscriptionStatus: (subscriptionStatus) => set({ subscriptionStatus })
}));
