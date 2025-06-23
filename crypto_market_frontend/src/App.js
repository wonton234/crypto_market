
import Portfolio from './Components/Portfolio';
import OpenOrders from './Components/OpenOrders';
import OrderForm from './Components/OrderForm';
import React, {useState,useEffect, useCallback} from 'react';
import axios from 'axios';
import './App.css';
import ClientDropdown from './Components/Currency_ClientDropdowns/ClientDropdown';



const useClientState = () => {
  const [selectedClientData, setSelectedClientData] = useState(null);
  const [selectedClientPortfolio, setSelectedClientPortfolio] = useState(null);
  const [balanceReady, setBalanceReady] = useState(false);

  const handleClientSelect = useCallback((clientData) => {
    setSelectedClientData(clientData);
    setSelectedClientPortfolio(null);
    setBalanceReady(false);
  }, []);

  const handlePortfolioShown = useCallback((clientPortfolio) => {
    setSelectedClientPortfolio(clientPortfolio);
  }, []);

  const handleBalanceReady = useCallback(() => {
    setBalanceReady(true);
  }, []);

  return {
    selectedClientData,
    selectedClientPortfolio,
    balanceReady,
    handleClientSelect,
    handlePortfolioShown,
    handleBalanceReady,
  };
};


const useTradingPairs = () => {
  const [possiblePairs, setPossiblePairs] = useState(null);
  const [pairsLoading, setPairsLoading] = useState(true);
  const [pairsError, setPairsError] = useState(null);

  useEffect(() => {
    const fetchPairs = async () => {
      try {
        setPairsLoading(true);
        setPairsError(null);
        
        const response = await axios.get("https://api.kraken.com/0/public/AssetPairs");
        
        if (response.data.error && response.data.error.length === 0) {
          setPossiblePairs(response.data.result);
        } else {
          console.error("Kraken API error:", response.data.error);
          setPairsError("Failed to load trading pairs");
        }
      } catch (error) {
        console.error("Network or Axios Error for Fetch Pair: ", error);
        setPairsError(error.message);
      } finally {
        setPairsLoading(false);
      }
    };

    fetchPairs();
  }, []);

  return { possiblePairs, pairsLoading, pairsError };
};

function App() {
  // Use custom hooks for cleaner state management
  const {
    selectedClientData,
    selectedClientPortfolio,
    balanceReady,
    handleClientSelect,
    handlePortfolioShown,
    handleBalanceReady,
  } = useClientState();

  const { possiblePairs, pairsLoading, pairsError } = useTradingPairs();

  // Log portfolio updates for debugging
  useEffect(() => {
    if (selectedClientPortfolio) {
      console.log("Updated portfolio data in App:", selectedClientPortfolio);
    }
  }, [selectedClientPortfolio]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Trading Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your clients' portfolios and trading orders
          </p>
        </div>

        {/* Client Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Select Client
          </h2>
          <ClientDropdown onClientSelect={handleClientSelect} />
        </div>
        
        {/* Main Content - Only show when client is selected */}
        {selectedClientData && (
          <div className="space-y-8">
            {/* Portfolio Section */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Portfolio Overview
              </h2>
              <Portfolio 
                selectedClient={selectedClientData} 
                onPortfolioShown={handlePortfolioShown}
                onBalanceReady={handleBalanceReady}
              />
            </section>

            {/* Open Orders Section - Only show when balance is ready */}
            {balanceReady && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Open Orders
                </h2>
                <OpenOrders selectedClient={selectedClientData} />
              </section>
            )}

            {/* Order Form Section */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Place New Order
              </h2>
              
              {/* Show loading state for trading pairs */}
              {pairsLoading && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <p className="text-gray-600">Loading trading pairs...</p>
                  </div>
                </div>
              )}

              {/* Show error state for trading pairs */}
              {pairsError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-red-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-red-800 font-medium">Error loading trading pairs</p>
                      <p className="text-red-600 text-sm">{pairsError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Show order form when pairs are loaded */}
              {!pairsLoading && !pairsError && possiblePairs && (
                <OrderForm 
                  selectedClient={selectedClientData} 
                  selectedClientPortfolioData={selectedClientPortfolio} 
                  AllPossiblePairs={possiblePairs}
                />
              )}
            </section>
          </div>
        )}

        {/* Empty state when no client selected */}
        {!selectedClientData && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Welcome to Trading Dashboard
            </h3>
            <p className="text-gray-600">
              Select a client above to view their portfolio, open orders, and place new trades.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

