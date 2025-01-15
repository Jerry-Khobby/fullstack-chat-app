import React, { useState } from "react";
import { FaPaperPlane, FaMicrophone, FaSmile, FaShare } from "react-icons/fa";

const ChatPage = () => {
  const [activeChat, setActiveChat] = useState(null); // Track which chat is open
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false); // Toggle left side collapse
  const [message, setMessage] = useState(""); // Track input message
  const [messages, setMessages] = useState([]); // Track messages for the active chat
  const [isRecording, setIsRecording] = useState(false); // Track if recording

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, message]);
      setMessage(""); // Clear input field after sending
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setMessage("Audio recorded"); // Placeholder text for recorded message
  };

  return (
    <div className="flex h-screen">
      {/* Left Side: Chat List */}
      <div
        className={`${
          activeChat === null ? "block" : "hidden"
        } md:block bg-gray-100 transition-all duration-300 ${
          isLeftCollapsed ? "w-16" : "w-1/3"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 flex justify-between items-center border-b bg-white">
            <h2 className="text-lg font-bold">Let's Talk</h2>
            <button
              onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
              className="p-2 text-sm text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              {isLeftCollapsed ? "Expand" : "Collapse"}
            </button>
          </div>

          {/* Chat List */}
          <ul className="flex-1 overflow-y-auto">
            {Array.from({ length: 20 }, (_, index) => (
              <li
                key={index}
                onClick={() => {
                  setActiveChat(`Chat ${index + 1}`);
                  setMessages([]); // Reset messages for a new chat
                }}
                className="p-4 cursor-pointer hover:bg-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
                  {!isLeftCollapsed && (
                    <div>
                      <p className="font-semibold">User {index + 1}</p>
                      <p className="text-sm text-gray-500">Last message...</p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Side: Chat Details */}
      <div
        className={`flex-1 bg-white ${
          activeChat === null ? "hidden" : "block"
        } md:block`}
      >
        {activeChat ? (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b bg-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold">{activeChat}</h2>
              <button
                onClick={() => setActiveChat(null)}
                className="p-2 text-sm text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Back
              </button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <p
                  key={index}
                  className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg mb-2 w-fit"
                >
                  {msg}
                </p>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-gray-100 flex items-center space-x-2">
              <button className="text-gray-600 text-xl">
                <FaShare />
              </button>
              <button className="text-gray-600 text-xl">
                <FaSmile />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-0"
                style={{ outline: "none" }} // Ensures no outline
              />
              <button
                onClick={message.trim() ? handleSendMessage : undefined}
                onMouseDown={!message.trim() ? handleStartRecording : undefined}
                onMouseUp={!message.trim() ? handleStopRecording : undefined}
                className="text-gray-600 text-xl"
              >
                {message.trim() ? <FaPaperPlane /> : <FaMicrophone />}
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">
              Select a chat to view the conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
