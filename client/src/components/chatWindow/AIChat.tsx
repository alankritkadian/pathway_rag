"use client";
import React, { useState, useEffect } from "react";
import { SendHorizonalIcon } from "lucide-react";
import Lottie from "react-lottie";
import ChatLoader from "../../../public/chatLoader.json"; // Adjust the path to your ChatLoader.json file
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const chat = [
  {
    username: "Supervisor",
    isAgent: true,
    parentAgent: null,
    content: "Hello, how can I help you today?",
    thought: "I am here to help you with your queries.",
    isUser: false,
    verdict: "passing to next agent",
  },
  {
    username: "Finance",
    isAgent: true,
    parentAgent: "supervisor",
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
    parentAgent: "supervisor",
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
    username: "Researcher",
    isAgent: true,
    parentAgent: "supervisor",
    content: "I think there might be an issue with our CDN configuration.",
    thought: "I am here to help you with your queries.",
    isUser: false,
    verdict: "passing to next agent",
  },
  {
    username: "pdf",
    isAgent: false,
    parentAgent: "Researcher",
    content: "I think there might be an issue with our CDN configuration.",
    thought: "I am here to help you with your queries.",
    isUser: false,
    verdict: "passing to next agent",
  },
  {
    username: "News Updator",
    isAgent: false,
    parentAgent: "Researcher",
    content: "Deployment error fixed. Good job, team!",
    thought: "I am here to help you with your queries.",
    isUser: false,
    verdict: "passing to next agent",
  },
];

export default function AiChat() {
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

  // Function to handle sending messages
  const sendMessage = () => {
    if (!newMessage.trim()) return;
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
    setUserInteracted(true);
    if (!simulationStarted) {
      setSimulationStarted(true);
    }
  };
  console.log(chatHistory);

  // Effect for simulating chat responses
  useEffect(() => {
    if (!simulationStarted || (chatIndex >= chat.length && !userInteracted))
      return;

    setLoading(true);
    const timer = setTimeout(() => {
      if (!userInteracted && chatIndex < chat.length) {
        setChatHistory((ch) => [
          ...ch,
          {
            ...chat[chatIndex],
            id: ch.length + 1,
            timestamp: new Date().getTime(),
          },
        ]);
        setChatIndex(chatIndex + 1);
      }
      setUserInteracted(false);
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [chatHistory, chatIndex, userInteracted, simulationStarted]);

  return (
    <div className="flex flex-col w-[700px] border-transparent bg-white/20 backdrop-blur-lg rounded-lg mr-auto ml-5  h-screen">
      <div className="p-4 space-y-4 flex flex-col  overflow-auto overflow-y-scroll mb-36 ">
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
                      <AccordionTrigger className="font-semibold">Thought</AccordionTrigger>
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
