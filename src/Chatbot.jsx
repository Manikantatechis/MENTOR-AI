import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;

    setIsLoading(true); // Start loading

    // Call GPT-4 API
    const response = await fetchResponse(input);
    setResponses([
      { role: "user", content: input },
      { role: "bot", content: response },
    ]);
    setInput("");

    setIsLoading(false); // End loading
  };

  const fetchResponse = async (query) => {
    try {
      const data = {
        model: "gpt-4",
        messages: [{ role: "user", content: query }],
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      };

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        data,
        { headers }
      );
      const formattedResponse = response.data.choices[0].message.content;
      // You can add more formatting or parsing here if needed
      return formattedResponse.split("\n").filter((line) => line);
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      return ["Error occurred while fetching response."];
    }
  };

  return (
    <>
      {isLoading && <div className="loader"></div>}
      <div className="chat-container">
        <form onSubmit={handleSubmit} className="chat-form">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            className="chat-input"
          />
          <button
            type="submit"
            disabled={isLoading ? true : false}
            className="chat-submit"
          >
            Send
          </button>
        </form>
        <div className="chat-messages">
          {responses.map((res, index) => (
            <div key={index} className={`chat-message ${res.role}`}>
              <strong>{res.role === "user" ? "You:" : "Bot:"}</strong>
              {/* Render each part of the response */}
              {typeof res.content === "string" ? (
                <div>{res.content}</div>
              ) : (
                res.content.map((part, partIndex) => (
                  <div key={partIndex}>{part}</div>
                ))
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Chatbot;
