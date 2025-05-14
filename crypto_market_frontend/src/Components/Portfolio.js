import axios from "axios";
import React, {useState,useEffect} from 'react'
import '../css/Portfolio.css';

const Portfolio = ({selectedClient,onPortfolioShown,onBalanceReady  })=>
{
    
    const [isLoading,setIsLoading]= useState(true);
    const [balanceData,setBalanceData] = useState(null);
    const [error,setError] = useState(null);
    
    useEffect(()=>
    {   
        // check that there is a client to fetch balance for
        if (!selectedClient) return;

        setBalanceData(null);
        setIsLoading(true);
        setError(null);

        const fetchBalance = async()=>
        {
            
           

            try{
                // fetch client key and private key and put into next api endpoint
                const response = await axios.post('http://127.0.0.1:5000/api/check-balance',
                    {
                        key_name:selectedClient,
                    },
                    {
                        headers:
                        {
                            'Content-Type':'application/json'
                        }
                    }

                );
                
                if (response.data.success)
                {
                 
                    setBalanceData(response.data.data)
                    onPortfolioShown(response.data.data);
                    onBalanceReady();
                    
                }else{
                    setError(response.data.message || 'Failed to fetch balance')
                }
                // api endpoint response and catch bad response
            }catch(err){
                setError(err.message);
            } finally
            {
                setIsLoading(false)
            }
        };
        fetchBalance();
    },[selectedClient]);
    if (!selectedClient)
    {
        
        return <p>No client selected</p>
    }
    if (isLoading) {
        return (
        <div>
        <p>Loading Portfolio for {selectedClient}...</p>
        <div className="spinner"> {/* Add a CSS spinner here */} </div>
        </div>
        );
    }

    if (!balanceData)
    {
        return <p>No balance information available</p>
    }
    
    
    return (
    <div className="portfolio-container" >
        <h3>Portfolio for {selectedClient}</h3>
         {balanceData && (
        <table className="portfolio-table">
            <thead>
                <tr>
                    <th>Coin</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(balanceData).map(([asset, amount]) => (
                    <tr key={asset}>
                        <td>{asset}</td>
                        <td>{amount}</td>
                    </tr>
                ))}
            </tbody>
        </table>
         )}
    </div>
    );
    

};

export default Portfolio;