import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const YouthMessageForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    is_anonymous: false,
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Token check
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to submit a message.');
      return;
    }

    // Trimmed field check
    if (!formData.title.trim() || !formData.message.trim()) {
      setError('Title and message cannot be empty.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setShowAnimation(true);

    try {
      const res = await fetch('https://church-portal-backend.onrender.com/api/youth/messages/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (typeof data === 'object') {
          const errorMessages = Object.entries(data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('\n');
          throw new Error(errorMessages || 'Failed to submit message');
        } else {
          throw new Error(data.detail || 'Failed to submit message');
        }
      }

      setSuccess('Your message has been submitted successfully.');
      setFormData({ title: '', message: '', is_anonymous: false });

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
      setTimeout(() => setShowAnimation(false), 3000); // Hide car after 3s
    }
  };

  return (
    <div className="form-container">
      <h3 className="form-title">Youth Questions</h3>

      {/* 🚗📧 Car animation */}
      {showAnimation && (
        <div className="car-animation" role="status" aria-live="polite">
          <span className="car">🚗📧</span>
        </div>
      )}

      {/* ✅ Success message */}
      {success && (
        <div className="success-animation" role="alert" aria-live="polite">
          <div className="checkmark">&#10003;</div>
          <div className="alert alert-success">{success}</div>
        </div>
      )}

      {/* ❌ Error message */}
      {error && (
        <div className="alert alert-danger" role="alert" aria-live="assertive" style={{ whiteSpace: 'pre-wrap' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your question title"
            required
            disabled={loading}
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            className="form-control"
            placeholder="Type your full message here..."
            required
            disabled={loading}
            maxLength={1000}
          />
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            id="is_anonymous"
            name="is_anonymous"
            checked={formData.is_anonymous}
            onChange={handleChange}
            className="form-check-input"
            disabled={loading}
          />
          <label htmlFor="is_anonymous" className="form-check-label">
            Submit as anonymous
          </label>
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Question'}
        </button>
      </form>

      <div className="view-messages-link">
        <Link to="/youth/messages" tabIndex={0}>
          View answered and unanswered messages
        </Link>
      </div>

      {/* 🔷 STYLES */}
      <style jsx>{`
        .form-container {
          position: relative;
          background: #ffffff;
          padding: 40px;
          margin: 40px auto;
          border-radius: 12px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          width: 95%;
          font-family: 'Segoe UI', sans-serif;
          overflow: hidden;
        }

        .form-container::before,
        .form-container::after {
          content: '';
          position: absolute;
          left: 0;
          width: 100%;
          height: 20px;
          background-repeat: repeat-x;
          background-size: 40px 20px;
          z-index: 1;
        }

        .form-container::before {
          top: 0;
          background-image: url('data:image/svg+xml;utf8,<svg width="40" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M0,20 L10,0 L20,20 L30,0 L40,20 Z" fill="%23007bff"/></svg>');
        }

        .form-container::after {
          bottom: 0;
          background-image: url('data:image/svg+xml;utf8,<svg width="40" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M0,0 L10,20 L20,0 L30,20 L40,0 Z" fill="%23007bff"/></svg>');
        }

        .form-title {
          text-align: center;
          color: #007bff;
          margin-bottom: 25px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          font-weight: 600;
          margin-bottom: 6px;
          display: block;
          color: #333;
        }

        .form-control {
          width: 100%;
          padding: 12px 14px;
          border-radius: 6px;
          border: 1px solid #ccc;
          transition: border 0.3s;
        }

        .form-control:focus {
          border-color: #007bff;
          outline: none;
        }

        .form-check {
          margin: 20px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .form-check-label {
          font-size: 15px;
          color: #555;
        }

        .btn-submit {
          background-color: #007bff;
          color: white;
          padding: 12px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          width: 100%;
          transition: background-color 0.3s;
        }

        .btn-submit:hover {
          background-color: #0056b3;
          cursor: pointer;
        }

        .btn-submit:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }

        .success-animation {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 15px;
          animation: fadeInOut 3s forwards;
        }

        .checkmark {
          font-size: 24px;
          color: #28a745;
          animation: scaleBounce 0.6s ease forwards;
        }

        .view-messages-link {
          margin-top: 20px;
          text-align: center;
        }

        .view-messages-link a {
          color: #007bff;
          text-decoration: underline;
          font-weight: 600;
          cursor: pointer;
          font-size: 16px;
        }

        .view-messages-link a:hover,
        .view-messages-link a:focus {
          color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default YouthMessageForm;
