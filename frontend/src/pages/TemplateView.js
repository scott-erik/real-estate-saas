import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function TemplateView() {
  const { id: openHouseId } = useParams();
  const [template, setTemplate] = useState(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/openhouses/${openHouseId}`);
        setTemplate(res.data.template);
      } catch (err) {
        console.error('Error fetching template:', err.message);
      }
    };

    fetchTemplate();
  }, [openHouseId]);

  return (
    <div>
      {template ? (
        <div style={{ textAlign: 'center', border: '1px solid #ccc', padding: '20px' }}>
          {template.companyLogo && (
            <img src={template.companyLogo} alt="Company Logo" width="150" />
          )}
          <h2>Open House</h2>
          <p>{template.contactInfo}</p>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${template.qrCodeLink}`}
            alt="QR Code"
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default TemplateView;
