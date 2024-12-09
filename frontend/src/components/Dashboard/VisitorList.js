import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';

function ManageVisitors() {
  const { id: openHouseId } = useParams();
  const [visitors, setVisitors] = useState([]);

  const fetchVisitors = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/visitors/${openHouseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVisitors(res.data);
    } catch (err) {
      console.error('Error fetching visitors:', err.message);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [openHouseId]);

  return (
    <Layout>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">Visitors</h2>
        {visitors.length === 0 ? (
          <p>No visitors found.</p>
        ) : (
          <ul>
            {visitors.map((visitor) => (
              <li
                key={visitor._id}
                className="bg-gray-700 p-4 rounded-lg shadow-md mb-4"
              >
                <p>
                  <strong>Name:</strong> {visitor.name}
                </p>
                <p>
                  <strong>Email:</strong> {visitor.email}
                </p>
                <p>
                  <strong>Phone:</strong> {visitor.phone || 'N/A'}
                </p>
                <p>
                  <strong>Feedback:</strong> {visitor.feedback || 'N/A'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}

export default ManageVisitors;
