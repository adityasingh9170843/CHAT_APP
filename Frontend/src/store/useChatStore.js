import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios.js";
export const useChatStore = create((set, get) => ({
  selectedUser: null,
  messages: [],
  users: [],
  isUSerLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUSerLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      set({ isUSerLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
        const res = await axiosInstance.get(`/messages/${userId}`);

        console.log("📩 Messages received:", res.data);

        // Extract messages array from the response object
        const messagesArray = res.data.messages; 

        if (!Array.isArray(messagesArray)) {
            throw new Error("Invalid response format: messages should be an array");
        }

        set({ messages: messagesArray }); // Store only the array in Zustand store
    } catch (error) {
        console.error("❌ Failed to fetch messages:", error);
        toast.error("Failed to fetch messages");
        set({ messages: [] }); // Prevents undefined errors
    } finally {
        set({ isMessagesLoading: false });
    }
},

  sendMessage: async (messageData) => {
    const { selectedUser, messages = [] } = get(); // Ensure messages is always an array
    try {
        console.log("📨 Sending Message:", messageData);
        const res = await axiosInstance.post(`/messages/send/${selectedUser?._id}`, messageData);

        if (!res || !res.data) throw new Error("No response received from server");

        console.log("✅ Response from Server:", res);
        if (!res.data.newMessage) throw new Error("Response format incorrect");

        // Ensure messages is always an array before updating state
        set({ messages: [...(Array.isArray(messages) ? messages : []), res.data.newMessage] });
    } catch (error) {
        console.error("❌ Failed to send message:", error);
        toast.error(error.response?.data?.message || "Message sending failed");
    }
},


  setSelectedUser: (user) => {
    set({ selectedUser: user }); // Correct way to update state
  },
}));
