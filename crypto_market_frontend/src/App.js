import ClientDropdown from './Components/ClientDropdown'
import Portfolio from './Components/Portfolio';
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
    <div style={{display:'flex'}}>
      <ClientDropdown onClientSelect={handleClientSelect}/>
      <Portfolio selectedClient={selectedClientData}/>
    </div>
   
  );
}

export default App;
