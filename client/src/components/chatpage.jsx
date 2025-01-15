import React, { useState, useRef, useEffect } from "react";
import {
  FaPaperPlane,
  FaMicrophone,
  FaSmile,
  FaPaperclip,
  FaCamera,
  FaFile,
  FaImage,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const ChatPage = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  const attachMenuRef = useRef(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, message]);
      setMessage("");
    }
  };

  const handleStartRecording = () => setIsRecording(true);
  const handleStopRecording = () => {
    setIsRecording(false);
    setMessage("Audio recorded");
  };

  const toggleAttachMenu = () => setIsAttachMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobileView && activeChat === null) {
      setActiveChat("Chat 1"); // Default chat on desktop view
    }
  }, [isMobileView, activeChat]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        attachMenuRef.current &&
        !attachMenuRef.current.contains(event.target)
      ) {
        setIsAttachMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div
        className={`${
          activeChat === null ? "block" : "hidden"
        } md:block bg-gray-100 transition-all duration-300 ${
          isLeftCollapsed ? "w-20" : "w-9/20 sm:w-1/2 md:w-1/3"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 flex justify-between items-center border-b bg-white">
            <h2 className="text-lg font-bold">Let's Talk</h2>
            <button
              onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
              className="p-2 text-gray-600 rounded-full hover:bg-gray-300"
            >
              {isLeftCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          </div>

          {/* Chat List */}
          <ul className="flex-1 overflow-y-auto">
            {Array.from({ length: 20 }, (_, index) => (
              <li
                key={index}
                onClick={() => {
                  setActiveChat(`Chat ${index + 1}`);
                  setMessages([]);
                }}
                className="p-4 cursor-pointer hover:bg-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-400 rounded-full overflow-hidden">
                    <img
                      src="https://via.placeholder.com/100"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
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

      {/* Chat Content */}
      <div
        className={`flex-1 bg-white ${
          activeChat === null ? "hidden" : "block"
        } md:block`}
      >
        {activeChat ? (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b bg-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold">{activeChat}</h2>
              {isMobileView && (
                <button
                  onClick={() => setActiveChat(null)}
                  className="p-2 text-gray-600 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  <FaChevronLeft />
                </button>
              )}
            </div>
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
            <div className="p-4 border-t bg-gray-100 flex items-center space-x-2 relative">
              <div className="relative" ref={attachMenuRef}>
                <button
                  onClick={toggleAttachMenu}
                  className="text-gray-600 text-xl"
                >
                  <FaPaperclip />
                </button>
                {isAttachMenuOpen && (
                  <div className="absolute bottom-10 left-0 bg-white shadow-md rounded-lg p-2 space-y-2">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FaImage className="mr-2" />
                      Photo & Videos
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FaCamera className="mr-2" />
                      Camera
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FaFile className="mr-2" />
                      Document
                    </button>
                  </div>
                )}
              </div>
              <button className="text-gray-600 text-xl">
                <FaSmile />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none"
              />
              <button
                onClick={message.trim() ? handleSendMessage : undefined}
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
