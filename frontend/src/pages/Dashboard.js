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
      await axios.post(
        `${API_URL}/api/openhouses`,
        newOpenHouse,
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        {/* Header Section with Logout */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-400">Manage Your Open Houses</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Create Open House Form */}
        <form onSubmit={handleCreate} className="space-y-4 mb-8">
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
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition"
          >
            Create Open House
          </button>
        </form>

        {/* Open Houses List */}
        <OpenHouseList navigate={navigate} />
      </div>
    </Layout>
  );
}

export default Dashboard;
