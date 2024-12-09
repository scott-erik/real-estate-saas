import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send registration data to backend
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);

      // Store token or user data (if applicable)
      localStorage.setItem('token', res.data.token); // Assume token is returned from backend

      alert('Registration successful!');
      navigate('/dashboard'); // Redirect to Dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
      console.error('Error during registration:', err.message);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">Sign Up</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition"
          >
            Register
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default Register;
