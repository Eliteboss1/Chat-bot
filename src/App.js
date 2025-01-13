import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./App.css";
import ChatHistory from "./component/ChatHistory";
import Loading from "./component/Loading";
import { SunIcon, MoonIcon } from "@heroicons/react/outline";

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const genAI = new GoogleGenerativeAI(
    "AIzaSyCNksZaDWxqWemeIpJQPfG3wHGiHyouu4A"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    setIsLoading(true);
    try {
      const result = await model.generateContent(userInput);
      const response = await result.response;

      setChatHistory([
        ...chatHistory,
        { type: "user", message: userInput },
        { type: "bot", message: response.text() },
      ]);
    } catch {
      console.error("Error sending message");
    } finally {
      setUserInput("");
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <div
      className={`container mx-auto px-4 py-8 transition-all duration-500 ${
        isDarkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-b from-cyan-100 to-cyan-400 text-gray-900"
      }`}
    >
      <header className="flex  gap-20 justify-between items-center ">
        <h1 className="text-3xl font-bold">Cipher Bot</h1>
        <div
          onClick={toggleTheme}
          className="cursor-pointer p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
        >
          {isDarkMode ? (
            <SunIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <MoonIcon className="h-6 w-6 text-blue-500" />
          )}
        </div>
      </header>

      <p className="text-center pt-6 mb-4 text-4xl font-bold ">
        Hello! Please enter your question:
      </p>

      <div className="flex mb-4 pt-20">
        <input
          type="text"
          className={`flex-grow px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
              : "bg-white border-gray-300 text-black focus:ring-blue-500"
          }`}
          placeholder="Type your message..."
          value={userInput}
          onChange={handleUserInput}
        />
        <button
          className={`px-4 py-2 ml-2 rounded-lg ${
            isLoading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
          onClick={sendMessage}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>

      <div className="chat-container rounded-lg shadow-md p-4 mb-4">
        <ChatHistory chatHistory={chatHistory} />
        <Loading isLoading={isLoading} />
      </div>

      <button
        className={`mt-4 block px-4 py-2 rounded-lg ${
          isDarkMode
            ? "bg-black hover:bg-blue-500 text-white"
            : "bg-black hover:bg-blue-600 text-white"
        }`}
        onClick={clearChat}
      >
        Clear Chat
      </button>
    </div>
  );
};

export default App;
