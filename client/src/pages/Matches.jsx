import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/matches', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMatches(res.data);
    } catch (err) {
      setError('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-20 text-gray-500">Finding matches...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Your Matches 🤝</h1>
      <p className="text-gray-500 mb-6">People who want what you offer and offer what you want</p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {matches.length === 0 ? (
        <div className="bg-white rounded shadow p-8 text-center">
          <p className="text-gray-400 text-lg">No matches found yet</p>
          <p className="text-gray-400 text-sm mt-2">
            Add more skills to your profile to find matches
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Update Skills
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {matches.map((match) => (
            <div key={match._id} className="bg-white rounded shadow p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{match.name}</h2>
                  <p className="text-gray-500 text-sm">{match.email}</p>
                  {match.bio && <p className="text-gray-600 text-sm mt-1">{match.bio}</p>}
                </div>
                <button
                  onClick={() => navigate(`/request/${match._id}`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                >
                  Send Request
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-2">They Offer</p>
                  <div className="flex flex-wrap gap-1">
                    {match.skillsOffered.map((skill, i) => (
                      <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-2">They Want</p>
                  <div className="flex flex-wrap gap-1">
                    {match.skillsWanted.map((skill, i) => (
                      <span key={i} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Matches;