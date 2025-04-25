import axios from 'axios';
import {useState, useEffect} from 'react'
const ClientDropdown =({onClientSelect})=>
{
    const [clients, setClients] = useState();
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
                const response = await axios.get('')
                
                setClients(response.data)
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

        // Find the selected client object with its keys
        if (clientId) {
            const selectedClient = clients.find(client =>client.id ===clientId)
            // take selected cleitnand 
            if (selectedClient)
            {
            onClientSelect(
                {
                    name:selectedClient.name,
                    publicKey:selectedClient.publicKey
                }
            )
            }
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
    
                        
                </select>
                </>
            )
            }
            
        </div>
    );
   
   
};

export default ClientDropdown
