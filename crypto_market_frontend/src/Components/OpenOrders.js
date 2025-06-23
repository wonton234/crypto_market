import axios from 'axios';
import {useState, useEffect} from 'react';




const OpenOrders = ({ selectedClient }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [openOrderData, setOpenOrderData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!selectedClient) return;

        setOpenOrderData(null);

        const fetchOpenOrders = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // fetch client key and private key and put into next api endpoint
                const response = await axios.post('http://127.0.0.1:5000/api/get-open-orders', {
                    key_name: selectedClient
                })
                   
                if (response.data.success) {
                    setOpenOrderData(response.data.data)
                } else {
                    setError(response.data.message || 'Failed to fetch open orders');
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOpenOrders();

    }, [selectedClient]);

    // No client selected state
    if (!selectedClient) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <p className="text-gray-600">Select a client to view their open orders</p>
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <p className="text-gray-600">Loading Open Orders for {selectedClient}...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center space-x-3">
                    <div className="text-red-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-red-800 font-medium">Error loading open orders</p>
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    // No open orders
    if (!openOrderData || !openOrderData.open || Object.keys(openOrderData.open).length === 0) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="text-green-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p className="text-green-800 font-medium">No open orders</p>
                <p className="text-green-600 text-sm">for {selectedClient}</p>
            </div>
        );
    }

    // Helper function to get order type badge color
    const getOrderTypeBadge = (type) => {
        const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
        switch (type.toLowerCase()) {
            case 'buy':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'sell':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    // Helper function to get status badge color
    const getStatusBadge = (status) => {
        const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
        switch (status.toLowerCase()) {
            case 'open':
                return `${baseClasses} bg-blue-100 text-blue-800`;
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'closed':
                return `${baseClasses} bg-gray-100 text-gray-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const totalOrders = Object.keys(openOrderData.open).length;

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Open Orders for {selectedClient}
                    </h3>
                    <div className="text-sm text-gray-500">
                        {totalOrders} open order{totalOrders !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-medium">Order ID</th>
                            <th scope="col" className="px-6 py-3 font-medium">Pair</th>
                            <th scope="col" className="px-6 py-3 font-medium">Type</th>
                            <th scope="col" className="px-6 py-3 font-medium">Order Type</th>
                            <th scope="col" className="px-6 py-3 font-medium text-right">Volume</th>
                            <th scope="col" className="px-6 py-3 font-medium text-right">Price</th>
                            <th scope="col" className="px-6 py-3 font-medium text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {Object.entries(openOrderData.open).map(([orderId, order]) => (
                            <tr key={orderId} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="font-mono text-sm text-gray-900">
                                        {orderId.substring(0, 8)}...
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-semibold text-gray-900">
                                        {order.descr.pair}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={getOrderTypeBadge(order.descr.type)}>
                                        {order.descr.type.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-gray-900 capitalize">
                                        {order.descr.ordertype}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="font-mono text-gray-900">
                                        {parseFloat(order.vol).toFixed(8)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="font-mono text-gray-900">
                                        {order.descr.price || 'Market'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={getStatusBadge(order.status)}>
                                        {order.status.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default OpenOrders;