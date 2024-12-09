import React from 'react';
import OpenHouseList from '../components/Dashboard/OpenHouseList';
import OpenHouseForm from '../components/Dashboard/OpenHouseForm';

function Dashboard() {
  return (
    <div>
      <h1>Agent Dashboard</h1>
      <OpenHouseForm />
      <OpenHouseList />
    </div>
  );
}

export default Dashboard;
