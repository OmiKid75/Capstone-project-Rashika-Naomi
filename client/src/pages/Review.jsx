import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

function Review() {
  const { requestId, revieweeId } = useParams();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSubmit = async () => {
    if (rating === 0) { setError('Please select a rating'); return; }
    try {
      await API.post('/reviews',
        { reviewee: revieweeId, request: requestId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Review submitted!');
      setTimeout(() => navigate('/requests'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Leave a Review</h2>
        <p className="text-gray-500 mb-6">How was your skill exchange experience?</p>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="text-4xl transition-transform hover:scale-110"
            >
              <span className={star <= (hovered || rating) ? 'text-yellow-400' : 'text-gray-300'}>
                ★
              </span>
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-500 mb-2">
          {rating === 1 && 'Poor'}
          {rating === 2 && 'Fair'}
          {rating === 3 && 'Good'}
          {rating === 4 && 'Very Good'}
          {rating === 5 && 'Excellent!'}
        </p>

        <textarea
          rows="4"
          placeholder="Share your experience... (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 font-semibold"
        >
          Submit Review
        </button>
        <button
          onClick={() => navigate('/requests')}
          className="w-full mt-2 text-gray-500 p-3 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Review;