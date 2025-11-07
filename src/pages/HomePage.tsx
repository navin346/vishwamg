
import React from 'react';
import { useAppContext } from '../context/AppContext';
import IndiaDashboard from '../components/IndiaDashboard';
import InternationalDashboard from '../components/InternationalDashboard';

const HomePage: React.FC = () => {
  const { userMode } = useAppContext();

  // Conditionally render the dashboard based on the userMode from the context
  if (userMode === 'INDIA') {
    return <IndiaDashboard />;
  }
  
  return <InternationalDashboard />;
};

export default HomePage;
