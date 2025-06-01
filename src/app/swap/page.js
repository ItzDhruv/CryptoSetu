'use client';

import React, { useState } from 'react';
import Header from '../../components/heder';

export default function SwapPage() {
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [amount, setAmount] = useState('');

  return (
  <>
  <Header />
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <div className="w-120 h-120 ml-30">
       <img src="/logos.png" alt="Logo" className="w-full h-full object-contain rounded-2xl" />
      </div>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          Swap Tokens
        </h1>
        
        <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
          <div className="space-y-4">
            {/* From Token */}
            <div className="space-y-2">
              <label className="text-gray-300">From</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <select
                  value={fromToken}
                  onChange={(e) => setFromToken(e.target.value)}
                  className="bg-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Select Token</option>
                  <option value="ETH">ETH</option>
                  <option value="USDT">USDT</option>
                  <option value="USDC">USDC</option>
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            {/* To Token */}
            <div className="space-y-2">
              <label className="text-gray-300">To</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="0.0"
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  readOnly
                />
                <select
                  value={toToken}
                  onChange={(e) => setToToken(e.target.value)}
                  className="bg-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Select Token</option>
                  <option value="ETH">ETH</option>
                  <option value="USDT">USDT</option>
                  <option value="USDC">USDC</option>
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-4 rounded-lg transition-colors mt-6">
              Swap
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}