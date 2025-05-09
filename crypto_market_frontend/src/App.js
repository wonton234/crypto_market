import ClientDropdown from './Components/ClientDropdown'
import Portfolio from './Components/Portfolio';
import OpenOrders from './Components/OpenOrders';
import OrderForm from './Components/OrderForm';
import React, {useState} from 'react'
import './App.css';

function App() {
  // being able to use clients in different Components we need to have current client stored in a parent 
  // function
  // to use the possible Pairs for order Form we need to lift Client Portfolio information
  const [selectedClientData, setSelectedClientData] = useState(null);
  const [selectedClientPortfolio, setSelectedClientPortfolio] = useState(null);
  const handleClientSelect = (clientData)=>
  {
    setSelectedClientData(clientData);
  };
  const handlePortfolioShown = (clientPortfolio) =>
  {
    setSelectedClientPortfolio(clientPortfolio);
  };

  return (
    <div style={{
    display: 'flex',
    flexWrap: 'wrap', // This ensures components stack on small screens
    gap: '2rem', // Adds space between the components
    alignItems: 'flex-start', // Aligns items at the top
    }}>
      <ClientDropdown onClientSelect={handleClientSelect}/>
      <Portfolio selectedClient={selectedClientData} onPortfolioShown={handlePortfolioShown}/>
      <OpenOrders selectedClient = {selectedClientData}/>
      <OrderForm selectedClient={selectedClientData} selectedClientPortfolioData = {selectedClientPortfolio}/>
    </div>
   
  );
}

export default App;
