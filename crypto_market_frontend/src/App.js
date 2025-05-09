import ClientDropdown from './Components/ClientDropdown'
import Portfolio from './Components/Portfolio';
import OpenOrders from './Components/OpenOrders';
import React, {useState} from 'react'
import './App.css';

function App() {
  // being able to use clients in different Components we need to have current client stored in a parent 
  // function
  const [selectedClientData, setSelectedClientData] = useState(null);

  const handleClientSelect = (clientData)=>
  {
    setSelectedClientData(clientData);
  }
  return (
    <div style={{
    display: 'flex',
    flexWrap: 'wrap', // This ensures components stack on small screens
    gap: '2rem', // Adds space between the components
    alignItems: 'flex-start', // Aligns items at the top
    }}>
      <ClientDropdown onClientSelect={handleClientSelect}/>
      <Portfolio selectedClient={selectedClientData}/>
      <OpenOrders selectedClient = {selectedClientData}/>
      {/* Add_Order*/}
    </div>
   
  );
}

export default App;
