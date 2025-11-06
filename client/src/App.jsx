 import React, { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import ChatBox from "./pages/ChatBox";
import Connections from "./pages/Connections";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Layout from "./pages/Layout";

import { useUser, useAuth } from "@clerk/clerk-react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { fetchUser } from "./features/user/userSlice";
import { fetchConnections } from "./features/connections/connectionsSlice";
import { addMessage } from "./features/messages/messagesSlice";
import Notification from "./components/Notification";

const App = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { pathname } = useLocation();
  const pathNameRef = useRef(pathname);
  const dispatch = useDispatch();
  const sseRef = useRef(null);  

  // Fetch user connections when logged in
  useEffect(() => {
    const fetchData = async () => {
      if (isLoaded && user) {
        const token = await getToken();
        dispatch(fetchUser(token));
        dispatch(fetchConnections(token));
      }
    };
    fetchData();
  }, [user, isLoaded, getToken, dispatch]);

  // Update ref when route changes
  useEffect(() => {
    pathNameRef.current = pathname;
  }, [pathname]);

  //  Handle Server-Sent Events (live messages)
  useEffect(() => {
    if (!user) return;

    const connectSSE = () => {
      const url = `${import.meta.env.VITE_BASEURL}/api/message/${user.id}`;
      console.log(" Connecting to SSE:", url);

      const eventSource = new EventSource(url, { withCredentials: false });
      sseRef.current = eventSource;

      eventSource.onopen = () => {
        console.log("SSE connected successfully");
      };

      eventSource.onmessage = (event) => {
        if (!event.data) return;

        let message;
        try {
          message = JSON.parse(event.data);
        } catch (err) {
          console.warn("⚠️ Invalid SSE message JSON:", event.data);
          return;
        }

        // Ignore handshake messages
        if (message.message === "Connected to SSE stream") return;

        const senderId =
          message?.from_user_id?._id ??
          message?.from_user_id ??
          message?.sender_id ??
          null;

        if (!senderId) {
          console.warn("⚠️ SSE message missing sender id:", message);
          return;
        }

        // If user is on the chat page with that sender
        if (pathNameRef.current === `/messages/${senderId}`) {
          dispatch(addMessage(message));
        } else {
          // Else show notification
          toast.custom(
            (t) => <Notification t={t} message={message} />,
            { position: "bottom-right" }
          );
        }
      };

      eventSource.onerror = (err) => {
        console.error("❌ SSE error or connection lost:", err);
        eventSource.close();

        // Reconnect automatically after 3 seconds
        setTimeout(() => {
          console.log("♻️ Reconnecting SSE...");
          connectSSE();
        }, 3000);
      };
    };

    connectSSE();

     
    return () => {
      if (sseRef.current) {
        console.log("🔌 Closing SSE connection");
        sseRef.current.close();
      }
    };
  }, [user, dispatch]);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<ChatBox />} />
          <Route path="connections" element={<Connections />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
