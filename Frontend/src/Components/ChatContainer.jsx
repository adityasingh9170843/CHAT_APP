import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import MessageSkeleton from "./Skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import axios from "axios";

function ChatContainer() {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeToMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => {
      unsubscribeToMessages();
    };
  }, [selectedUser._id]);

  useEffect(() => {
    if (messageEndRef.current && messages.length) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const summarizeChat = async () => {
    try {
      const messageTexts = messages.map((msg) => ({ text: msg.text || "" }));
      const response = await axios.post("http://localhost:5001/api/summarize", {
        messages: messageTexts,
      });
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error summarizing chat:", error);
    }
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic
                  }
                  alt="profile-pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex flex-col gap-2">
        <button
          onClick={summarizeChat}
          className="btn btn-primary"
          disabled={isSummarizing}
        >
          {isSummarizing ? "Summarizing..." : "Summarize Chat"}
        </button>

        {summary && (
          <div className="p-4 bg-base-200 rounded-md shadow mt-2">
            <h3 className="font-semibold mb-2 text-lg">Chat Summary:</h3>
            <p className="text-sm text-gray-700">{summary}</p>
          </div>
        )}
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatContainer;
