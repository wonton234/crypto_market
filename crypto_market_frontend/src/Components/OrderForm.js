import axios from "axios";
import { useState,useEffect } from "react";
import getPossibleCurrencies from "../helpers/ComponentHelpers";
import { getMaxVolumeFromPortfolio } from "../helpers/ComponentHelpers";

const OrderForm = ({selectedClient,selectedClientPortfolioData,AllPossiblePairs})=>
{   
    // use States
      const [selectedPair, setSelectedPair] = useState('');
    const [availablePairs, setAvailablePairs] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [error,setError] = useState(null);
    const [order,setOrder] = useState(
        {
            ordertype:'',
            type:'',
            volume: '',
            pair: '',
            price: '',
        }
    );
    const { baseCurrency, maxVolume } = getMaxVolumeFromPortfolio(
  selectedPair,
  availablePairs,
  selectedClientPortfolioData
    );
    // use Effects
    useEffect(() => {
    console.log("OrderForm received client:", selectedClient);
    console.log("OrderForm received portfolio data:", selectedClientPortfolioData);
        if (selectedClientPortfolioData && AllPossiblePairs)
        {
            const pairs = getPossibleCurrencies(selectedClientPortfolioData,AllPossiblePairs)
            setAvailablePairs(pairs)
            console.log("Available trading pairs:", pairs);
           
            
        }
     }, [selectedClient, selectedClientPortfolioData]);
      
    
    
    
    useEffect(()=>
    {

        setOrder({
            ordertype: 'market',
            type: 'Buy',
            volume: '',
            pair: '',
            price: '',
        });
        setMessage(null);
        setError(null);
        setIsSubmitting(false)
    },[selectedClient]
    );



    // handlers ( changing fields and submit)
    const handleChange = (e)=>
    {
        
        const {name,value}=e.target;
        if (name=== "pair") {
            setSelectedPair(value)
        }
        setOrder(prev=>({...prev,[name]:value}));
    };


    const handleSubmit = (e)=>
    {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);
        setError(null);
        console.log(order);
        setIsSubmitting(false);
    }
    if (!selectedClient) return <p>Please select a client to place an order.</p>
    
    
    return(

        <div>
            <h3>Order Form for {selectedClient}</h3>
            <form onSubmit={handleSubmit}>
                {/* buy/sell dropdown */}
                <label>
                Buy/Sell:
                    <select name="type" value={order.type} onChange={handleChange}>
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                    </select>
                </label>
                {/* Order Type */}
                <label>
                    Order Type:
                    <select name="ordertype" value={order.ordertype} onChange={handleChange}>
                        <option value="market">Market</option>
                        <option value="limit">Limit</option>
                    </select>
                </label>

                {/* Set Quantity for order (in base currency) */}
                <label>
                    Quantity:
                    <input
                        type="number"
                        name="volume"
                        value={order.volume}
                        onChange={handleChange}
                        step="any"
                        required
                        max = {maxVolume??undefined}
                    />
                    {maxVolume !== null && (
                        <small style={{ marginLeft: '0.5rem', color: 'gray' }}>
                            Max: {maxVolume}
                        </small>
                    )}
                </label>


                {order.ordertype === 'limit' && (
                    <label>
                        Price:
                        <input
                            type="number"
                            name="price"
                            value={order.price}
                            onChange={handleChange}
                            step="any"
                            required
                        />
                    </label>
                )}
                
                <label htmlFor="pair-select">
                    Select a Pair: 
                </label>
                <select id="pair-select" name = "pair" value={selectedPair} onChange={handleChange}>
                    <option value="">-- Choose a pair --</option>
                    {availablePairs.map((pair,index) => (
                        <option key = {index} value = {pair.pairKey}>
                                {pair.wsname}
                        </option>
                    ))}
                </select>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Order'}
                </button>
            </form>
            
            
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};



export default OrderForm;