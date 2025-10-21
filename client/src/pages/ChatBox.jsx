 import React, { useEffect, useRef, useState } from "react";
import { dummyMessagesData, dummyUserData } from "../assets/assets";
import { ImageIcon, SendHorizonal, X } from "lucide-react";

const ChatBox = () => {
  const messages = dummyMessagesData;
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [user, setUser] = useState(dummyUserData);
  const messagesEndRef = useRef(null);

  const sendMessge = async () => {
    // Logic unchanged
    // After sending, clear the images preview
    setImages([]);
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages(prev => [...prev, ...files]);
    }
    // Reset input value to allow selecting same files again
    e.target.value = '';
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    user && (
      <div className="flex flex-col h-screen bg-gradient-to-b from-white via-blue-50 to-red-50">
        {/* Header */}
        <header className="sticky top-0 flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-md shadow-md z-10 border-b border-gray-200">
          <div className="relative">
            <img
              src={user.profile_picture}
              alt={user.full_name}
              className="h-12 w-12 rounded-full border border-gray-300 object-cover shadow-sm"
            />
            {/* Online Status Dot */}
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>
          <div>
            <h2 className="font-bold text-gray-800 text-lg">{user.full_name}</h2>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              @{user.username}
              <span className="text-green-600 text-xs font-medium">• online</span>
            </p>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-12 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="max-w-2xl mx-auto">
            {messages
              .toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((message, index) => {
                const isUser = message.to_user_id === user._id;
                const profilePic = isUser
                  ? user.profile_picture
                  : dummyUserData.profile_picture;

                // Check if previous message is from same sender for grouping
                const prevMessage = index > 0 ? messages[index - 1] : null;
                const isSameSender = prevMessage && prevMessage.to_user_id === message.to_user_id;
                const messageGap = isSameSender ? "mt-1" : "mt-4";

                return (
                  <div
                    key={index}
                    className={`flex items-end gap-2 ${messageGap} ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Profile Image */}
                    {!isUser && (
                      <img
                        src={profilePic}
                        alt="sender"
                        className={`h-8 w-8 rounded-full border border-gray-200 object-cover shadow-sm ${
                          isSameSender ? "invisible" : "visible"
                        }`}
                      />
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`relative group max-w-xs md:max-w-sm lg:max-w-md break-words rounded-2xl shadow-lg transition-all duration-300 ${
                        isUser
                          ? "bg-gradient-to-tr from-blue-500 to-red-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                      }`}
                    >
                      {message.message_type === "image" && (
                        <div className="p-0">
                          <img
                            src={message.media_url}
                            alt="attachment"
                            className={`rounded-t-2xl w-full object-cover max-h-80 border-[3px] ${
                              isUser 
                                ? "border-transparent bg-gradient-to-tr from-blue-500 to-red-500 rounded-xl" 
                                : "border-gray-100 rounded-xl"
                            }`}
                          />
                          {message.text && (
                            <div className="p-3">
                              <p className="text-sm md:text-base">{message.text}</p>
                            </div>
                          )}
                        </div>
                      )}
                      {message.message_type !== "image" && (
                        <div className="p-3">
                          <p className="text-sm md:text-base">{message.text}</p>
                        </div>
                      )}
                      <span
                        className={`absolute bottom-1 text-[10px] opacity-70 transition-all duration-200 ${
                          isUser ? "-left-7" : "-right-7"
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Profile Image for User */}
                    {isUser && (
                      <img
                        src={profilePic}
                        alt="you"
                        className={`h-8 w-8 rounded-full border border-gray-200 object-cover shadow-sm ${
                          isSameSender ? "invisible" : "visible"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Images Preview */}
        {images.length > 0 && (
          <div className={`px-4 border-t border-gray-200 bg-white/80 backdrop-blur-md ${
            images.length === 1 ? 'py-2' : 'py-3'
          }`}>
            <div className="max-w-2xl mx-auto">
              <div className={`flex items-center justify-between ${
                images.length === 1 ? 'mb-2' : 'mb-3'
              }`}>
                <span className="text-sm font-medium text-gray-700">
                  {images.length} {images.length === 1 ? 'image' : 'images'} selected
                </span>
                <button
                  onClick={() => setImages([])}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className={`flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 ${
                images.length === 1 ? 'pb-1' : 'pb-2'
              }`}>
                {images.map((image, index) => (
                  <div key={index} className="relative flex-shrink-0">
                    <div className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        className="h-20 w-20 rounded-xl object-cover border-[3px] border-transparent bg-gradient-to-br from-blue-500 to-red-500 shadow-sm"
                        alt={`preview-${index}`}
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full shadow-md hover:bg-red-600 transition-all duration-200 border-2 border-white"
                      >
                        <X size={10} className="text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {text && (
                <div className={`bg-gray-50 rounded-lg border border-gray-200 ${
                  images.length === 1 ? 'mt-2 p-2' : 'mt-3 p-3'
                }`}>
                  <p className="text-sm text-gray-800">{text}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Input */}
        <footer className="px-4 py-4 border-t border-gray-200 bg-white/90 backdrop-blur-md shadow-inner">
          <div className="flex items-center gap-3 max-w-2xl mx-auto bg-white border border-gray-200 rounded-full px-4 py-2 shadow-md focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm md:text-base"
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessge()}
              onChange={(e) => setText(e.target.value)}
              value={text}
            />

            <label htmlFor="image" className="cursor-pointer">
              <ImageIcon className="h-6 w-6 text-gray-400 hover:text-blue-500 transition" />
              <input
                type="file"
                id="image"
                accept="image/*"
                hidden
                multiple
                onChange={handleImageSelect}
              />
            </label>

            <button
              onClick={sendMessge}
              className="p-2.5 bg-gradient-to-br from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 active:scale-95 transition text-white rounded-full shadow"
            >
              <SendHorizonal size={18} />
            </button>
          </div>
        </footer>
      </div>
    )
  );
};

export default ChatBox;