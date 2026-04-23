import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function Chat() {
  const { roomId } = useParams();
  const [actualRoomId, setActualRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }

    const init = async () => {
      try {
        // Get current user
        const userRes = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(userRes.data);

        // Get request to find both user IDs
        const reqRes = await axios.get(`http://localhost:5000/api/requests/room/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { from, to } = reqRes.data;
        const sortedRoom = [from, to].sort().join('_');
        setActualRoomId(sortedRoom);

        // Join socket room
        socket.emit('joinRoom', sortedRoom);

        // Load messages
        const msgRes = await axios.get(`http://localhost:5000/api/messages/${sortedRoom}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(msgRes.data);

      } catch (err) {
        console.error('Chat init error:', err);
      }
    };

    init();

    socket.on('receiveMessage', (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => socket.off('receiveMessage');
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !currentUser || !actualRoomId) return;

    try {
      const res = await axios.post('http://localhost:5000/api/messages',
        { roomId: actualRoomId, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const messageWithSender = {
        ...res.data,
        sender: { _id: currentUser._id, name: currentUser.name }
      };

      socket.emit('sendMessage', { ...messageWithSender, roomId: actualRoomId });
      setText('');
    } catch (err) {
      console.error('Failed to send message');
    }
  };

  const isMyMessage = (msg) => {
    if (!currentUser) return false;
    const senderId = msg.sender?._id || msg.sender;
    return senderId?.toString() === currentUser._id?.toString();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col" style={{ height: '100vh' }}>
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate('/requests')}
          className="text-gray-500 hover:text-blue-600 text-sm"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-gray-800">Chat 💬</h1>
      </div>

      <div className="flex-1 bg-white rounded shadow p-4 overflow-y-auto mb-4">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 mt-10">No messages yet — say hello!</p>
        )}
        {messages.map((msg, i) => {
          const mine = isMyMessage(msg);
          return (
            <div key={i} className={`flex mb-3 ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                mine
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}>
                {!mine && (
                  <p className="text-xs font-semibold mb-1 text-blue-600">
                    {msg.sender?.name || 'User'}
                  </p>
                )}
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${mine ? 'text-blue-200' : 'text-gray-400'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 border p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;