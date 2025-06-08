'use client';

import React, { useState, useEffect } from 'react';
import { useWallets, usePrivy } from '@privy-io/react-auth';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Star, Eye, EyeOff, RefreshCw, Award } from 'lucide-react';
import Header from '../../components/heder';

export default function PortfolioPage() {
  const { wallets } = useWallets();
  const { ready, authenticated } = usePrivy();
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 0,
    totalChange24h: 0,
    tokens: []
  });

  const walletAddress = wallets?.[0]?.address || '';
  const isConnected = wallets && wallets.length > 0 && walletAddress;

  // Mock portfolio data - In real app, this would come from blockchain/API
  const mockPortfolioData = {
    totalValue: 12847.32,
    totalChange24h: 5.67,
    tokens: [
      {
        id: 'cs-token',
        name: 'CryptoSetu Token',
        symbol: 'CS',
        balance: 2500.00,
        price: 1.25,
        value: 3125.00,
        change24h: 8.45,
        isNative: true,
        logo: '/exx.webp',
        allocation: 24.3
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        balance: 2.5,
        price: 2340.50,
        value: 5851.25,
        change24h: 3.21,
        isNative: false,
        logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        allocation: 45.5
      },
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        balance: 0.08,
        price: 43250.00,
        value: 3460.00,
        change24h: -1.23,
        isNative: false,
        logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
        allocation: 26.9
      },
      {
        id: 'usdt',
        name: 'Tether USD',
        symbol: 'USDT',
        balance: 411.07,
        price: 1.00,
        value: 411.07,
        change24h: 0.01,
        isNative: false,
        logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
        allocation: 3.2
      }
    ]
  };

  // Performance data for charts
  const performanceData = [
    { time: '1D', value: 12847 },
    { time: '1W', value: 11200 },
    { time: '1M', value: 9800 },
    { time: '3M', value: 8500 },
    { time: '6M', value: 7200 },
    { time: '1Y', value: 5000 }
  ];

  const allocationData = mockPortfolioData.tokens.map(token => ({
    name: token.symbol,
    value: token.allocation,
    color: token.isNative ? '#F59E0B' : token.symbol === 'ETH' ? '#627EEA' : token.symbol === 'BTC' ? '#F7931A' : '#26A17B'
  }));

  useEffect(() => {
    if (ready) {
      fetchPortfolioData();
    }
  }, [ready, isConnected]);

  const fetchPortfolioData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPortfolioData(mockPortfolioData);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPortfolioData();
    setRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return balanceVisible ? `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '****';
  };

  const formatTokenAmount = (amount, decimals = 4) => {
    return balanceVisible ? amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: decimals }) : '****';
  };

  const formatPercentage = (percentage) => {
    const isPositive = percentage >= 0;
    return (
      <span className={`flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
        {Math.abs(percentage).toFixed(2)}%
      </span>
    );
  };

  if (!ready) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
        </div>
      </>
    );
  }

  if (!authenticated || !isConnected) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
          <div className="max-w-4xl mx-auto px-8 py-20 text-center">
            <div className="bg-gray-800 rounded-2xl p-12 border border-gray-700">
              <Wallet className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4 text-yellow-400">Connect Your Wallet</h1>
              <p className="text-gray-300 text-lg mb-8">
                Please connect your wallet to view your portfolio and track your CryptoSetu tokens.
              </p>
              <div className="bg-gray-700 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4 text-yellow-400">What you'll see after connecting:</h3>
                <ul className="text-left space-y-2 text-gray-300">
                  <li className="flex items-center"><Star className="w-5 h-5 text-yellow-400 mr-2" /> Your CS Token balance and rewards</li>
                  <li className="flex items-center"><DollarSign className="w-5 h-5 text-green-400 mr-2" /> Total portfolio value</li>
                  <li className="flex items-center"><TrendingUp className="w-5 h-5 text-blue-400 mr-2" /> Performance analytics</li>
                  <li className="flex items-center"><Wallet className="w-5 h-5 text-purple-400 mr-2" /> All token holdings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

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

  const csToken = portfolioData.tokens.find(token => token.isNative);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Your Portfolio
              </h1>
              <p className="text-gray-400">Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                {balanceVisible ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* CS Token Highlight */}
          {csToken && (
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 mb-8 border border-yellow-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Award className="w-8 h-8 text-black" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-yellow-400">CryptoSetu Token (CS)</h2>
                    <p className="text-gray-300">Your native platform token</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-yellow-400">
                    {formatTokenAmount(csToken.balance)} CS
                  </div>
                  <div className="text-xl text-gray-300">
                    {formatCurrency(csToken.value)}
                  </div>
                  <div className="mt-1">
                    {formatPercentage(csToken.change24h)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-300">Total Portfolio Value</h3>
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {formatCurrency(portfolioData.totalValue)}
              </div>
              <div className="flex items-center">
                {formatPercentage(portfolioData.totalChange24h)}
                <span className="text-gray-400 ml-2">24h</span>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-300">Total Tokens</h3>
                <Wallet className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {portfolioData.tokens.length}
              </div>
              <div className="text-gray-400">
                Including {portfolioData.tokens.filter(t => t.isNative).length} native token
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-300">Best Performer</h3>
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-xl font-bold text-white mb-1">
                {portfolioData.tokens.reduce((best, token) => 
                  token.change24h > best.change24h ? token : best
                ).symbol}
              </div>
              <div className="text-green-400 font-semibold">
                +{portfolioData.tokens.reduce((best, token) => 
                  token.change24h > best.change24h ? token : best
                ).change24h.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Portfolio Allocation */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-6 text-yellow-400">Portfolio Allocation</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value.toFixed(1)}%`, 'Allocation']}
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {allocationData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-300">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-6 text-yellow-400">Portfolio Performance</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Token Holdings */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-yellow-400">Token Holdings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="text-left p-4">Token</th>
                    <th className="text-right p-4">Balance</th>
                    <th className="text-right p-4">Price</th>
                    <th className="text-right p-4">Value</th>
                    <th className="text-right p-4">24h Change</th>
                    <th className="text-right p-4">Allocation</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.tokens.map((token) => (
                    <tr 
                      key={token.id} 
                      className={`border-t border-gray-700 hover:bg-gray-700 transition-colors ${
                        token.isNative ? 'bg-yellow-500/5 border-yellow-500/20' : ''
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3 overflow-hidden">
                            {token.isNative ? (
                              <Award className="w-6 h-6 text-yellow-400" />
                            ) : (
                              <div className="w-8 h-8 bg-gray-500 rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold flex items-center">
                              {token.name}
                              {token.isNative && (
                                <Star className="w-4 h-4 text-yellow-400 ml-2" />
                              )}
                            </div>
                            <div className="text-gray-400 text-sm uppercase">{token.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right font-semibold">
                        {formatTokenAmount(token.balance)} {token.symbol}
                      </td>
                      <td className="p-4 text-right">
                        {formatCurrency(token.price)}
                      </td>
                      <td className="p-4 text-right font-semibold">
                        {formatCurrency(token.value)}
                      </td>
                      <td className="p-4 text-right">
                        {formatPercentage(token.change24h)}
                      </td>
                      <td className="p-4 text-right text-gray-300">
                        {token.allocation.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CS Token Benefits */}
          <div className="mt-8 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-8 border border-yellow-500/20">
            <h3 className="text-2xl font-bold mb-6 text-yellow-400">CS Token Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-yellow-400" />
                </div>
                <h4 className="font-semibold mb-2">Reduced Trading Fees</h4>
                <p className="text-gray-300 text-sm">Get up to 50% discount on trading fees when paying with CS tokens</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-yellow-400" />
                </div>
                <h4 className="font-semibold mb-2">Exclusive Features</h4>
                <p className="text-gray-300 text-sm">Access premium features and early access to new products</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-yellow-400" />
                </div>
                <h4 className="font-semibold mb-2">Staking Rewards</h4>
                <p className="text-gray-300 text-sm">Earn passive income by staking your CS tokens</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}