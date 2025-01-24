import React, { useRef, useState } from "react";
import {
  FaPaperclip,
  FaSmile,
  FaPaperPlane,
  FaMicrophone,
  FaChevronLeft,
  FaImage,
  FaFileAlt,
  FaTimes,
} from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import "./chatpage.css";
import { ReactMediaRecorder } from "react-media-recorder";

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
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const formatFileSize = (size) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (size === 0) return "0 Bytes";
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const cancelFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSend = () => {
    if (message.trim() || selectedFile) {
      const newMessages = [...messages];

      if (recordedAudio) {
        newMessages.push({
          type: "audio",
          content: recordedAudio,
          caption: message.trim() || null,
        });
        setRecordedAudio(null);
        setMessages(newMessages);
      }
      // Add media file with optional caption
      if (selectedFile) {
        const fileType = selectedFile.type.startsWith("image/")
          ? "image"
          : selectedFile.type.startsWith("video/")
          ? "video"
          : "file";

        newMessages.push({
          type: fileType,
          content: previewUrl,
          caption: message.trim() || null,
          name: selectedFile.name, // Optional for files
        });

        cancelFile();
        setMessage(""); // Clear input
      } else if (message.trim()) {
        // Add text-only message
        newMessages.push({ type: "text", content: message.trim() });
        setMessage("");
      }

      setMessages(newMessages);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && (message.trim() || recordedAudio)) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleAudioStop = (blobUrl) => {
    setRecordedAudio(blobUrl);
    setIsRecording(false);

    // Add audio to messages
    const newMessages = [
      ...messages,
      { type: "audio", content: blobUrl, caption: null },
    ];
    setMessages(newMessages);
  };

  return (
    <div
      className={`flex-1 ${
        activeChat === null ? "hidden" : "block"
      } md:block bg-gray-800`}
    >
      {activeChat ? (
        <div className="h-full flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-bold">{activeChat}</h2>
            <button
              onClick={() => setActiveChat(null)}
              className="p-2 text-gray-400 bg-gray-700 rounded-full hover:bg-gray-600"
            >
              <FaChevronLeft />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto ">
            {messages.map((msg, index) => (
              <div key={index} className="mb-3 flex items-right justify-end">
                {msg.type === "text" && (
                  <p className="bg-gray-700 text-white px-4 text-sm py-1 rounded-tl-lg rounded-bl-lg rounded-tr-[20px] max-w-xs ">
                    {msg.content}
                    {/**rounded-tr-lg rounded-br-lg rounded-tl-[20px] */}
                  </p>
                )}
                {msg.type === "image" && (
                  <div className="space-y-2">
                    <img
                      src={msg.content}
                      alt="Sent"
                      className="w-40 h-40 object-cover rounded-lg"
                    />
                    {msg.caption && (
                      <p className="text-sm text-gray-300">{msg.caption}</p>
                    )}
                  </div>
                )}
                {msg.type === "video" && (
                  <div className="space-y-2">
                    <video
                      src={msg.content}
                      className="w-40 h-40 rounded-lg"
                      controls
                    />
                    {msg.caption && (
                      <p className="text-sm text-gray-300">{msg.caption}</p>
                    )}
                  </div>
                )}
                {msg.type === "audio" && (
                  <audio controls className="w-40 h-10 rounded-lg">
                    <source src={msg.content} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                )}
                {msg.type === "file" && (
                  <div className="flex flex-col  space-y-2">
                    <a
                      href={msg.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-700 w-48 h-24 flex items-center justify-center rounded-lg cursor-pointer"
                    >
                      <FaFileAlt className="text-white text-2xl" />
                    </a>
                    <h3 className="text-sm font-mono">{msg.name}</h3>
                    {msg.caption && (
                      <p className="text-sm text-gray-300">{msg.caption}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* File Preview */}
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
                {!selectedFile.type.startsWith("image/") &&
                  !selectedFile.type.startsWith("video/") && (
                    <div className="text-white flex flex-col items-center space-y-2">
                      <FaFileAlt className="text-4xl" />
                      <p className="text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-gray-400">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Message Input */}
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
              className="flex-1 px-4 py-2  text-sm bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none"
              onKeyDown={handleKeyPress}
            />
            {message.trim() ? (
              <button onClick={handleSend} className="text-gray-400 text-xl">
                <FaPaperPlane />
              </button>
            ) : (
              <ReactMediaRecorder
                audio
                render={({ startRecording, stopRecording }) => (
                  <>
                    <button
                      onClick={() => {
                        if (!isRecording) {
                          setIsRecording(true);
                          startRecording();
                        } else {
                          stopRecording();
                        }
                      }}
                      className="text-gray-400 text-xl"
                    >
                      <FaMicrophone
                        className={isRecording ? "text-red-500" : ""}
                      />
                    </button>
                  </>
                )}
                onStop={handleAudioStop}
              ></ReactMediaRecorder>
            )}
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
