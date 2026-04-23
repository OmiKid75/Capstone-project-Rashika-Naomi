import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [skillInput, setSkillInput] = useState({ offered: '', wanted: '' });
  const [error, setError] = useState('');
  const [sentRequests, setSentRequests] = useState([]);
  const navigate = useNavigate();
  const [myReviews, setMyReviews] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchProfile();
    fetchSentRequests();
  }, []);
  
  const fetchMyReviews = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/reviews/${user?._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMyReviews(res.data.reviews);
  } catch (err) {
    console.error('Failed to load reviews');
  }
};

  const fetchProfile = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userData = {
      ...res.data,
      skillsOffered: Array.isArray(res.data.skillsOffered) ? res.data.skillsOffered : [],
      skillsWanted: Array.isArray(res.data.skillsWanted) ? res.data.skillsWanted : [],
    };
    setUser(userData);

    // Fetch reviews now that we have user ID
    const reviewRes = await axios.get(`http://localhost:5000/api/reviews/${res.data._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMyReviews(reviewRes.data.reviews);
  } catch (err) {
    setError('Failed to load profile');
  }
};

  const fetchSentRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/requests/sent', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSentRequests(res.data);
    } catch (err) {
      console.error('Failed to load sent requests');
    }
  };

  const handleAddSkill = async (type) => {
    const skill = skillInput[type].trim();
    if (!skill) return;

    const updatedOffered = type === 'offered' ? [...user.skillsOffered, skill] : user.skillsOffered;
    const updatedWanted = type === 'wanted' ? [...user.skillsWanted, skill] : user.skillsWanted;

    try {
      const res = await axios.put('http://localhost:5000/api/users/me',
        { skillsOffered: updatedOffered, skillsWanted: updatedWanted },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser({
        ...res.data,
        skillsOffered: Array.isArray(res.data.skillsOffered) ? res.data.skillsOffered : [],
        skillsWanted: Array.isArray(res.data.skillsWanted) ? res.data.skillsWanted : [],
      });
      setSkillInput({ ...skillInput, [type]: '' });
    } catch (err) {
      setError('Failed to update skills');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return <div className="text-center mt-20 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name} 👋</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 border border-red-400 px-4 py-2 rounded hover:bg-red-50"
        >
          Logout
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills Offered */}
        <div className="bg-white rounded shadow p-5">
          <h2 className="text-lg font-semibold text-blue-600 mb-3">Skills I Offer</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {user.skillsOffered.length === 0 && (
              <p className="text-gray-400 text-sm">No skills added yet</p>
            )}
            {user.skillsOffered.map((skill, i) => (
              <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. JavaScript"
              value={skillInput.offered}
              onChange={(e) => setSkillInput({ ...skillInput, offered: e.target.value })}
              className="flex-1 border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill('offered')}
            />
            <button
              onClick={() => handleAddSkill('offered')}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="bg-white rounded shadow p-5">
          <h2 className="text-lg font-semibold text-green-600 mb-3">Skills I Want</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {user.skillsWanted.length === 0 && (
              <p className="text-gray-400 text-sm">No skills added yet</p>
            )}
            {user.skillsWanted.map((skill, i) => (
              <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Guitar"
              value={skillInput.wanted}
              onChange={(e) => setSkillInput({ ...skillInput, wanted: e.target.value })}
              className="flex-1 border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill('wanted')}
            />
            <button
              onClick={() => handleAddSkill('wanted')}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Sent Requests */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Requests I Sent</h2>
        {sentRequests.length === 0 ? (
          <p className="text-gray-400">No requests sent yet</p>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {sentRequests.map((req) => (
              <div key={req._id} className="bg-white rounded shadow p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{req.to.name}</p>
                    <p className="text-gray-500 text-sm">{req.to.email}</p>
                    {req.message && (
                      <p className="text-gray-600 text-sm mt-1">"{req.message}"</p>
                    )}
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    req.status === 'accepted' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {req.status}
                  </span>
                </div>
                {req.status === 'accepted' && (
                  <button
                    onClick={() => navigate(`/chat/${req._id}`)}
                    className="mt-3 w-full bg-blue-100 text-blue-700 py-2 rounded hover:bg-blue-200 text-sm font-medium"
                  >
                    Open Chat 💬
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
 
    {/* My Reviews */}
<div className="mt-8">
  <h2 className="text-xl font-bold text-gray-800 mb-4">Reviews I've Received</h2>
  {myReviews.length === 0 ? (
    <p className="text-gray-400">No reviews yet</p>
  ) : (
    <div className="grid grid-cols-1 gap-3">
      {myReviews.map((review) => (
        <div key={review._id} className="bg-white rounded shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="font-medium text-gray-800">{review.reviewer.name}</p>
            <span className="text-yellow-400 text-lg">
              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
            </span>
          </div>
          {review.comment && (
            <p className="text-gray-600 text-sm">"{review.comment}"</p>
          )}
        </div>
      ))}
    </div>
  )}
</div>
    </div>
    
  );
}

export default Dashboard;