import React, { useEffect, useState, useRef } from 'react';
import { Picker } from 'emoji-mart'; // emoji-mart v5+

// Utility: assign consistent color per username
const usernameColors = {};
const colorsPalette = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8',
  '#f58231', '#911eb4', '#46f0f0', '#f032e6',
  '#bcf60c', '#fabebe', '#008080', '#e6beff',
  '#9a6324', '#fffac8', '#800000', '#aaffc3',
  '#808000', '#ffd8b1', '#000075', '#808080',
];
function getUsernameColor(username) {
  if (!usernameColors[username]) {
    // Assign a color by hashing the username string
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colorsPalette.length;
    usernameColors[username] = colorsPalette[index];
  }
  return usernameColors[username];
}

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const chatSocket = useRef(null);
  const messageEndRef = useRef(null);
  const chatBoxRef = useRef(null);

  const API_URL = 'https://church-portal-backend.onrender.com/api/chat/messages/';
  const WS_URL = 'wss://church-portal-backend.onrender.com/ws/chat/';

  const currentUser = 'me'; // Replace with actual username
  const token = localStorage.getItem('token'); // Get token from localStorage

  // Helper: check if user is near bottom of chat box
  const isUserNearBottom = () => {
    const container = chatBoxRef.current;
    if (!container) return true;

    const threshold = 50; // px threshold to consider near bottom
    const position = container.scrollTop + container.clientHeight;
    const height = container.scrollHeight;
    return height - position < threshold;
  };

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch messages with Authorization header
  useEffect(() => {
    if (!token) {
      console.error('No auth token found');
      return;
    }

    fetch(API_URL, {
      headers: {
        Authorization: `Token ${token}`,
      },
      credentials: 'include', // Optional, depending on your setup
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setMessages(data.reverse());
      })
      .catch((err) => console.error('Error fetching messages:', err));
  }, [token]);

  // Setup WebSocket connection with token as query param
  useEffect(() => {
    if (!token) {
      console.error('No auth token for WebSocket');
      return;
    }

    const wsUrlWithToken = `${WS_URL}?token=${token}`;
    chatSocket.current = new WebSocket(wsUrlWithToken);

    chatSocket.current.onopen = () => {
      console.log('WebSocket connected');
    };

    chatSocket.current.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === 'chat_message') {
        setMessages((prev) => {
          const nearBottom = isUserNearBottom();
          const newMessages = [...prev, data];

          // Scroll only if user is near bottom
          setTimeout(() => {
            if (nearBottom) scrollToBottom();
          }, 100);

          return newMessages;
        });
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
  }, [token, currentUser]);

  // Scroll to bottom on initial load of messages only
  useEffect(() => {
    // Only scroll down when messages first load
    scrollToBottom();
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim() === '') return;

    const msgObj = {
      type: 'chat_message',
      message: inputMessage,
    };

    if (chatSocket.current && chatSocket.current.readyState === WebSocket.OPEN) {
      chatSocket.current.send(JSON.stringify(msgObj));
      setInputMessage('');
      setIsEmojiPickerOpen(false);
    } else {
      console.error('WebSocket is not open');
    }
  };

  useEffect(() => {
    if (!chatSocket.current || chatSocket.current.readyState !== WebSocket.OPEN) return;

    if (inputMessage.trim() !== '') {
      chatSocket.current.send(
        JSON.stringify({ type: 'typing', username: currentUser, is_typing: true })
      );
    } else {
      chatSocket.current.send(
        JSON.stringify({ type: 'typing', username: currentUser, is_typing: false })
      );
    }

    const timeoutId = setTimeout(() => {
      chatSocket.current.send(
        JSON.stringify({ type: 'typing', username: currentUser, is_typing: false })
      );
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [inputMessage, currentUser]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const addEmoji = (emoji) => {
    setInputMessage((prev) => prev + emoji.native);
  };

  const isUserOnline = (username) => username === currentUser;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.onlineDot} />
          <span>Church Chat Room</span>
        </div>
      </header>

      <main ref={chatBoxRef} style={styles.chatBox}>
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
              }}
              aria-label={`${msg.username} message`}
            >
              {!isCurrentUser && (
                <div
                  style={{
                    ...styles.username,
                    color: getUsernameColor(msg.username),
                  }}
                >
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
    // color is dynamically assigned
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
    fontSize: 14,
    color: '#555',
    padding: '0 10px',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 15px',
    backgroundColor: '#f9f9f9',
    borderTop: '1px solid #ddd',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    position: 'relative',
  },
  emojiButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: 24,
    cursor: 'pointer',
    marginRight: 10,
  },
  emojiPicker: {
    position: 'absolute',
    bottom: '55px',
    left: '15px',
    zIndex: 1000,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    border: '1px solid #ddd',
    padding: '8px 15px',
    fontSize: 16,
    resize: 'none',
    outline: 'none',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#075E54',
    color: 'white',
    border: 'none',
    borderRadius: 20,
    padding: '8px 16px',
    marginLeft: 10,
    cursor: 'pointer',
    fontSize: 18,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
};

export default ChatRoom;
