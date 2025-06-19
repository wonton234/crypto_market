import axios from 'axios';
import {useState, useEffect} from 'react'
import "../css/ClientDropdown.css"

const ClientDropdown = ({ onClientSelect }) => {
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedClient, setSelectedClient] = useState('');

    useEffect(() => {
        const fetchClients = async () => {
            try {
                setIsLoading(true);
                
                const response = await axios.get('http://127.0.0.1:5000/api/clients')
                if (response.data.success) {
                    setClients(response.data.data)
                   
                } else {
                    setError('Failed to load clients');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchClients();
    }, [])

    const handleChange = (clientId) => {
        setSelectedClient(clientId)
        console.log(clientId)
        if (clientId) {
            onClientSelect(clientId)
        }
    }

    // Helper function to truncate long client names
    const truncateClientName = (name, maxLength = 12) => {
        if (name.length <= maxLength) return name;
        return name.substring(0, maxLength) + '...';
    };

    if (error) {
        return <p className="text-red-500 text-sm mb-4">Error: {error}</p>;
    }

    if (isLoading) {
        return (
            <div className="bg-gray-100 p-1 rounded-lg inline-flex mb-4">
                <div className="px-4 py-2 text-gray-500 animate-pulse">Loading clients...</div>
            </div>
        );
    }

    if (clients.length === 0) {
        return (
            <div className="bg-gray-100 p-1 rounded-lg inline-flex mb-4">
                <div className="px-4 py-2 text-gray-500">No clients found</div>
            </div>
        );
    }

    return (
        <div className="mb-4">
            {/* Show all clients if 5 or fewer, otherwise show scrollable */}
            {clients.length <= 5 ? (
                <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                    {clients.map((client) => (
                        <button
                            key={client}
                            onClick={() => handleChange(client)}
                            className={`px-4 py-2 rounded-md transition-all duration-200 font-medium whitespace-nowrap ${
                                selectedClient === client
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                            title={client} // Show full name on hover
                        >
                            {truncateClientName(client)}
                        </button>
                    ))}
                </div>
            ) : (
                // Scrollable version for many clients
                <div className="bg-gray-100 p-1 rounded-lg inline-flex max-w-full overflow-x-auto">
                    <div className="flex space-x-1">
                        {clients.map((client) => (
                            <button
                                key={client}
                                onClick={() => handleChange(client)}
                                className={`px-4 py-2 rounded-md transition-all duration-200 font-medium whitespace-nowrap flex-shrink-0 ${
                                    selectedClient === client
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                                title={client}
                            >
                                {truncateClientName(client)}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Show selected client info */}
            
        </div>
    );
};

export default ClientDropdown
