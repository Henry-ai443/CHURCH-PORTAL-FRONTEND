import React, { useState } from 'react';

const YouthMessageForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    is_anonymous: false,
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('https://church-portal-backend.onrender.com/api/youth/messages/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`,
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
    }
  };

  return (
    <div className="form-container">
      <h3 className="form-title">Youth Questions</h3>

      {success && (
        <div className="success-animation">
          <div className="checkmark">&#10003;</div>
          <div className="alert alert-success">{success}</div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" style={{ whiteSpace: 'pre-wrap' }}>
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

      <style jsx>{`
        .form-container {
          background: #ffffff;
          padding: 40px;
          margin: 40px auto;
          border-radius: 12px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          width: 95%;
          font-family: 'Segoe UI', sans-serif;
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

        @keyframes scaleBounce {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          60% {
            transform: scale(1.4);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes fadeInOut {
          0%, 100% {
            opacity: 0;
          }
          10%, 90% {
            opacity: 1;
          }
        }

        @media (max-width: 576px) {
          .form-container {
            padding: 25px 20px;
          }

          .form-title {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default YouthMessageForm;
