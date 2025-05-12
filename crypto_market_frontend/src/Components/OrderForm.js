import axios from "axios";
import { useState,useEffect } from "react";

const OrderForm = ({selectedClient,selectedClientPortfolio})=>
{
    
    const [order,setOrder] = useState(
        {
            ordertype:'',
            type:'',
            volume: '',
            pair: '',
            price: '',
        }
    );

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [error,setError] = useState(null);
    
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

    
    // changing fields
    const handleChange = (e)=>
    {
        const {name,value}=e.target;
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

                <label>
                    Quantity:
                    <input
                        type="number"
                        name="volume"
                        value={order.volume}
                        onChange={handleChange}
                        step="any"
                        required
                    />
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
                <label>
                Pair:
                    <input
                        type="text"
                        name="pair"
                        value={order.pair}
                        onChange={handleChange}
                        required
                    />
                </label>

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