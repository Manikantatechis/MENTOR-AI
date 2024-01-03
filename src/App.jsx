import "./App.css";
import image from "./assets/img/bot.png";
import { useState, useRef } from "react";
import axios from 'axios'; // If you're using Axios
import DOMPurify from 'dompurify';



function App() {
  const [displayVal, setDisplayVal] = useState("none")
  const humanMessage = useRef();
  const botmessage = useRef();
  const input = useRef();

  const date = new Date();
  const hours = date.getHours();
  const seconds = date.getSeconds();
  const day = date.getDay();
  const month = date.getMonth();
  const year = date.getFullYear();

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [time, setTime] = useState(`${hours}:${seconds}`); //using the useState hook to get the data from the local time and set it to the time variable
  const [dateTime, setDateTime] = useState(
    `${days[day]}, ${months[month]} ${year}`
  ); //using the useState hook to get the data from the local date and set it to the dateTime variable

  const checkStatus = (e) => {
    let isActive = true;
    console.log(dateTime === "Thursday, December 2023")
    if (dateTime === "Thursda, December 2023") {

      //if the dateTime is Thursday, 13 Aug 2022, the bot will be inactive
      isActive = false;
    }
    const status = document.querySelector(".status");
    // selecting the status class
    if (isActive === true) {
      //if the bot is active
      status.innerHTML = "Active";
      status.style.color = "green";
    } else {
      status.innerHTML = "Not Active";
      status.style.color = "red";
    }
  };

  const handleInput = async () => {
    // Get the user's message from the input ref
    const userMessage = input.current.value;
    setDisplayVal("block")
    humanMessage.current.innerText = userMessage
    // Set the bot message to 'Typing...' immediately
    botmessage.current.innerText = "Typing...";
  
    // Define the data payload for the API request
    const data = {
      model: "gpt-3.5-turbo-1106",
      messages: [{ role: "user", content: userMessage }],
      temperature: 0.7, // Adjust based on how deterministic you want the responses
      max_tokens: 150,
    };
  
    // Define the headers for the API request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, // Replace with your actual API key
    };
  
    try {
      // Make the API request to OpenAI
      const response = await axios.post('https://api.openai.com/v1/chat/completions', data, { headers });

      const botResponse = response.data.choices[0].message.content;

      // Convert and sanitize the response
      const formattedResponse = convertToHTML(botResponse);
      const safeHTML = DOMPurify.sanitize(formattedResponse);
  
      // Update the state or ref with the sanitized, formatted HTML
      botmessage.current.innerHTML = safeHTML;  // Or use state management
    } catch (error) {
      // Handle any errors here
      console.error("Error making OpenAI request:", error);
      botmessage.current.innerText = "Sorry, I couldn't understand that.";
    }
  
    // Clear the input field
    input.current.value = '';
  };
  

  return (
    <div className="App" onLoad={checkStatus}>
      <div className="wrapper">
        <div className="content">
          <div className="header">
            <div className="img">
              <img src={image} alt="" />
            </div>
            <div className="right">
              <div className="name">Mentor</div>
              <div className="status">Active</div>
            </div>
          </div>
          <div className="main">
            <div className="main_content">
              
              <div className="messages">
                <div
                  className="bot-message"
                  id="message1"
                  ref={botmessage}
                >Hello how can i help you</div>
                <div
                style={{display:displayVal}}
                  className="human-message"
                  id="message2"
                  ref={humanMessage}
                >N/A</div>
              </div>
            </div>
          </div>
          <div className="bottom">
            <div className="btm">
              <div className="input">
                <input
                  type="text"
                  id="input"
                  placeholder="Enter your message"
                  ref={input}
                  onKeyDown={(e)=>{
                    console.log(e)
                    if(e.key === "Enter"){
                      handleInput()
                    }
                    }}
                />
              </div>
              <div className="btn">
                <button onClick={handleInput}>
                  <i className="fas fa-paper-plane"></i>Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;




function convertToHTML(text) {
  let htmlLines = [];
  let isCodeBlock = false; // State to track if we are currently in a code block
  let isOrderedList = false; // State to track if we are currently in an ordered list

  const lines = text.split('\n');

  for (let line of lines) {
    // Check for ordered list items (numbered)
    const orderedListItem = line.trim().match(/^(\d+\.)\s(.*)/);
    if (orderedListItem) {
      if (!isOrderedList) {
        htmlLines.push('<li>');
        isOrderedList = true;
      }
      // Replace inline code within the list item
      const contentWithCode = orderedListItem[2].replace(/`([^`]+)`/g, '<code>$1</code>');
      htmlLines.push(`<li>${contentWithCode}</li>`);
    } else {
      
      if (!isCodeBlock) {
        line = line.replace(/`([^`]+)`/g, '<code>$1</code>');
        htmlLines.push(`<p>${line}</p>`);
      }
    }

    // Handle code blocks (not likely needed for this specific format but included for completeness)
    if (line.trim().startsWith('```')) {
      if (!isCodeBlock) {
        htmlLines.push('<pre><code>');
      } else {
        htmlLines.push('</code></pre>');
      }
      isCodeBlock = !isCodeBlock; // Toggle the state
    } else if (isCodeBlock) {
      htmlLines.push(`${line}\n`);
    }
  }

  // Close any open tags if they were not closed due to missing data
  if (isCodeBlock) {
    htmlLines.push('</code></pre>');
  }
  if (isOrderedList) {
    htmlLines.push('</li>');
  }

  return htmlLines.join('');
}
