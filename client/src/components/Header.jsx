import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const token = localStorage.getItem('token');

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">SkillSwap</Link>
      <div className="space-x-4">
        {token ? (
          <>
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
            <Link to="/matches" className="text-gray-600 hover:text-blue-600">Matches</Link>
            <Link to="/requests" className="text-gray-600 hover:text-blue-600">Requests</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
            <Link to="/register" className="text-gray-600 hover:text-blue-600">Register</Link>
          </>
          
        )}
      </div>
    </nav>
  );
}

export default Header;