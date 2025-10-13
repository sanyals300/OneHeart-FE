import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [socket, setSocket] = useState(null); // ADDED: State to hold the single socket instance
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  // Fetch initial chat messages
  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get("/api" + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      const chatMessages = chat?.data?.messages.map((msg) => {
        const { senderId, text, createdAt } = msg;
        return {
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          senderId: senderId?._id,
          text,
          time: new Date(createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      });

      setMessages(chatMessages);

      if (chatMessages.length > 0) {
        const firstOtherMessage = chatMessages.find(
          (msg) => msg.senderId !== userId
        );
        if (firstOtherMessage) {
          setTargetUser({
            firstName: firstOtherMessage.firstName,
            lastName: firstOtherMessage.lastName,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, [targetUserId]);

  // Establish and manage the socket connection
  useEffect(() => {
    if (!userId) {
      return;
    }

    const newSocket = createSocketConnection();
    setSocket(newSocket); // ADDED: Store the created socket in state

    newSocket.on("connect", () => {
      console.log("✅ Connected to socket");
      setIsConnected(true);
    });

    // Join chat room
    newSocket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    // Listen for incoming messages (from anyone, including yourself)
    newSocket.on(
      "messageReceived",
      ({ firstName, lastName, text, senderId }) => {
        console.log(firstName + " : " + text);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            firstName,
            lastName,
            text,
            senderId,
            time: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    );

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from socket");
      setIsConnected(false);
    });

    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    // CHANGED: Use the socket instance from state
    if (!socket || !newMessage.trim()) return;

    const messageData = {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    };

    socket.emit("sendMessage", messageData);

    // REMOVED: The optimistic UI update is no longer here.
    // The 'messageReceived' listener above will now handle adding the message
    // to the UI when it comes back from the server.

    setNewMessage(""); // Only clear the input field
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4">
      <div className="relative flex flex-col h-[500px] w-full max-w-2xl bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Subtle inner glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"></div>

        {/* Chat Header */}
        <div className="relative p-5 border-b border-white/20 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-white/30 shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {targetUser?.firstName?.charAt(0) ||
                    user?.firstName?.charAt(0)}
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">
                  {targetUser
                    ? `${targetUser.firstName} ${targetUser.lastName}`
                    : "Chat"}
                </h1>
              </div>
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
                }`}
              ></div>
              <span className="text-xs text-white/60">
                {isConnected ? "Connected" : "Connecting..."}
              </span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 px-6 py-5 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-white/40 text-sm">
                No messages yet. Start the conversation! 💬
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMyMessage =
                msg.senderId === userId || msg.firstName === user.firstName;

              return (
                <div
                  key={index}
                  className={`flex items-end gap-3 ${
                    isMyMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Avatar for other user's messages */}
                  {!isMyMessage && (
                    <div className="w-8 h-8 rounded-full border border-white/30 flex-shrink-0 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                      {msg.firstName?.charAt(0)}
                    </div>
                  )}

                  <div
                    className={`flex flex-col ${
                      isMyMessage ? "items-end" : "items-start"
                    }`}
                  >
                    {/* Message bubble */}
                    <div
                      className={`max-w-sm px-4 py-3 shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                        isMyMessage
                          ? "bg-white/20 backdrop-blur-md text-white rounded-3xl rounded-br-md border border-white/30"
                          : "bg-white/15 backdrop-blur-md text-white rounded-3xl rounded-bl-md border border-white/25"
                      }`}
                    >
                      {/* Sender name for group chats */}
                      {!isMyMessage && (
                        <p className="text-xs text-white/60 mb-1 font-medium">
                          {msg.firstName} {msg.lastName}
                        </p>
                      )}
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>

                    {/* Timestamp */}
                    <span className="text-xs text-white/50 mt-1 px-2">
                      {msg.time || "Just now"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Area */}
        <div className="p-5 border-t border-white/20 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isConnected ? "Type your message..." : "Connecting..."
              }
              disabled={!isConnected}
              className="flex-1 bg-white/10 text-white placeholder-white/50 px-5 py-3.5 rounded-full border border-white/20 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={sendMessage}
              disabled={!isConnected || !newMessage.trim()}
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center shadow-lg border border-white/30 transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Your custom styles remain unchanged */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Chat;
