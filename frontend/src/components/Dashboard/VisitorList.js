import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function VisitorList() {
  const { id: openHouseId } = useParams();
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `http://localhost:5000/api/visitors/${openHouseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVisitors(res.data || []);
      } catch (error) {
        console.error('Error fetching visitors:', error.message);
      }
    };

    fetchVisitors();
  }, [openHouseId]);

  return (
    <div className="container mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Visitor List</h1>
      {visitors.length === 0 ? (
        <p>No visitors have submitted the form yet.</p>
      ) : (
        <ul className="space-y-4">
          {visitors.map((visitor, index) => (
            <li key={index} className="p-4 bg-gray-700 rounded-lg shadow">
              <p><strong>Name:</strong> {visitor.name}</p>
              <p><strong>Email:</strong> {visitor.email}</p>
              <p><strong>Phone:</strong> {visitor.phone}</p>
              <p><strong>Feedback:</strong> {visitor.feedback}</p>
              {visitor.customFields &&
                Object.entries(visitor.customFields).map(([key, value]) => (
                  <p key={key}><strong>{key}:</strong> {value}</p>
                ))}
              <p className="text-sm text-gray-400">
                Submitted on: {new Date(visitor.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default VisitorList;
