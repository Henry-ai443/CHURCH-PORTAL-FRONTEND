import React, { useEffect, useState, useRef } from 'react';

// For emoji picker, install with: npm install emoji-mart
import { Picker } from 'emoji-mart';
import 'emoji-mart/dist-modern/css/emoji-mart.css';


const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const chatSocket = useRef(null);
  const messageEndRef = useRef(null);

  const API_URL = 'https://church-portal-backend.onrender.com/api/chat/messages/';
  const WS_URL = 'wss://church-portal-backend.onrender.com/ws/chat/';

  // TODO: Replace with actual authenticated username
  const currentUser = 'me';

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

  // Setup WebSocket connection
  useEffect(() => {
    chatSocket.current = new WebSocket(WS_URL);

    chatSocket.current.onopen = () => {
      console.log('WebSocket connected');
      // Optional: send join message if backend supports it
      // chatSocket.current.send(JSON.stringify({ type: 'join', username: currentUser }));
    };

    chatSocket.current.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === 'chat_message') {
        setMessages((prev) => [...prev, data]);
      } else if (data.type === 'typing') {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          if (data.is_typing) {
            newSet.add(data.username);
          } else {
            newSet.delete(data.username);
          }
          return newSet;
        });
      } else if (data.type === 'read') {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === data.message_id ? { ...msg, read: true } : msg
          )
        );
      } else if (data.type === 'online_status') {
        // Optional: implement online status updates
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

  // Send chat message
  const sendMessage = () => {
    if (inputMessage.trim() === '') return;

    const msgObj = {
      type: 'chat_message',
      message: inputMessage,
    };

    chatSocket.current.send(JSON.stringify(msgObj));
    setInputMessage('');
    setIsEmojiPickerOpen(false);
  };

  // Typing indicator (debounced)
  useEffect(() => {
    if (!chatSocket.current || chatSocket.current.readyState !== WebSocket.OPEN) return;

    if (inputMessage.trim() !== '') {
      chatSocket.current.send(JSON.stringify({ type: 'typing', username: currentUser, is_typing: true }));
    } else {
      chatSocket.current.send(JSON.stringify({ type: 'typing', username: currentUser, is_typing: false }));
    }

    const timeoutId = setTimeout(() => {
      chatSocket.current.send(JSON.stringify({ type: 'typing', username: currentUser, is_typing: false }));
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [inputMessage, currentUser]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format timestamp (hh:mm am/pm)
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Add emoji to input
  const addEmoji = (emoji) => {
    setInputMessage((prev) => prev + emoji.native);
  };

  // Simple online status check (current user always online)
  const isUserOnline = (username) => username === currentUser;

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
    maxWidth: '70%',
    padding: '10px 15px',
    borderRadius: 16,
    boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
    wordBreak: 'break-word',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 4,
    color: '#075E54',
  },
  onlineIndicator: {
    display: 'inline-block',
    width: 8,
    height: 8,
    backgroundColor: '#25D366',
    borderRadius: '50%',
    marginLeft: 4,
    verticalAlign: 'middle',
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    textAlign: 'right',
    marginTop: 6,
  },
  typingIndicator: {
    fontStyle: 'italic',
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    position: 'relative',
  },
  emojiButton: {
    border: 'none',
    background: 'transparent',
    fontSize: 24,
    cursor: 'pointer',
    marginRight: 8,
    userSelect: 'none',
  },
  emojiPicker: {
    position: 'absolute',
    bottom: '50px',
    left: '10px',
    zIndex: 1000,
  },
  input: {
    flex: 1,
    resize: 'none',
    padding: '8px 12px',
    borderRadius: 20,
    border: '1px solid #ccc',
    fontSize: 16,
    outline: 'none',
    maxHeight: '100px',
  },
  button: {
    marginLeft: 8,
    padding: '8px 16px',
    borderRadius: 20,
    border: 'none',
    backgroundColor: '#075E54',
    color: 'white',
    cursor: 'pointer',
    fontSize: 18,
    userSelect: 'none',
  },
};

export default ChatRoom;
