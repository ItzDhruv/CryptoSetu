'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';

// Mock Header component
import Header from '../../components/heder'
const coinGekoApi = process.env.NEXT_PUBLIC_COIN_GECKO_API ;
export default function MarketPage() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [sortBy, setSortBy] = useState('market_cap_rank');
  const [sortOrder, setSortOrder] = useState('asc');

  // Top cryptocurrencies to display
  const topCoins = [
    'bitcoin', 'ethereum', 'binancecoin', 'solana', 'cardano', 
    'avalanche-2', 'polygon', 'chainlink', 'uniswap', 'litecoin',
    'tether', 'usd-coin', 'ripple', 'dogecoin', 'polkadot'
  ];

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${topCoins.join(',')}&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h,24h,7d`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }
      
      const data = await response.json();
      setCoins(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching market data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoinChart = async (coinGekoApi) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinGekoApi}/market_chart?vs_currency=usd&days=7`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch chart data');
      }
      
      const data = await response.json();
      const formattedData = data.prices.map(([timestamp, price]) => ({
        time: new Date(timestamp).toLocaleDateString(),
        price: price
      }));
      
      setChartData(formattedData);
    } catch (err) {
      console.error('Error fetching chart data:', err);
    }
  };

  const handleCoinClick = (coin) => {
    setSelectedCoin(coin);
    fetchCoinChart(coin.id);
  };

  const formatPrice = (price) => {
    if (price >= 1) {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  const formatPercentage = (percentage) => {
    if (percentage === null || percentage === undefined) return 'N/A';
    const isPositive = percentage >= 0;
    return (
      <span className={`flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
        {Math.abs(percentage).toFixed(2)}%
      </span>
    );
  };

  const sortCoins = (coinsToSort) => {
    return [...coinsToSort].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-900 border border-red-700 rounded-lg p-6 text-center">
              <h2 className="text-xl font-bold mb-2">Error Loading Market Data</h2>
              <p className="text-gray-300 mb-4">{error}</p>
              <button 
                onClick={fetchMarketData}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const sortedCoins = sortCoins(coins);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              CryptoSetu Market
            </h1>
            <div className="flex items-center gap-4 text-gray-300">
              <div className="flex items-center">
                <DollarSign size={20} className="mr-2" />
                <span>Live Prices</span>
              </div>
              <div className="flex items-center">
                <BarChart3 size={20} className="mr-2" />
                <span>Real-time Data</span>
              </div>
            </div>
          </div>

          {/* Market Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-yellow-400">Total Market Cap</h3>
              <p className="text-2xl font-bold">
                {formatMarketCap(coins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0))}
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-yellow-400">24h Volume</h3>
              <p className="text-2xl font-bold">
                {formatMarketCap(coins.reduce((sum, coin) => sum + (coin.total_volume || 0), 0))}
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-yellow-400">Active Cryptocurrencies</h3>
              <p className="text-2xl font-bold">{coins.length}</p>
            </div>
          </div>

          {/* Chart Modal */}
          {selectedCoin && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <img src={selectedCoin.image} alt={selectedCoin.name} className="w-8 h-8 mr-3" />
                    <h2 className="text-2xl font-bold">{selectedCoin.name} Price Chart</h2>
                  </div>
                  <button 
                    onClick={() => setSelectedCoin(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="h-80 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#F59E0B" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400">Current Price</p>
                    <p className="text-xl font-bold">{formatPrice(selectedCoin.current_price)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">24h Change</p>
                    <p>{formatPercentage(selectedCoin.price_change_percentage_24h)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Market Cap</p>
                    <p className="text-lg font-semibold">{formatMarketCap(selectedCoin.market_cap)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Volume (24h)</p>
                    <p className="text-lg font-semibold">{formatMarketCap(selectedCoin.total_volume)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Market Table */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th 
                      className="text-left p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort('market_cap_rank')}
                    >
                      # Rank
                    </th>
                    <th className="text-left p-4">Coin</th>
                    <th 
                      className="text-right p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort('current_price')}
                    >
                      Price
                    </th>
                    <th 
                      className="text-right p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort('price_change_percentage_1h_in_currency')}
                    >
                      1h %
                    </th>
                    <th 
                      className="text-right p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort('price_change_percentage_24h')}
                    >
                      24h %
                    </th>
                    <th 
                      className="text-right p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort('price_change_percentage_7d_in_currency')}
                    >
                      7d %
                    </th>
                    <th 
                      className="text-right p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort('market_cap')}
                    >
                      Market Cap
                    </th>
                    <th 
                      className="text-right p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort('total_volume')}
                    >
                      Volume (24h)
                    </th>
                    <th className="text-center p-4">7d Chart</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCoins.map((coin) => (
                    <tr 
                      key={coin.id} 
                      className="border-t border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={() => handleCoinClick(coin)}
                    >
                      <td className="p-4 font-semibold">{coin.market_cap_rank}</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <img src={coin.image} alt={coin.name} className="w-8 h-8 mr-3" />
                          <div>
                            <div className="font-semibold">{coin.name}</div>
                            <div className="text-gray-400 text-sm uppercase">{coin.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right font-semibold">{formatPrice(coin.current_price)}</td>
                      <td className="p-4 text-right">{formatPercentage(coin.price_change_percentage_1h_in_currency)}</td>
                      <td className="p-4 text-right">{formatPercentage(coin.price_change_percentage_24h)}</td>
                      <td className="p-4 text-right">{formatPercentage(coin.price_change_percentage_7d_in_currency)}</td>
                      <td className="p-4 text-right font-semibold">{formatMarketCap(coin.market_cap)}</td>
                      <td className="p-4 text-right">{formatMarketCap(coin.total_volume)}</td>
                      <td className="p-4">
                        <div className="w-20 h-12">
                          {coin.sparkline_in_7d && coin.sparkline_in_7d.price && (
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={coin.sparkline_in_7d.price.map((price, index) => ({ price, index }))}>
                                <Line 
                                  type="monotone" 
                                  dataKey="price" 
                                  stroke={coin.price_change_percentage_7d_in_currency >= 0 ? "#10B981" : "#EF4444"}
                                  strokeWidth={1.5}
                                  dot={false}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Refresh Button */}
          <div className="mt-8 text-center">
            <button 
              onClick={fetchMarketData}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </>
  );
}