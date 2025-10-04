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
        // Show detailed error messages
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
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h3 className="text-primary text-center mb-4">Youth Questions</h3>

      {success && <div className="alert alert-success">{success}</div>}
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
            className="form-control"
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
            className="form-control"
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

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Question'}
        </button>
      </form>
    </div>
  );
};

export default YouthMessageForm;
