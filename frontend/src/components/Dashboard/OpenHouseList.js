import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function OpenHouseList() {
  const [openHouses, setOpenHouses] = useState([]);

  const fetchOpenHouses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/openhouses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpenHouses(res.data);
    } catch (err) {
      console.error('Error fetching open houses:', err.message);
    }
  };

  useEffect(() => {
    fetchOpenHouses();
  }, []);

  return (
    <div>
      {openHouses.length === 0 ? (
        <p className="text-gray-300">No open houses available. Add one!</p>
      ) : (
        <ul>
          {openHouses.map((house) => (
            <li
              key={house._id}
              className="bg-gray-700 p-6 rounded-lg shadow-md mb-6 text-white"
            >
              <h3 className="text-2xl font-bold text-blue-300 mb-2">{house.address}</h3>
              <p className="text-gray-300 mb-4">{house.description}</p>

              <div className="flex space-x-4">
                {/* Link to Visitor List */}
                <Link
                  to={`/openhouses/${house._id}/visitors`}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                >
                  View Visitors
                </Link>

                {/* Link to Customize Template */}
                <Link
                  to={`/openhouses/${house._id}/template`}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg"
                >
                  Customize Template
                </Link>

                {/* Link to View Template */}
                {house.template && house.template.companyLogo && (
                  <Link
                    to={`/templates/${house._id}`}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                  >
                    View Template
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OpenHouseList;
