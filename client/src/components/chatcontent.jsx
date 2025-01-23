import React, { useRef, useState } from "react";
import {
  FaPaperclip,
  FaSmile,
  FaPaperPlane,
  FaMicrophone,
  FaChevronLeft,
  FaImage,
  FaFileAlt,
  FaCamera,
  FaTimes,
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
  dropUpShare,
  dropUpShareRef,
  setShowDropUpMenu,
  showDropUpMenu,
}) => {
  const fileInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // To store file preview URL

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Generate a preview URL
    }
  };

  const cancelFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null); // Clear the preview URL
  };

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

          {/* Preview Section */}
          {previewUrl && (
            <div className="relative p-4 bg-gray-700 border-t border-gray-600">
              <button
                className="absolute top-2 right-2 text-white bg-gray-800 p-1 rounded-full hover:bg-gray-600"
                onClick={cancelFile}
              >
                <FaTimes />
              </button>
              <div className="flex items-center justify-center w-full">
                {selectedFile.type.startsWith("image/") && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full max-h-96 object-contain rounded-lg"
                  />
                )}
                {selectedFile.type.startsWith("video/") && (
                  <video
                    src={previewUrl}
                    className="w-full max-h-96 rounded-lg"
                    controls
                  />
                )}
                {selectedFile.type.startsWith("application/") && (
                  <div className="text-white text-sm">
                    <FaFileAlt className="text-gray-400 text-3xl mx-auto" />
                    <p className="text-center mt-2">{selectedFile.name}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="p-4 border-t border-gray-700 flex items-center space-x-2 relative">
            <button
              className="text-gray-400 text-xl"
              onClick={() => setShowDropUpMenu(!showDropUpMenu)}
              ref={dropUpShare}
            >
              <FaPaperclip />
            </button>
            {showDropUpMenu && (
              <div
                ref={dropUpShareRef}
                className="absolute bottom-16 left-0 bg-gray-700 rounded-lg shadow-lg w-56 p-2 space-y-2 z-50"
              >
                <div
                  className="flex items-center text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-600 cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                >
                  <FaImage className="mr-2" /> Photos and Videos
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,video/*"
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                />
                <div
                  className="flex items-center text-white px-4 py-2 rounded-lg hover:bg-gray-600 cursor-pointer text-sm"
                  onClick={() => documentInputRef.current.click()}
                >
                  <FaFileAlt className="mr-2" /> Documents
                </div>
                <input
                  type="file"
                  ref={documentInputRef}
                  accept=".pdf,.doc,.docx,.txt"
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                />
              </div>
            )}
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
              onClick={() => {
                if (message.trim()) {
                  setMessages((prevMessages) => [...prevMessages, message]);
                  setMessage("");
                  if (selectedFile) {
                    setMessages((prevMessages) => [
                      ...prevMessages,
                      selectedFile.name,
                    ]);
                    cancelFile();
                  }
                }
              }}
              className="text-gray-400 text-xl"
            >
              <FaPaperPlane />
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
