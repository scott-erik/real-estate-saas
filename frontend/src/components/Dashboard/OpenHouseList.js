import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

function OpenHouseList({ newOpenHouse }) {
  const [openHouses, setOpenHouses] = useState([]);
  const [editingHouse, setEditingHouse] = useState(null);
  const [editForm, setEditForm] = useState({
    address: '',
    description: '',
  });

  // Fetch Open Houses
  const fetchOpenHouses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/openhouses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpenHouses(res.data);
    } catch (error) {
      console.error('Error fetching Open Houses:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchOpenHouses();
  }, []);

  // Effect to update the list when a new open house is added
  useEffect(() => {
    if (newOpenHouse) {
      setOpenHouses((prev) => [...prev, newOpenHouse]);
    }
  }, [newOpenHouse]);

  // Delete Open House
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/openhouses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update state instead of refetching
      setOpenHouses((prev) => prev.filter((house) => house._id !== id));
      alert('Open House deleted successfully!');
    } catch (error) {
      console.error('Error deleting Open House:', error.response?.data || error.message);
    }
  };

  // Edit Open House
  const handleEdit = (house) => {
    setEditingHouse(house._id);
    setEditForm({ address: house.address, description: house.description });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/api/openhouses/${editingHouse}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Open House updated successfully!');

      // Update state directly
      setOpenHouses((prev) =>
        prev.map((house) =>
          house._id === editingHouse ? { ...house, ...res.data } : house
        )
      );
      setEditingHouse(null);
    } catch (error) {
      console.error('Error updating Open House:', error.response?.data || error.message);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {openHouses.length === 0 ? (
        <p className="text-gray-400 text-center">No open houses available. Add one!</p>
      ) : (
        openHouses.map((house) => (
          <div
            key={house._id}
            className="bg-gray-700 p-4 sm:p-6 rounded-lg shadow-md mb-6"
          >
            {editingHouse === house._id ? (
              <div>
                <input
                  type="text"
                  name="address"
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm({ ...editForm, address: e.target.value })
                  }
                  className="w-full px-4 py-2 mb-2 rounded-lg bg-gray-600 text-white"
                />
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white"
                />
                <div className="flex flex-wrap gap-4 mt-4">
                  <button
                    onClick={handleSave}
                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingHouse(null)}
                    className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-blue-400 mb-2">
                  {house.address}
                </h3>
                <p className="text-gray-300 mb-4">{house.description}</p>
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  <button
                    onClick={() => handleEdit(house)}
                    className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(house._id)}
                    className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                  >
                    Delete
                  </button>

                  <Link
                    to={`/openhouses/${house._id}/template`}
                    className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg text-center"
                  >
                    {house.template ? 'Edit Template' : 'Create Template'}
                  </Link>

                  {house.template && (
                    <Link
                      to={`/templates/${house._id}`}
                      className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-center"
                    >
                      View Template
                    </Link>
                  )}

                  <Link
                    to={`/openhouses/${house._id}/visitors`}
                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-center"
                  >
                    View Visitors
                  </Link>

                  <Link
                    to={`/openhouses/${house._id}/customize-visitor-form`}
                    className="w-full sm:w-auto bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg text-center"
                  >
                    Customize Visitor Form
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default OpenHouseList;
