import React, { useState } from 'react';
import Layout from '../Layout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const API_URL = process.env.REACT_APP_API_URL;

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // API call to authenticate user
    const res = await axios.post(`${API_URL}/api/auth/login`, formData);
    localStorage.setItem('token', res.data.token); // Overwrite any existing token
    alert('Logged in successfully!');
    navigate('/dashboard'); // Redirect to dashboard
  } catch (err) {
    console.error('Login failed:', err.message);
    setError('Invalid email or password.');
  }
};


  return (
    <Layout>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">Log In</h2>

        {/* Display error message if login fails */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition"
          >
            Log In
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default Login;
