import ClientDropdown from './Components/ClientDropdown'
import Portfolio from './Components/Portfolio';
import OpenOrders from './Components/OpenOrders';
import OrderForm from './Components/OrderForm';
import React, {useState,useEffect} from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // being able to use clients in different Components we need to have current client stored in a parent 
  // function
  // to use the possible Pairs for order Form we need to lift Client Portfolio information
  const [selectedClientData, setSelectedClientData] = useState(null);
  const [selectedClientPortfolio, setSelectedClientPortfolio] = useState(null);
  const [balanceReady, setBalanceReady] = useState(false);
  const [PossiblePairs, setPossiblePairs]=useState(null);
  const handleClientSelect = (clientData)=>
  {
    setSelectedClientData(clientData);
    setSelectedClientPortfolio(null);
    setBalanceReady(false);
  };
  const handlePortfolioShown = (clientPortfolio) =>
  {
    setSelectedClientPortfolio(clientPortfolio);
  };
  // log updated portfolio data
  useEffect(() => {
    if (selectedClientPortfolio) {
      console.log("Updated portfolio data in App:", selectedClientPortfolio); // This will log the updated portfolio data
    }
  }, [selectedClientPortfolio]); 

  // use effect to grab all possible pairs
  useEffect(()=>{
    const fetchPairs=  async()=>{
      try{
      const response = await axios.get("https://api.kraken.com/0/public/AssetPairs");
      if (response.data.error && response.data.error.length === 0) {
        setPossiblePairs(response.data.result);
      } else {
        console.error("Kraken API error:", response.data.error);
      }
      }
      catch (e)
      {
        console.error("Network or Axios Error for Fetch Pair: ", e)
      }
    }
    fetchPairs();
  },[])

  return (
    <div style={{
    display: 'flex',
    flexWrap: 'wrap', // This ensures components stack on small screens
    gap: '2rem', // Adds space between the components
    alignItems: 'flex-start', // Aligns items at the top
    }}>
      <ClientDropdown onClientSelect={handleClientSelect}/>
      <Portfolio selectedClient={selectedClientData} onPortfolioShown={handlePortfolioShown}
       onBalanceReady={() => setBalanceReady(true)}/>
      {balanceReady &&(<OpenOrders selectedClient = {selectedClientData}/>)}
     <OrderForm selectedClient={selectedClientData} selectedClientPortfolioData = {selectedClientPortfolio} AllPossiblePairs = {PossiblePairs}/>
    </div>
   
  );
}

export default App;
