"use client";
import React, { useState, useEffect, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { SendHorizonalIcon } from "lucide-react";
import Lottie from "react-lottie";
import ChatLoader from "../../../public/chatLoader.json"; // Adjust the path to your ChatLoader.json file
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format, set } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { db } from "@/firebase/firebase";
import { collection, addDoc,serverTimestamp  } from "firebase/firestore";


const initialChat = [
  {
    username: "Supervisor",
    isAgent: true,
    parentAgent: "Query",
    content: "Hello, how can I help you today?",
    thought: "I am here to help you with your queries.",
    isUser: false,
    verdict: "passing to next agent",
  },
  {
    username: "Finance",
    isAgent: true,
    parentAgent: "Supervisor",
    content: "Try checking the server configurations.",
    thought: "I am here to help you with your queries.",
    isUser: false,
    verdict: "passing to next agent",
  },
  {
    username: "Budget Advisor",
    isAgent: false,
    parentAgent: "Finance",
    content: "Yes, James is right. Let's check that as well.",
    thought: "I am here to help you with your queries.",
    isUser: false,
    verdict: "passing to next agent",
  },
  {
    username: "Stock analysor",
    isAgent: false,
    parentAgent: "Finance",
    content: "I think there might be an issue with our CDN configuration.",
    thought: "I am here to help you with your queries.",
    isUser: false,
    verdict: "passing to next agent",
  },
  {
    username: "Math",
    isAgent: true,
    parentAgent: "Supervisor",
    content: "I think there might be an issue with our CDN configuration.",
    thought: "I am here to help you with your queries.",
    isUser: false,
    verdict: "passing to next agent",
  },
  {
    username: "calculator",
    isAgent: false,
    parentAgent: "Math",
    content: "I think there might be an issue with our CDN configuration.",
    thought: "I am here to help you with your queries.",
    isUser: false,
    verdict: "passing to next agent",
  },
  {
    username: "statistics",
    isAgent: false,
    parentAgent: "Math",
    content: "I think there might be an issue with our CDN configuration.",
    thought: "I am here to help you with your queries.",
    isUser: false,
    verdict: "passing to next agent",
  },
  {
    username: "Research",
    isAgent: true,
    parentAgent: "Supervisor",
    content: "I think there might be an issue with our CDN configuration.",
    thought: "I am here to help you with your queries.",
    isUser: false,
    verdict: "passing to next agent",
  },
  {
    username: "pdf",
    isAgent: false,
    parentAgent: "Research",
    content: "I think there might be an issue with our CDN configuration.",
    thought: "I am here to help you with your queries.",
    isUser: false,
    verdict: "passing to next agent",
  },
  {
    username: "News Updator",
    isAgent: false,
    parentAgent: "Research",
    content: "Deployment error fixed. Good job, team!",
    thought: "I am here to help you with your queries.",
    isUser: false,
    verdict: "passing to next agent",
  },
];

