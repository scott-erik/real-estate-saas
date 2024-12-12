import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import OpenHouseList from '../components/Dashboard/OpenHouseList';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function Dashboard() {
  const navigate = useNavigate();

  const [newOpenHouse, setNewOpenHouse] = useState({
    address: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOpenHouse({ ...newOpenHouse, [name]: value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/openhouses`, newOpenHouse, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Open House created successfully!');
      setNewOpenHouse({ address: '', description: '' });
      window.location.reload(); // Refresh the list
    } catch (err) {
      console.error('Error creating Open House:', err.message);
      alert('Failed to create Open House.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // Redirect to landing page
  };

  return (
    <Layout>
      <div className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        {/* Header Section with Logout */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-400 text-center sm:text-left">
            Manage Your Open Houses
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
          >
            Logout
          </button>
        </div>

        {/* Create Open House Form */}
        <form
          onSubmit={handleCreate}
          className="space-y-4 mb-8"
        >
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4">
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newOpenHouse.address}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newOpenHouse.description}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Create Open House
          </button>
        </form>

        {/* Open Houses List */}
        <div>
          <OpenHouseList navigate={navigate} />
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
