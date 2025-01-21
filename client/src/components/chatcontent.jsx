import React, { useState, useRef } from "react";
import {
  FaPaperclip,
  FaSmile,
  FaPaperPlane,
  FaMicrophone,
  FaChevronLeft,
} from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import "./chatpage.css";

const ChatContent = ({
  activeChat,
  setActiveChat,
  messages,
  setMessages,
  message,
  setMessage,
  showEmojiPicker,
  setShowEmojiPicker,
  emojiPickerRef,
  emojiButtonRef,
  handleEmojiClick,
}) => {
  return (
    <div
      className={`flex-1 ${
        activeChat === null ? "hidden" : "block"
      } md:block bg-gray-800`}
    >
      {activeChat ? (
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-bold">{activeChat}</h2>
            <button
              onClick={() => setActiveChat(null)}
              className="p-2 text-gray-400 bg-gray-700 rounded-full hover:bg-gray-600"
            >
              <FaChevronLeft />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <p
                key={index}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-2 w-fit"
              >
                {msg}
              </p>
            ))}
          </div>

          <div className="p-4 border-t border-gray-700 flex items-center space-x-2">
            <button className="text-gray-400 text-xl">
              <FaPaperclip />
            </button>
            <button
              ref={emojiButtonRef}
              className="text-gray-400 text-xl"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <FaSmile />
            </button>
            {showEmojiPicker && (
              <div ref={emojiPickerRef} className="absolute bottom-16 z-50">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  theme="dark"
                  className="hide-scrollbar w-full h-80 sm:h-96"
                />
              </div>
            )}
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none"
            />
            <button
              onClick={
                message.trim()
                  ? () => setMessages([...messages, message])
                  : undefined
              }
              className="text-gray-400 text-xl"
            >
              {message.trim() ? <FaPaperPlane /> : <FaMicrophone />}
            </button>
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-400">
            Select a chat to view the conversation.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatContent;
