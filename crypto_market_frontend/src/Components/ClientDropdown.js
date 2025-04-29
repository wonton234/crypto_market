import axios from 'axios';
import {useState, useEffect} from 'react'
const ClientDropdown =({onClientSelect})=>
{
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError]= useState(null);
    const [selectedClient,setSelectedClient] = useState('');

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

                setIsLoading(false)
            
            }catch(err){
            setError(err.message);
            setIsLoading(false)
            };

        };
            fetchClients();
    },[])
    const handleChange = (e) =>
    {
        const clientId = e.target.value;
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
                <>
                <label htmlFor='dropdown'>
                    Choose a Client
                </label>
                <select id="dropdown" value={selectedClient} onChange={handleChange}>
                    <option value="">--Select--</option>
                {clients.map((client) => (
                <option key={client} value={client}>
                {client}
                </option>
            ))}
                        
                </select>
                </>
            )
            }
            
        </div>
    );
   
   
};

export default ClientDropdown
