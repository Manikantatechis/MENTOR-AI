import React from 'react';

function MessageList({ messages }) {
  return (
    <div className="messages">
        <div className="bot-message" id="message1" >
                  Hello how can i help you
                </div>
      {messages && messages?.map((message, index) => (
        <div key={index} className={`message ${message.sender}`}>
          {message.text}
        </div>
      ))}
    </div>
  );
}

export default MessageList;
