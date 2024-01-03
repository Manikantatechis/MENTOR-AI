import React, { useState } from 'react';
import axios from 'axios'; // If you're using Axios
import DOMPurify from 'dompurify';

function InputArea({ addMessage }) {
  const [input, setInput] = useState('');

  const handleInput = async () => {
    if (!input.trim()) return;  // Prevent empty messages

    // Add the user message to the chat
    addMessage('user', input);

    const data = {
      model: "gpt-3.5-turbo-1106",
      messages: [{ role: "user", content: input }],
      temperature: 0.7,
      max_tokens: 150,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
    };

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        data,
        { headers }
      );

      const botResponse = response.data.choices[0].message.content;

      // Sanitize and add the bot's message to the chat
      const safeHTML = convertToHTML(botResponse);
      addMessage('bot', safeHTML);

    } catch (error) {
      console.error("Error making OpenAI request:", error);
      addMessage('bot', "Sorry, I couldn't understand that.");
    }

    setInput(''); // Clear the input field
  };

  return (
    <div className="input-area">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleInput();
          }
        }}
        placeholder="Enter your message"
      />
      <button onClick={handleInput}>Send</button>
    </div>
  );
}

export default InputArea;




function convertToHTML(text) {
    let htmlLines = [];
    let isCodeBlock = false; // State to track if we are currently in a code block
    let isOrderedList = false; // State to track if we are currently in an ordered list
  
    const lines = text.split("\n");
  
    for (let line of lines) {
      // Check for ordered list items (numbered)
      const orderedListItem = line.trim().match(/^(\d+\.)\s(.*)/);
      if (orderedListItem) {
        if (!isOrderedList) {
          htmlLines.push("<li>");
          isOrderedList = true;
        }
        // Replace inline code within the list item
        const contentWithCode = orderedListItem[2].replace(
          /`([^`]+)`/g,
          "<code>$1</code>"
        );
        htmlLines.push(`<li>${contentWithCode}</li>`);
      } else {
        if (!isCodeBlock) {
          line = line.replace(/`([^`]+)`/g, "<code>$1</code>");
          htmlLines.push(`<p>${line}</p>`);
        }
      }
  
      // Handle code blocks (not likely needed for this specific format but included for completeness)
      if (line.trim().startsWith("```")) {
        if (!isCodeBlock) {
          htmlLines.push("<pre><code>");
        } else {
          htmlLines.push("</code></pre>");
        }
        isCodeBlock = !isCodeBlock; // Toggle the state
      } else if (isCodeBlock) {
        htmlLines.push(`${line}\n`);
      }
    }
  
    // Close any open tags if they were not closed due to missing data
    if (isCodeBlock) {
      htmlLines.push("</code></pre>");
    }
    if (isOrderedList) {
      htmlLines.push("</li>");
    }
  
    return htmlLines.join("");
  }