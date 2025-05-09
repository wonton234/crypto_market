import axios from "axios";
import React, {useState,useEffect} from 'react'


const Portfolio = ({selectedClient})=>
{
    const [isLoading,setIsLoading]= useState(true);
    const [balanceData,setBalanceData] = useState(null);
    const [error,setError] = useState(null);
    
    useEffect(()=>
    {   
        // check that there is a client to fetch balance for
        if (!selectedClient) return;

        setBalanceData(null);

        const fetchBalance = async()=>
        {
            
            setIsLoading(true);
            setError(null);

            try{
                // fetch client key and private key and put into next api endpoint
                const response = await axios.post('http://127.0.0.1:5000/api/check-balance',
                    {
                        key_name:selectedClient,
                    }
                )

                if (response.data.success)
                {
                    setBalanceData(response.data.data)
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
    if (isLoading)
    {
        return <p>Loading Portfolio for {selectedClient}</p>
    }
    if (!balanceData)
    {
        return <p>No balance information available</p>
    }
    
    
    return (
    <div style={{marginTop: '2rem'}}>
        <h3>Portfolio for {selectedClient}</h3>
        <table style={{borderCollapse: 'collapse', width:'50%',marginTop:'2rem',marginLeft:'0'}}>
            <thead>
                <tr>
                    <th style={{ border: '1px solid #ccc', padding: '8px' }}>Coin Name</th>
                    <th style={{ border: '1px solid #ccc', padding: '8px' }}>Amount</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(balanceData).map(([asset, amount]) => (
                    <tr key={asset}>
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{asset}</td>
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{amount}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        
    </div>
    );
    

};

export default Portfolio;