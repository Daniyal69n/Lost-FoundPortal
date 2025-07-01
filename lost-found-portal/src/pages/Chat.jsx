import React from 'react';
import { useState } from 'react';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Daniyal',
      text: 'Hello! I found your wallet in the cafeteria.',
      timestamp: '10:30 AM'
    },
    {
      id: 2,
      sender: 'You',
      text: 'Thank you! Can you tell me where exactly you found it?',
      timestamp: '10:31 AM'
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'You',
        text: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">Chat with Daniyal</h3>
            </div>
            <div className="card-body">
              <div className="chat-messages" style={{ height: '400px', overflowY: 'auto' }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${msg.sender === 'You' ? 'text-end' : ''}`}
                  >
                    <div
                      className={`d-inline-block p-2 rounded ${
                        msg.sender === 'You'
                          ? 'bg-primary text-white'
                          : 'bg-light'
                      }`}
                    >
                      <small className="d-block text-muted">
                        {msg.sender} - {msg.timestamp}
                      </small>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="mt-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary">
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat; 