import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Matches from './pages/Matches';
import RequestPage from './pages/RequestPage';
import Requests from './pages/Requests';
import Chat from './pages/Chat';
import Review from './pages/Review';

// inside Routes:


// inside Routes:



const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/request/:id" element={<RequestPage />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/chat/:roomId" element={<Chat />} />
        <Route path="/review/:requestId/:revieweeId" element={<Review />} />
      </Routes>
    </Router>
  );
};

export default App;