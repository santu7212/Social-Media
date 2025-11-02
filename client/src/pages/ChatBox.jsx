 import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { ImageIcon, SendHorizonal, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import {
  addMessage,
  fetchMessages,
  resetMessages,
} from "../features/messages/messagesSlice";

const ChatBox = () => {
  const { messages } = useSelector((state) => state.messages);
  const { userId } = useParams();
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const connections = useSelector((state) => state.connections.connections);

  const fetchUserMessages = async () => {
    try {
      const token = await getToken();
      dispatch(fetchMessages({ token, userId }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendMessage = async () => {
    try {
      if (!text && !image) return;

      const token = await getToken();
      const formdata = new FormData();
      formdata.append("to_user_id", userId);
      formdata.append("text", text);
      if (image) formdata.append("image", image);

      const { data } = await api.post("/api/message/send-message", formdata, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setText("");
        setImage(null);
        dispatch(addMessage(data.message));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (connections.length > 0) {
      const foundUser = connections.find(
        (connection) => connection._id === userId
      );
      setUser(foundUser);
    }
  }, [connections, userId]);

  useEffect(() => {
    fetchUserMessages();
    return () => dispatch(resetMessages());
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    user && (
      <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-red-50">
        {/* HEADER */}
        <div
          className="flex items-center gap-3 p-3 md:px-10 xl:pl-42
          bg-gradient-to-r from-blue-200 via-pink-100 to-red-200
          border-b border-gray-200 shadow-md backdrop-blur-md"
        >
          <img
            src={user.profile_picture}
            alt="User avatar"
            className="size-10 rounded-full border-2 border-white shadow-sm"
          />
          <div>
            <p className="font-semibold text-slate-800">{user.full_name}</p>
            <p className="text-sm text-gray-600">@{user.username}</p>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-5 md:px-10 overflow-y-scroll">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages
              .toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((message, index) => {
                const isSent = message.to_user_id === user._id;
                const isImage = message.message_type === "image";

                const formattedTime = new Date(
                  message.createdAt
                ).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                });

                return (
                  <div
                    key={index}
                    className={`flex flex-col ${
                      isSent ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`p-3 text-sm max-w-sm rounded-2xl shadow ${
                        isImage
                          ? "bg-transparent border-2 border-transparent bg-clip-padding [border-image:linear-gradient(to_right,#2563EB,#EF4444)_1] text-slate-700"
                          : isSent
                          ? "bg-gradient-to-r from-blue-500 to-red-500 text-white rounded-br-none"
                          : "bg-white text-slate-700 border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      {isImage && (
                        <div className="overflow-hidden rounded-xl">
                          <img
                            src={message.media_url}
                            className="w-full max-w-sm object-contain"
                            alt="Sent media"
                          />
                        </div>
                      )}
                      {message.text && <p className="mt-1">{message.text}</p>}
                    </div>

                    <p
                      className={`text-xs text-gray-500 mt-1 ${
                        isSent ? "text-right pr-2" : "text-left pl-2"
                      }`}
                    >
                      {formattedTime}
                    </p>
                  </div>
                );
              })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* INPUT BAR */}
        <div className="px-4 py-3 border-t border-gray-200 bg-white">
          <div className="flex flex-col w-full max-w-xl mx-auto">
            {image && (
              <div className="relative mb-3 w-fit mx-auto">
                <img
                  src={URL.createObjectURL(image)}
                  className="max-h-60 rounded-2xl shadow-md object-contain border-2 border-transparent bg-clip-padding [border-image:linear-gradient(to_right,#2563EB,#EF4444)_1]"
                  alt="Selected preview"
                />
                <button
                  onClick={() => setImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-3 pl-5 p-2 bg-gradient-to-r from-blue-50 to-red-50 border border-gray-200 rounded-full shadow">
              <input
                type="text"
                className="flex-1 outline-none bg-transparent text-slate-700 placeholder:text-gray-500"
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                onChange={(e) => setText(e.target.value)}
                value={text}
              />
              <label htmlFor="image">
                <ImageIcon className="size-6 text-blue-500 cursor-pointer hover:text-red-500 transition-colors" />
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
              <button
                onClick={sendMessage}
                className="bg-gradient-to-br from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 active:scale-95 transition-transform text-white p-2 rounded-full"
              >
                <SendHorizonal size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ChatBox;
