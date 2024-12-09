import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
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
      <h2>Your Open Houses</h2>
      {openHouses.length === 0 ? (
        <p>No open houses created yet.</p>
      ) : (
        <ul>
          {openHouses.map((house) => (
            <li key={house._id} style={{ marginBottom: '20px' }}>
              <div>
                <strong>Address:</strong> {house.address} <br />
                <strong>Description:</strong> {house.description} <br />
                <strong>Form Link:</strong>{' '}
                <a href={`http://localhost:3000/form/${house._id}`} target="_blank" rel="noreferrer">
                  Visitor Form
                </a>
              </div>

              {/* QR Code */}
              <div style={{ marginTop: '10px' }}>
                <strong>QR Code:</strong>
                <QRCodeCanvas value={`http://localhost:3000/form/${house._id}`} size={128} />
              </div>

              {/* Manage Visitors Link */}
              <div style={{ marginTop: '10px' }}>
                <Link to={`/openhouses/${house._id}/visitors`}>Manage Visitors</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OpenHouseList;
