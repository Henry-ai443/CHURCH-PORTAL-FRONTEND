import React, { useState, useEffect, useRef, useCallback } from 'react';

const YouthMessagesList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewAnswered, setViewAnswered] = useState(true); // true = answered, false = unanswered
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const loaderRef = useRef(null);

  // Fetch messages helper
  const fetchMessages = async (url, append = false) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(url, {
        headers: {
          Authorization: `Token ${token}`,
        },
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
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // On tab switch or initial load
  useEffect(() => {
    const baseUrl = viewAnswered
      ? 'https://church-portal-backend.onrender.com/api/youth/messages/answered/'
      : 'https://church-portal-backend.onrender.com/api/youth/messages/unanswered/';
    fetchMessages(baseUrl, false);
  }, [viewAnswered]);

  // Infinite scroll callback
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && nextPageUrl && !loading) {
        fetchMessages(nextPageUrl, true);
      }
    },
    [nextPageUrl, loading]
  );

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
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

      {loading && <p>Loading messages...</p>}

      {/* This empty div is our loader trigger for IntersectionObserver */}
      <div ref={loaderRef} style={{ height: '1px' }} />

      <style jsx>{`
        /* Your existing styles here (same as before) */
      `}</style>
    </div>
  );
};

export default YouthMessagesList;
