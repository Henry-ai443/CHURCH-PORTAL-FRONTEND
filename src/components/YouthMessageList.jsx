import React, { useState, useEffect } from 'react';

const YouthMessagesList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewAnswered, setViewAnswered] = useState(true); // true = answered, false = unanswered

  const fetchMessages = async (answered) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const url = answered
        ? 'https://church-portal-backend.onrender.com/api/youth/messages/answered/'
        : 'https://church-portal-backend.onrender.com/api/youth/messages/unanswered/';

      const res = await fetch(url, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(viewAnswered);
  }, [viewAnswered]);

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

      {loading && <p>Loading messages...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && messages.length === 0 && (
        <p>No {viewAnswered ? 'answered' : 'unanswered'} messages found.</p>
      )}

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

      <style jsx>{`
        .messages-container {
          max-width: 900px;
          margin: 30px auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        h2 {
          text-align: center;
          color: #007bff;
          margin-bottom: 20px;
        }

        .toggle-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 25px;
        }

        .toggle-buttons button {
          background-color: #e9ecef;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .toggle-buttons button.active,
        .toggle-buttons button:hover:not(:disabled) {
          background-color: #007bff;
          color: white;
        }

        .toggle-buttons button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .messages-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .message-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
          padding: 20px 25px;
          border-left: 6px solid transparent;
          transition: box-shadow 0.3s ease;
        }

        .message-card:hover {
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
        }

        .message-card.unanswered {
          border-left-color: #dc3545;
        }

        .message-card.answered {
          border-left-color: #28a745;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .flag {
          background-color: #dc3545;
          color: white;
          padding: 3px 8px;
          border-radius: 5px;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .message-text {
          margin-bottom: 15px;
          color: #444;
          line-height: 1.5;
        }

        .answer-section {
          background-color: #f1f9f1;
          padding: 15px;
          border-radius: 10px;
          color: #2d6a2d;
          margin-bottom: 15px;
          font-style: italic;
        }

        .message-footer {
          font-size: 0.85rem;
          color: #666;
          border-top: 1px solid #eee;
          padding-top: 8px;
          text-align: right;
        }

        .error {
          color: #dc3545;
          text-align: center;
          margin-bottom: 20px;
        }

        @media (max-width: 600px) {
          .message-card {
            padding: 15px 18px;
          }

          .toggle-buttons button {
            padding: 8px 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default YouthMessagesList;