export default function AiChat({
  type,
  onButtonClick,
  onChatUpdate,
  saveSignal,
  handleDoneSaveChat
}: {
  type: string;
  onButtonClick: () => void;
  onChatUpdate: (chat: any[]) => void;
  saveSignal: boolean;
  handleDoneSaveChat: () => void;
}) {
  const [newMessage, setNewMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    {
      id: number;
      timestamp: number;
      username: string;
      isAgent: boolean;
      parentAgent: string | null;
      content: string;
      thought: string;
      isUser: boolean;
      verdict: string;
      avatar?: string;
    }[]
  >([]);
  const [chatIndex, setChatIndex] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState(initialChat);
  const [socketID, setSocketId] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);


  const saveChatToFirestore = async () => {
    try {
      // Reference the "chatHistories" collection
      const chatCollection = collection(db, "chatHistories");
  
      // Add the chat history to Firestore
      await addDoc(chatCollection, {
        history: chatHistory, // Chat history as an array of objects
        servertimestamp: serverTimestamp(), // Use Firestore's server timestamp
      });
  
      console.log("Chat history saved successfully!");
    } catch (error) {
      console.error("Error saving chat history:", error);
    } finally {
      handleDoneSaveChat();
      console.log("Save Chat done");
    }
  };

  // Function to handle sending messages
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    onButtonClick();
    onChatUpdate(chat);

    const message = {
      id: chatHistory.length + 1,
      content: newMessage,
      timestamp: new Date().getTime(),
      isUser: true,
      username: "You",
      isAgent: false,
      parentAgent: null,
      thought: "",
      verdict: "",
    };
    setChatHistory([...chatHistory, message]);
    setNewMessage("");
    if (!socket) {
      const newSocket = io("http://172.30.2.194:5000", {
        withCredentials: true,
      });
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Connected to socket server:", newSocket.id);
      });

      // Send the message
      newSocket.emit("simulate-chat", { query: newMessage });

      newSocket.on("update", (data) => {
        console.log("Incoming data", data);

        // Add the incoming object to the chat history
        setChatHistory((prevChat) => [
          ...prevChat,
          {
            id: prevChat.length + 1,
            username: data.username,
            isAgent: data.isAgent,
            parentAgent: data.parentAgent,
            content: data.content,
            thought: data.thought,
            isUser: false,
            verdict: data.verdict,
            timestamp: new Date().getTime(),
          },
        ]);
      });

      // newSocket.on("disconnect", () => {
      //   console.log("Disconnected from socket server");
      // });
    } else {
      // Send the message
      console.log("##############################################");
      socket.emit("simulate-chat", { query: newMessage });
      socket.on("update", (data) => {
        console.log("Incoming data", data);

        // Add the incoming object to the chat history
        setChatHistory((prevChat) => [
          ...prevChat,
          {
            id: prevChat.length + 1,
            username: data.username,
            isAgent: data.isAgent,
            parentAgent: data.parentAgent,
            content: data.content,
            thought: data.thought,
            isUser: false,
            verdict: data.verdict,
            timestamp: new Date().getTime(),
          },
        ]);
      });
    }
  };

  // Effect for simulating initialChat responses
  useEffect(() => {
    if (saveSignal) {
      saveChatToFirestore();
    }

    return () => {};
  }, [chatHistory, chatIndex, socket, saveSignal]);

  return (
    <div className="flex flex-col w-[700px] border-transparent bg-white/20 backdrop-blur-lg rounded-lg mr-auto ml-5  h-screen">
      <div className="p-4 space-y-4 flex flex-col  overflow-auto overflow-y-scroll  mb-36 h h-screen">
        {chatHistory.map((msg) => (
          <div>
            <div
              key={msg.id}
              className={`flex ${
                msg.isUser ? "justify-end" : "justify-start"
              } items-end space-x-2`}
            >
              {!msg.isUser && (
                <img
                  src="/coin.png"
                  alt="avatar"
                  className="w-10 object-cover h-10 rounded-full"
                />
              )}
              <div
                className={`rounded-xl px-4 py-2 shadow-2xl shadow-[#131213] ${
                  msg.isUser
                    ? "bg-purple-800 text-white"
                    : "bg-black text-white"
                }`}
              >
                <div className="flex flex-row gap-2 ">
                  <p className="font-bold flex">{msg.username}</p>
                  <span className="flex rounded-md">
                    {msg.isAgent ? (
                      <Badge variant="secondary" className="rounded-md">
                        Agent
                      </Badge>
                    ) : (
                      <span>
                        {!msg.isUser ? (
                          <Badge variant="secondary" className="rounded-md">
                            {msg.parentAgent}'s Tool
                          </Badge>
                        ) : (
                          <div></div>
                        )}
                      </span>
                    )}
                  </span>
                </div>
                <p>{msg.content}</p>
                {!msg.isUser && msg.thought && (
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="font-semibold">
                        Thought
                      </AccordionTrigger>
                      <AccordionContent>{msg.thought}</AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
                <p className="text-xs mt-1">
                  {format(new Date(msg.timestamp), "p")}
                </p>
                {/* {format(new Date(msg.timestamp), 'p')} */}
              </div>
            </div>
            <div>
              {loading && !msg.isUser ? (
                <div className="flex flex-row items-center justify-center">
                  <div className="flex">
                    <Lottie
                      options={{
                        loop: true,
                        autoplay: true,
                        animationData: ChatLoader,
                      }}
                      height={50}
                      width={50}
                    />
                  </div>
                  <p className="flex text-gray-400 text-center justify-center">
                    {msg.verdict} {" ..."}
                  </p>
                </div>
              ) : (
                <p className="flex text-gray-400 text-center justify-center my-2">
                  {msg.verdict}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t-2 border-black  sticky bottom-0 flex">
        <input
          className="flex-grow p-2 mr-4 border-gray-500 rounded bg-black text-white"
          placeholder="Type your message here…"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="py-2 px-6 bg-purple-900 text-white rounded hover:bg-blue-600 transition duration-150"
          disabled={!newMessage.trim()}
          onClick={sendMessage}
        >
          <SendHorizonalIcon />
        </button>
      </div>
    </div>
  );
}
