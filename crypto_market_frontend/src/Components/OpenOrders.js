import axios from 'axios';
import {useState, useEffect} from 'react'
import '../css/OpenOrders.css';


const OpenOrders = ({selectedClient})=>
{
    const [isLoading,setIsLoading] = useState(true);
    const [openOrderData,setOpenOrderData] = useState(null);
    const [error,setError] = useState(null);

    useEffect(()=>
    {
        if (!selectedClient) return;

        setOpenOrderData(null);

        const fetchOpenOrders = async()=>
        {
            setIsLoading(true);
            setError(null);

            try{
                // fetch client key and private key and put into next api endpoint
                const response = await axios.post('http://127.0.0.1:5000/api/get-open-orders',{key_name:selectedClient})
                   
                if(response.data.success)
                {
                    setOpenOrderData(response.data.data)
                }else{
                    setError(response.data.message || 'Failed to fetch open orders');
                }

            }catch(err){
                setError(err.message);
            }finally{
                setIsLoading(false);
            }
        };
        fetchOpenOrders();

    },[selectedClient]);
    if (!selectedClient)
    {
        
        return <p>No client selected</p>
    }
    if (isLoading)
    {
        return <p className="loading-message">Loading Open Orders for {selectedClient}</p>
    }
    if (error)
    {
        return <p className='error-message'>Error: {error}</p>; 
    }
    if (
        !openOrderData ||
        !openOrderData.open||
        Object.keys(openOrderData.open).length === 0
        ){
        return <p>No open orders available for {selectedClient}</p>;
    }

    return (
  <div className="open-orders-container">
    <h3>Open Orders for {selectedClient.key_name}</h3>
    <table className="open-orders-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Pair</th>
          <th>Type</th>
          <th>Order Type</th>
          <th>Volume</th>
          <th>Price</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(openOrderData.open).map(([orderId, order]) => (
          <tr key={orderId}>
            <td>{orderId}</td>
            <td>{order.descr.pair}</td>
            <td>{order.descr.type}</td>
            <td>{order.descr.ordertype}</td>
            <td>{order.vol}</td>
            <td>{order.descr.price}</td>
            <td>{order.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

}
export default OpenOrders;