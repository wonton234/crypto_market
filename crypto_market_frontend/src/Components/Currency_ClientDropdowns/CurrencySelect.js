import { useState,useEffect } from "react";


const ClientDropdown = ({currencies,onCurrencySelect}) => {
    const [currentCurrency,setCurrentCurrency] = useState([]);
    
    const handleChange = ()=>{

    }

    return (
        <div className="mb-4">
        
        {currencies.map((currency) =>(
            <button
                key = { `${currency.code}-${currency.name}`}
                onClick ={
                    ()=> handleChange(currency.code)}
                    className={`px-4 py-2 rounded ${
                        selectedCurrency === currency.code
                            ? 'bg-white text-black border'
                            : 'text-gray-600 hover:text-black border'
                    }`}
                    title = {currency.code}
            >
                {currency.symbol} {currency.code}

            </button>
        ))}
        </div>
    )
}
