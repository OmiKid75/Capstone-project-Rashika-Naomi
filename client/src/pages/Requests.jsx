import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
    } catch (err) {
      console.error('Failed to update request');
    }
  };

  if (loading) return <div className="text-center mt-20 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Incoming Requests</h1>
      <p className="text-gray-500 mb-6">People who want to exchange skills with you</p>

      {requests.length === 0 ? (
        <div className="bg-white rounded shadow p-8 text-center">
          <p className="text-gray-400 text-lg">No requests yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map((req) => (
            <div key={req._id} className="bg-white rounded shadow p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="font-semibold text-gray-800">{req.from.name}</h2>
                  <p className="text-gray-500 text-sm">{req.from.email}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  req.status === 'accepted' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {req.status}
                </span>
              </div>

              {req.message && (
                <p className="text-gray-600 text-sm mb-3 bg-gray-50 p-3 rounded">
                  "{req.message}"
                </p>
              )}

              <div className="flex flex-wrap gap-1 mb-4">
                {req.from.skillsOffered.map((skill, i) => (
                  <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    {skill}
                  </span>
                ))}
              </div>

              {req.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(req._id, 'accepted')}
                    className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm font-medium"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleUpdate(req._id, 'rejected')}
                    className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 text-sm font-medium"
                  >
                    Reject
                  </button>
                </div>
              )}

              {req.status === 'accepted' && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => navigate(`/chat/${req._id}`)}
                    className="flex-1 bg-blue-100 text-blue-700 py-2 rounded hover:bg-blue-200 text-sm font-medium"
                  >
                    Open Chat 💬
                  </button>
                  <button
                    onClick={() => navigate(`/review/${req._id}/${req.from._id}`)}
                    className="flex-1 bg-yellow-100 text-yellow-700 py-2 rounded hover:bg-yellow-200 text-sm font-medium"
                  >
                    Leave Review ⭐
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Requests;