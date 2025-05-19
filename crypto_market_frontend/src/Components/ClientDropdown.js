import axios from 'axios';
import {useState, useEffect} from 'react'
import "../css/ClientDropdown.css"
const ClientDropdown =({onClientSelect})=>
{
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError]= useState(null);
    const [selectedClient,setSelectedClient] = useState('');
    const [isOpen, setIsOpen] = useState(false);


    useEffect(()=>
    {
        const fetchClients = async()=>
        {

            try{
                setIsLoading(true);
            
            
                // api endpoint response and catch bad response
                const response = await axios.get('http://127.0.0.1:5000/api/clients')
                if(response.data.success)
                {
                    setClients(response.data.data)
                }
                else 
                {
                    setError('Failed to load clients');
                }

                
            
            }catch(err){
            setError(err.message);
            }
            finally {
            setIsLoading(false);
            }

        };
            fetchClients();
    },[])
    const handleChange = (clientId) =>
    {
        
        setSelectedClient(clientId)
        console.log(clientId)
        // Find the selected client object with its keys
        if (clientId) {
            onClientSelect(clientId)
          }
    }

    return(
        <div>
            {error &&<p>Error: {error}</p>}
            
            {isLoading ?
            (
                <p> Loading clients...</p>
            )
            :
            (
                <div className="relative inline-block text-center">
                    {/* main button to choose client */}
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex justify-center items-center w-full px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none"
                        >
                        {selectedClient || "Clients"}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              className="w-4 h-4 ml-2 -mr-1"
                            >
                            <path fillRule="evenodd" d="M10 12l-5-5h10l-5 5z" />
                            </svg>
                        </button>
                        
                        {/* all possible clients in the dropdown */}
                        {isOpen && (
                                <ul className="absolute left-1/2 transform -translate-x-1/2 z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">

                                {clients.map((client) =>
                                (
                                  <li key = {client}>
                                    <button
                                        onClick={()=>
                                        {
                                            handleChange(client)
                                            setIsOpen(false);
                                            
                                        }
                                        }
                                        className=' text-left px-4 py-2  hover:bg-gray-100'>
                                            {client}
                                        </button>
                                  </li>  
                                ))}
                            </ul>
                        )}
                        
                    
              </div>
           
            )
            }
            
        </div>
    );
   
   
};

export default ClientDropdown
