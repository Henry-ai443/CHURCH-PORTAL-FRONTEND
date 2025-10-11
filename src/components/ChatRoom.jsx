import React, { useEffect, useState, useRef } from 'react';

// For emoji picker, we'll use 'emoji-mart' package.
// Install with: npm install emoji-mart
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set()); // track who is typing
  const chatSocket = useRef(null);
  const messageEndRef = useRef(null);

  const API_URL = 'https://church-portal-backend.onrender.com/api/chat/messages/';
  const WS_URL = 'wss://church-portal-backend.onrender.com/ws/chat/';

  // Simulate current user for styling and status
  const currentUser = 'me'; // Replace with your auth username

  // Handle fetching messages
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

  // Setup WebSocket connection
  useEffect(() => {
    chatSocket.current = new WebSocket(WS_URL);

    chatSocket.current.onopen = () => {
      console.log('WebSocket connected');
      // Optionally send a "join" message with username if needed by server
      chatSocket.current.send(JSON.stringify({ type: 'join', username: currentUser }));
    };

    chatSocket.current.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === 'message') {
        setMessages((prev) => [...prev, data]);
      } else if (data.type === 'typing') {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          if (data.isTyping) {
            newSet.add(data.username);
          } else {
            newSet.delete(data.username);
          }
          return newSet;
        });
      } else if (data.type === 'read_receipt') {
        // Mark message(s) as read - update messages state accordingly
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === data.messageId ? { ...msg, read: true } : msg
          )
        );
      } else if (data.type === 'online_status') {
        // Optional: track who's online — could be used to show online status
        // For simplicity, ignore or implement later
      }
    };

    chatSocket.current.onerror = (e) => {
      console.error('WebSocket error', e);
    };

    chatSocket.current.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      chatSocket.current.close();
    };
  }, [currentUser]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const sendMessage = () => {
    if (inputMessage.trim() === '') return;

    const msgObj = {
      type: 'message',
      username: currentUser,
      message: inputMessage,
      timestamp: new Date().toISOString(),
      // Generate id or server can assign
      id: Date.now(),
    };

    chatSocket.current.send(JSON.stringify(msgObj));
    setMessages((prev) => [...prev, { ...msgObj, read: false }]); // optimistic update
    setInputMessage('');
    setIsEmojiPickerOpen(false);

    // Send read receipt of last message
    // Assuming all sent messages by currentUser are read by default
  };

  // Handle typing indicator logic (debounced)
  useEffect(() => {
    if (!chatSocket.current || chatSocket.current.readyState !== WebSocket.OPEN) return;

    if (inputMessage.trim() !== '') {
      chatSocket.current.send(JSON.stringify({ type: 'typing', username: currentUser, isTyping: true }));
    } else {
      chatSocket.current.send(JSON.stringify({ type: 'typing', username: currentUser, isTyping: false }));
    }

    // Send 'stop typing' after delay
    const timeoutId = setTimeout(() => {
      chatSocket.current.send(JSON.stringify({ type: 'typing', username: currentUser, isTyping: false }));
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [inputMessage, currentUser]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format timestamp to hh:mm am/pm
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Add emoji from picker
  const addEmoji = (emoji) => {
    setInputMessage((prev) => prev + emoji.native);
  };

  // Show online status (simple example: current user always online)
  const isUserOnline = (username) => {
    // You can implement real online status logic here
    return username === currentUser ? true : false;
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.onlineDot} />
          <span>Church Chat Room</span>
        </div>
      </header>

      <main style={styles.chatBox}>
        {messages.map((msg, index) => {
          const isCurrentUser = msg.username === currentUser;
          return (
            <div
              key={msg.id || index}
              style={{
                ...styles.message,
                alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                backgroundColor: isCurrentUser ? '#DCF8C6' : '#FFFFFF',
                borderTopRightRadius: isCurrentUser ? 0 : 16,
                borderTopLeftRadius: isCurrentUser ? 16 : 0,
                position: 'relative',
              }}
              aria-label={`${msg.username} message`}
            >
              {!isCurrentUser && (
                <div style={styles.username}>
                  {msg.username}{' '}
                  {isUserOnline(msg.username) && (
                    <span style={styles.onlineIndicator} title="Online"></span>
                  )}
                </div>
              )}
              <div style={{ whiteSpace: 'pre-wrap' }}>{msg.message}</div>
              <div style={styles.timestamp}>
                {formatTime(msg.timestamp || new Date())}
                {isCurrentUser && (
                  <span style={{ marginLeft: 8, fontSize: 14 }}>
                    {msg.read ? '✔✔' : '✔'}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {typingUsers.size > 0 && (
          <div style={styles.typingIndicator}>
            {Array.from(typingUsers)
              .filter((user) => user !== currentUser)
              .join(', ')}{' '}
            {typingUsers.size === 1 ? 'is' : 'are'} typing...
          </div>
        )}

        <div ref={messageEndRef} />
      </main>

      <footer style={styles.footer}>
        <button
          onClick={() => setIsEmojiPickerOpen((open) => !open)}
          style={styles.emojiButton}
          aria-label="Toggle emoji picker"
          title="Emoji picker"
          type="button"
        >
          😊
        </button>

        {isEmojiPickerOpen && (
          <div style={styles.emojiPicker}>
            <Picker onSelect={addEmoji} theme="light" />
          </div>
        )}

        <textarea
          rows={1}
          style={styles.input}
          placeholder="Type a message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Message input"
        />
        <button
          style={styles.button}
          onClick={sendMessage}
          aria-label="Send message"
          type="button"
        >
          &#9658;
        </button>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '20px auto',
    display: 'flex',
    flexDirection: 'column',
    height: '80vh',
    border: '1px solid #ddd',
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#ECE5DD',
    position: 'relative',
  },
  header: {
    backgroundColor: '#075E54',
    color: 'white',
    padding: '15px 20px',
    fontWeight: '600',
    fontSize: '1.2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    display: 'flex',
    alignItems: 'center',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  onlineDot: {
    width: 12,
    height: 12,
    backgroundColor: '#25D366',
    borderRadius: '50%',
    boxShadow: '0 0 6px #25D366',
  },
  chatBox: {
    flex: 1,
    padding: '10px 15px',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    gap: 8,
    scrollBehavior: 'smooth',
  },
  message: {
    maxWidth: '75%',
    padding: '8px 12px',
    borderRadius: 16,
    boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
    fontSize: '1rem',
    whiteSpace: 'pre-wrap',
  },
  username: {
    fontSize: '0.75rem',
    fontWeight: '600',
    marginBottom: 3,
    color: '#075E54',
    display: 'flex',
    alignItems: 'center',
  },
  onlineIndicator: {
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: '#25D366',
    marginLeft: 6,
    boxShadow: '0 0 6px #25D366',
  },
  timestamp: {
    fontSize: '0.65rem',
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
    userSelect: 'none',
  },
  typingIndicator: {
    fontStyle: 'italic',
    color: '#555',
    paddingLeft: 12,
    marginBottom: 4,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderTop: '1px solid #ddd',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    position: 'relative',
  },
  input: {
    flex: 1,
    resize: 'none',
    borderRadius: 20,
    border: '1px solid #ddd',
    padding: '10px 15px',
    fontSize: '1rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    outline: 'none',
    minHeight: 38,
    maxHeight: 100,
    overflowY: 'auto',
  },
  button: {
    marginLeft: 10,
    backgroundColor: '#25D366', // WhatsApp green
    border: 'none',
    borderRadius: '50%',
    width: 42,
    height: 42,
    color: 'white',
    fontSize: '1.3rem',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    transition: 'background-color 0.3s ease',
  },
  emojiButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: 24,
    cursor: 'pointer',
    marginRight: 8,
    outline: 'none',
  },
  emojiPicker: {
    position: 'absolute',
    bottom: 60,
    left: 10,
    zIndex: 1000,
  },
};

export default ChatRoom;
