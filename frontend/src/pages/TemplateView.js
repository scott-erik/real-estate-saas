import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
function TemplateView() {
  const { id: openHouseId } = useParams();
  const [template, setTemplate] = useState({
    contactInfo: '',
    companyLogo: '',
    qrCodeLink: '',
  });
  const [openHouseName, setOpenHouseName] = useState('');
  const defaultLogo = '/default-logo.png';

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/openhouses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const openHouse = res.data.find((house) => house._id === openHouseId);
        if (openHouse) {
          setTemplate(openHouse.template || {});
          setOpenHouseName(openHouse.address || 'Open House');
        }
      } catch (err) {
        console.error('Error fetching template:', err.message);
      }
    };

    fetchTemplate();
  }, [openHouseId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      {template ? (
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="mb-6">
            <img
              src={template.companyLogo || defaultLogo}
              alt="Company Logo"
              className="mx-auto w-24 h-24 rounded-full shadow-lg"
            />
          </div>

          {/* Open House Name */}
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            {openHouseName}
          </h1>

          <p className="text-lg text-gray-600 mb-6 italic">
            {template.contactInfo}
          </p>

          {template.qrCodeLink && (
            <div className="flex justify-center mb-6">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${template.qrCodeLink}`}
                alt="QR Code"
                className="w-48 h-48 border-4 border-gray-200 rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      ) : (
        <p className="text-2xl text-gray-700">Loading...</p>
      )}
    </div>
  );
}

export default TemplateView;
