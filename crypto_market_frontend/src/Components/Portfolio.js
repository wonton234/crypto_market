import axios from "axios";
import React, {useState,useEffect} from 'react'
import '../css/Portfolio.css';
const Portfolio = ({ selectedClient, onPortfolioShown, onBalanceReady }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [balanceData, setBalanceData] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {   
        // check that there is a client to fetch balance for
        if (!selectedClient) return;

        setBalanceData(null);
        setIsLoading(true);
        setError(null);

        const fetchBalance = async () => {
            try {
                // fetch client key and private key and put into next api endpoint
                const response = await axios.post('http://127.0.0.1:5000/api/check-balance', {
                    key_name: selectedClient,
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.data.success) {
                    setBalanceData(response.data.data)
                    onPortfolioShown(response.data.data);
                    onBalanceReady();
                } else {
                    setError(response.data.message || 'Failed to fetch balance')
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false)
            }
        };
        fetchBalance();
    }, [selectedClient]);

    // No client selected state
    if (!selectedClient) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <p className="text-gray-600">Select a client to view their portfolio</p>
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <p className="text-gray-600">Loading Portfolio for {selectedClient}...</p>
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
                        <p className="text-red-800 font-medium">Error loading portfolio</p>
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    // No balance data
    if (!balanceData || Object.keys(balanceData).length === 0) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <div className="text-yellow-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                </div>
                <p className="text-yellow-800 font-medium">No balance information available</p>
                <p className="text-yellow-600 text-sm">for {selectedClient}</p>
            </div>
        );
    }

    // Calculate total number of assets with balance > 0
    const assetsWithBalance = Object.entries(balanceData).filter(([_, amount]) => parseFloat(amount) > 0);
    const totalAssets = assetsWithBalance.length;

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Portfolio for {selectedClient}
                    </h3>
                    <div className="text-sm text-gray-500">
                        {totalAssets} asset{totalAssets !== 1 ? 's' : ''} with balance
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Asset
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium text-right">
                                Amount
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {Object.entries(balanceData)
                            .filter(([_, amount]) => parseFloat(amount) > 0) // Only show assets with balance
                            .sort(([a], [b]) => a.localeCompare(b)) // Sort alphabetically
                            .map(([asset, amount]) => (
                                <tr key={asset} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-xs font-semibold text-gray-600">
                                                    {asset.substring(0, 2).toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="font-medium text-gray-900">{asset}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-mono text-gray-900">
                                            {parseFloat(amount).toFixed(8)}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {/* Footer - show if there are zero-balance assets */}
            {Object.entries(balanceData).filter(([_, amount]) => parseFloat(amount) === 0).length > 0 && (
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Assets with zero balance are hidden. Total assets: {Object.keys(balanceData).length}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Portfolio;