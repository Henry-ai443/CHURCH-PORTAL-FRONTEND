import React, { useState, useEffect, useRef, useCallback } from 'react';

const YouthMessagesList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewAnswered, setViewAnswered] = useState(true);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const loaderRef = useRef(null);

  const fetchMessages = async (url, append = false, signal) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(url, {
        headers: {
          Authorization: `Token ${token}`,
        },
        signal,
      });

      if (!res.ok) throw new Error('Failed to fetch messages');

      const data = await res.json();

      if (append) {
        setMessages((prev) => [...prev, ...data.results]);
      } else {
        setMessages(data.results);
      }

      setNextPageUrl(data.next);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const baseUrl = viewAnswered
      ? 'https://church-portal-backend.onrender.com/api/youth/messages/answered/'
      : 'https://church-portal-backend.onrender.com/api/youth/messages/unanswered/';
    fetchMessages(baseUrl, false, controller.signal);

    return () => controller.abort(); // Clean up on tab switch or unmount
  }, [viewAnswered]);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && nextPageUrl && !loading) {
        fetchMessages(nextPageUrl, true);
      }
    },
    [nextPageUrl, loading]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    });

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [handleObserver]);

  return (
    <div className="messages-container">
      <h2>Youth Messages</h2>

      <div className="toggle-buttons">
        <button
          className={viewAnswered ? 'active' : ''}
          onClick={() => setViewAnswered(true)}
          disabled={loading}
        >
          Answered
        </button>
        <button
          className={!viewAnswered ? 'active' : ''}
          onClick={() => setViewAnswered(false)}
          disabled={loading}
        >
          Unanswered
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {!loading && messages.length === 0 && <p className="no-messages">No messages found.</p>}

      <ul className="messages-list">
        {messages.map((msg) => (
          <li key={msg.id} className={`message-card ${msg.is_answered ? 'answered' : 'unanswered'}`}>
            <div className="message-header">
              <h3>{msg.title}</h3>
              {!msg.is_answered && <span className="flag">⚠️ Unanswered</span>}
            </div>

            <p className="message-text">{msg.message}</p>

            {msg.is_answered && (
              <div className="answer-section">
                <strong>Answer:</strong>
                <p>{msg.answer}</p>
                <small>Answered on: {new Date(msg.answered_at).toLocaleString()}</small>
              </div>
            )}

            <div className="message-footer">
              <small>
                Submitted on: {new Date(msg.submitted_at).toLocaleString()} |{' '}
                {msg.is_anonymous ? 'Anonymous' : `By User ID: ${msg.user}`}
              </small>
            </div>
          </li>
        ))}
      </ul>

      {loading && <p className="loading">Loading messages...</p>}
      <div ref={loaderRef} style={{ height: '1px' }} />

      <style jsx>{`
        .messages-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        h2 {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .toggle-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .toggle-buttons button {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #f9f9f9;
          cursor: pointer;
        }

        .toggle-buttons button.active {
          background-color: #0070f3;
          color: white;
          border-color: #0070f3;
        }

        .toggle-buttons button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error {
          color: red;
          text-align: center;
          margin-bottom: 1rem;
        }

        .no-messages {
          text-align: center;
          color: #666;
          font-style: italic;
          margin-top: 2rem;
        }

        .messages-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .messages-list {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .messages-list {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .message-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem;
          background-color: #fff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          position: relative;
        }

        .message-card.unanswered {
          border-color: #ffc107;
          background-color: #fff8e1;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .flag {
          color: #d9534f;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .message-text {
          margin: 0.5rem 0 1rem;
        }

        .answer-section {
          background-color: #f0f9ff;
          padding: 0.5rem;
          border-left: 4px solid #0070f3;
          margin-bottom: 1rem;
        }

        .message-footer {
          font-size: 0.8rem;
          color: #666;
        }

        .loading {
          text-align: center;
          margin-top: 1rem;
          color: #0070f3;
        }
      `}</style>
    </div>
  );
};

export default YouthMessagesList;
