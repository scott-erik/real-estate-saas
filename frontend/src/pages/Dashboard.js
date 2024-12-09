import React from 'react';
import Layout from '../components/Layout';
import OpenHouseList from '../components/Dashboard/OpenHouseList';

function Dashboard() {
  return (
    <Layout>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Your Open Houses</h2>
        <OpenHouseList />
      </div>
    </Layout>
  );
}

export default Dashboard;
