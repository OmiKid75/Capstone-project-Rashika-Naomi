import React, { useState } from 'react';
import API from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

function RequestPage() {
  const { id } = useParams();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSubmit = async () => {
    try {
      await API.post('/requests',
        { to: id, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Request sent successfully!');
      setTimeout(() => navigate('/matches'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Send Exchange Request</h2>
        <p className="text-gray-500 mb-6">Add a message to introduce yourself</p>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <textarea
          rows="4"
          placeholder="Hi! I'd love to exchange skills with you. I can teach you JavaScript and would love to learn Guitar..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 font-semibold"
        >
          Send Request
        </button>
        <button
          onClick={() => navigate('/matches')}
          className="w-full mt-2 text-gray-500 p-3 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default RequestPage;