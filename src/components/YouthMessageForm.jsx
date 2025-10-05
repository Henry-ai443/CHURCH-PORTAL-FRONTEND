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
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-control custom-input"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="message" className="form-label">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            className="form-control custom-input"
            required
            disabled={loading}
          />
        </div>

        <div className="form-check mb-3">
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

        <button type="submit" className="btn submit-btn w-100" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Question'}
        </button>
      </form>

      <style jsx>{`
        .form-container {
          background: #fff;
          padding: 30px;
          margin: 40px auto;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          max-width: 600px;
        }

        .form-title {
          text-align: center;
          margin-bottom: 25px;
          font-weight: bold;
          background: linear-gradient(to right, #4e54c8, #8f94fb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .custom-input {
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          padding: 10px 12px;
        }

        .submit-btn {
          background: linear-gradient(to right, #4e54c8, #8f94fb);
          border: none;
          padding: 12px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          transition: background 0.3s ease, transform 0.2s;
        }

        .submit-btn:hover {
          background: linear-gradient(to right, #3b3fc1, #7c82f3);
          transform: scale(1.02);
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
      `}</style>
    </div>
  );
};

export default YouthMessageForm;
