import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function OpenHouseList() {
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
      const res = await axios.get('http://localhost:5000/api/openhouses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpenHouses(res.data);
    } catch (error) {
      console.error('Error fetching Open Houses:', error.message);
    }
  };

  useEffect(() => {
    fetchOpenHouses();
  }, []);

  // Delete Open House
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/openhouses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpenHouses((prev) => prev.filter((house) => house._id !== id));
      alert('Open House deleted successfully!');
    } catch (error) {
      console.error('Error deleting Open House:', error.message);
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
      await axios.put(
        `http://localhost:5000/api/openhouses/${editingHouse}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Open House updated successfully!');
      setEditingHouse(null);
      fetchOpenHouses();
    } catch (error) {
      console.error('Error updating Open House:', error.message);
    }
  };

  return (
    <div>
      {openHouses.length === 0 ? (
        <p>No open houses available. Add one!</p>
      ) : (
        openHouses.map((house) => (
          <div key={house._id} className="bg-gray-700 p-6 rounded-lg shadow-md mb-6">
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
                <button
                  onClick={handleSave}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingHouse(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-blue-400">
                  {house.address}
                </h3>
                <p className="text-gray-300 mb-4">{house.description}</p>
                <div className="space-x-4">
                  <button
                    onClick={() => handleEdit(house)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(house._id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                  >
                    Delete
                  </button>

                  {/* Edit/Create Template */}
                  <Link
                    to={`/openhouses/${house._id}/template`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg"
                  >
                    {house.template ? 'Edit Template' : 'Create Template'}
                  </Link>

                  {/* View Template */}
                  {house.template && (
                    <Link
                      to={`/templates/${house._id}`}
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                    >
                      View Template
                    </Link>
                  )}

                  {/* View Visitors */}
                  <Link
                    to={`/openhouses/${house._id}/visitors`}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                  >
                    View Visitors
                  </Link>

                  {/* Customize Visitor Form */}
                  <Link
                    to={`/openhouses/${house._id}/customize-visitor-form`}
                    className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg"
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