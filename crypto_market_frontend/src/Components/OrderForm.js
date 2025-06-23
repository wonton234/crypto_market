import axios from "axios";
import { useState,useEffect } from "react";
import getPossibleCurrencies from "../helpers/ComponentHelpers";
import { getMaxVolumeFromPortfolio } from "../helpers/ComponentHelpers";

const OrderhtmlForm = ({selectedClient,selectedClientPortfolioData,AllPossiblePairs})=>
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
    
    const isFormValid =
    order.ordertype &&
    order.type &&
    order.volume &&
    order.pair &&
    (order.ordertype !== 'limit' || order.price);
    // use Effects
    useEffect(() => {
    console.log("OrderhtmlForm received client:", selectedClient);
    console.log("OrderhtmlForm received portfolio data:", selectedClientPortfolioData);
        if (selectedClientPortfolioData && AllPossiblePairs)
        {
            const pairs = getPossibleCurrencies(selectedClientPortfolioData,AllPossiblePairs)
            setAvailablePairs(pairs)
           
            
        }
     }, [selectedClient, selectedClientPortfolioData]);
      
    
    
    
    useEffect(()=>
    {

        setOrder({
            ordertype: 'market',
            type: 'buy',
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
        setOrder(prev=>({...prev,
            [name]:value}));
    };


    const handleSubmit = async(e)=>
    {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);
        setError(null);
        try {
            const payload ={
                ordertype: order.ordertype, // "limit" or "market"
                type: order.type,           // "buy" or "sell"
                volume: order.volume,       // number or string
                pair: order.pair,           // string
                price: order.price,  
                key_name:selectedClient
            }
            console.log(order);
            const response = await axios.post(
                "http://127.0.0.1:5000/api/post-add-order",
                payload,
                { headers: { 'Content-Type': 'application/json' } }
            )
            if (response.data.success){
                setMessage("Order submitted successfully!");
            }else {
                setError(response.data.message || "Order submission failed.");

            }
            
            console.log(response.data);
        }catch(err){
            console.error(err);
            setError(err.response?.data?.message || "An Error occured while submitting the order")
        } finally {
            setIsSubmitting(false);
        }
       
    };
    if (!selectedClient) return <p>Please select a client to place an order.</p>
    
    
    return(

        <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
            
            <form className ="w-full max-w-lg" onSubmit={handleSubmit}>
                <div className="flex flex-wrap -mx-3 mb-2">

                    {/* Buy Sell dropdown */}
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-Buy-Sell">
                         Buy/Sell
                        </label>
                        <div className="relative">
                            <select name="type" value={order.type} onChange={handleChange} className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="ordertype">
                                <option value="buy">Buy</option>
                                <option value="sell">Sell</option>         
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>
                    {/* Order Type Dropdown */}
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-Order-Type">
                        Order Type
                        </label>
                        <div className="relative">
                            <select name = "ordertype" value={order.ordertype} onChange={handleChange} className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-Order-Type">
                                <option value="market">Market</option>
                                <option value="limit">Limit</option>       
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>
                    {/* Price if limit order */}
                    {order.ordertype === 'limit' && (
                    <div className="w-full md:w-1/2 px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" 
                    htmlFor="grid-price">
                        Price:
                    </label>
                        <input
                            type="float"
                            name="price"
                            value={order.price}
                            onChange={handleChange}
                            step="any"
                            required
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-price"  placeholder="70"
                        />
                    
                    </div>
                    )}
                    {/* Select Pair */}
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-Pair">
                            Select a Pair
                        </label>
                        <div class="relative">
                            <select 
                            id="pair" 
                            name = "pair" 
                            value={selectedPair} 
                            onChange={handleChange}
                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                            htmlFor="grid-choose-pair"
                            >
                            <option value="">-- Choose a pair --</option>
                            {availablePairs.map((pair,index) => (
                                <option key = {index} value = {pair.pairKey}>
                                        {pair.wsname}
                                </option>
                            ))}
                            </select>
                        </div>
                    </div>
                    {/* Set quantity in base currency */}
                


                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                    {/* quantity */}
                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-quantity">
                            Quantity
                        </label>
                        <input  
                        
                         onChange={handleChange}
                          name = "volume" type = "float" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-quantity"  placeholder="0.11"></input>
                        <p className="text-red-500 text-xs italic">Please fill out this field.</p>
                    </div>
                    
                </div>
                <button 
                type="button"
                className="text-white bg-blue-700 dark:bg-blue-500  font-medium rounded-lg text-sm px-5 py-2.5 text-center" 
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Order'}
                </button>

            </form>
          
            
            
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};



export default OrderhtmlForm;