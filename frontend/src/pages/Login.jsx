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
      // Check if user already exists
      const checkResponse = await axios.post('http://127.0.0.1:5000/check_user', {
        name,
        email,
        role
      });

      if (checkResponse.data.exists) {
        // User exists, proceed to login
        alert(checkResponse.data.message);
        localStorage.setItem('user_id', checkResponse.data.user_id); // Store user ID
        navigate('/home');  // Navigate to /home upon successful login
      } else {
        // User does not exist, add user
        const addResponse = await axios.post('http://127.0.0.1:5000/add', {
          name,
          email,
          role
        });

        alert(addResponse.data.message);
        localStorage.setItem('user_id', addResponse.data.user_id); // Store new user ID
        navigate('/home');  // Navigate to /home upon successful login
      }
    } catch (error) {
      console.error('There was an error!', error);
      alert('An error occurred during login');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select a role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default LoginPage;
