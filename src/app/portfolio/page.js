'use client'
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, PieChart, BarChart3, Wallet, DollarSign } from 'lucide-react';
import Header from '../../components/heder';
const CryptoPortfolioComponent = () => {
  const [portfolioData, setPortfolioData] = useState([
    {
      id: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: '₿',
      price: 67234,
      holdings: 1.85,
      value: 124383,
      change24h: 3.2,
      color: 'from-orange-400 to-orange-600'
    },
    {
      id: 2,
      name: 'Ethereum',
      symbol: 'ETH',
      icon: 'Ξ',
      price: 3456,
      holdings: 12.5,
      value: 43200,
      change24h: 5.7,
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 3,
      name: 'Solana',
      symbol: 'SOL',
      icon: '◎',
      price: 142,
      holdings: 156,
      value: 22152,
      change24h: -2.1,
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 4,
      name: 'Cardano',
      symbol: 'ADA',
      icon: 'A',
      price: 0.89,
      holdings: 2500,
      value: 2225,
      change24h: 1.8,
      color: 'from-cyan-400 to-cyan-600'
    }
  ]);

  const [totalValue, setTotalValue] = useState(0);
  const [totalChange, setTotalChange] = useState(0);

  useEffect(() => {
    const total = portfolioData.reduce((sum, asset) => sum + asset.value, 0);
    const weightedChange = portfolioData.reduce((sum, asset) => 
      sum + (asset.change24h * asset.value / total), 0
    );
    setTotalValue(total);
    setTotalChange(weightedChange);
  }, [portfolioData]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  return (
    <>
        <Header />
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Portfolio</p>
              <p className="text-3xl font-bold text-white mt-1">{formatCurrency(totalValue)}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-green-400/30 transition-all duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">24h Change</p>
              <p className={`text-3xl font-bold mt-1 ${totalChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalChange >= 0 ? '+' : ''}{formatNumber(totalChange, 1)}%
              </p>
            </div>
            <div className={`p-3 rounded-xl ${totalChange >= 0 ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-red-400 to-red-500'}`}>
              {totalChange >= 0 ? <TrendingUp className="w-6 h-6 text-white" /> : <TrendingDown className="w-6 h-6 text-white" />}
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-400/30 transition-all duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Assets</p>
              <p className="text-3xl font-bold text-white mt-1">{portfolioData.length}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl">
              <PieChart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-yellow-400/30 transition-all duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Best Performer</p>
              <p className="text-3xl font-bold text-white mt-1">ETH</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Table */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-cyan-400" />
            Current Holdings
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="text-left p-4 text-gray-300 font-semibold">Asset</th>
                <th className="text-right p-4 text-gray-300 font-semibold">Price</th>
                <th className="text-right p-4 text-gray-300 font-semibold">Holdings</th>
                <th className="text-right p-4 text-gray-300 font-semibold">Value</th>
                <th className="text-right p-4 text-gray-300 font-semibold">24h Change</th>
                <th className="text-right p-4 text-gray-300 font-semibold">Allocation</th>
              </tr>
            </thead>
            <tbody>
              {portfolioData.map((asset, index) => (
                <tr key={asset.id} className="border-b border-white/5 hover:bg-white/5 transition-all duration-200 group">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${asset.color} flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                        {asset.icon}
                      </div>
                      <div>
                        <div className="text-white font-semibold text-lg">{asset.name}</div>
                        <div className="text-gray-400 text-sm">{asset.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-white font-semibold">{formatCurrency(asset.price)}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-white font-semibold">{formatNumber(asset.holdings)} {asset.symbol}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-white font-bold text-lg">{formatCurrency(asset.value)}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className={`font-bold text-lg flex items-center justify-end gap-1 ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {asset.change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {asset.change24h >= 0 ? '+' : ''}{formatNumber(asset.change24h, 1)}%
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="text-white font-semibold">{formatNumber((asset.value / totalValue) * 100, 1)}%</div>
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${asset.color} transition-all duration-500`}
                          style={{ width: `${(asset.value / totalValue) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-cyan-400/30 transition-all duration-300">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Portfolio Performance
          </h3>
          <div className="h-64 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-cyan-400 mx-auto mb-4 opacity-50" />
              <p className="text-gray-400">Performance Chart</p>
              <p className="text-gray-500 text-sm">Integration with Chart.js or Recharts</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-400/30 transition-all duration-300">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-400" />
            Asset Allocation
          </h3>
          <div className="h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
            <div className="text-center">
              <PieChart className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
              <p className="text-gray-400">Allocation Chart</p>
              <p className="text-gray-500 text-sm">Pie chart showing distribution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CryptoPortfolioComponent;