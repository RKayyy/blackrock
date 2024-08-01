import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function LoginPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const checkResponse = await axios.post('http://127.0.0.1:5000/check_user', {
        name,
        email,
        role
      });

      if (checkResponse.data.exists) {
        alert(checkResponse.data.message);
        localStorage.setItem('user_id', checkResponse.data.user_id);
        navigate('/home');
      } else {
        const addResponse = await axios.post('http://127.0.0.1:5000/add', {
          name,
          email,
          role
        });

        alert(addResponse.data.message);
        localStorage.setItem('user_id', addResponse.data.user_id);
        navigate('/home');
      }
    } catch (error) {
      console.error('There was an error!', error);
      alert('An error occurred during login');
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-gray-400 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">LOGIN</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200"
            >
              <option value="">Select a role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 mt-20"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;