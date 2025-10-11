import React, { useEffect, useState, useRef } from 'react';

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const chatSocket = useRef(null);
  const messageEndRef = useRef(null);

  const API_URL = 'https://your-backend.onrender.com/api/chat/messages/';
  const WS_URL = 'wss://your-backend.onrender.com/ws/chat/';

  // Styles
  const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
    },
    card: {
      border: '1px solid #ccc',
      borderRadius: '8px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '500px',
    },
    chatBox: {
      flex: '1',
      padding: '15px',
      overflowY: 'auto',
      backgroundColor: '#f8f9fa',
    },
    footer: {
      borderTop: '1px solid #ddd',
      padding: '10px',
      display: 'flex',
    },
    input: {
      flex: '1',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      marginRight: '10px',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    message: {
      marginBottom: '10px',
    },
    username: {
      fontWeight: 'bold',
      marginRight: '5px',
    },
  };

  // Fetch chat history
  useEffect(() => {
    fetch(API_URL, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.reverse());
      })
      .catch((err) => console.error('Error fetching messages:', err));
  }, []);

  // WebSocket setup
  useEffect(() => {
    chatSocket.current = new WebSocket(WS_URL);

    chatSocket.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    chatSocket.current.onclose = () => {
      console.log('Chat socket closed');
    };

    return () => {
      chatSocket.current.close();
    };
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim() === '') return;

    chatSocket.current.send(
      JSON.stringify({
        message: inputMessage,
      })
    );

    setInputMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={styles.container}>
      <h2 className="text-center mb-4">Church Chat Room</h2>

      <div style={styles.card}>
        <div style={styles.chatBox}>
          {messages.map((msg, index) => (
            <div key={index} style={styles.message}>
              <span style={styles.username}>{msg.username}:</span>
              <span>{msg.message}</span>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>

        <div style={styles.footer}>
          <input
            type="text"
            style={styles.input}
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button style={styles.button} onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
