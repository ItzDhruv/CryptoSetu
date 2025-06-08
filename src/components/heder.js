'use client';

import React, { useState, useEffect } from 'react'; 
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../public/exx.webp';
import { useConnectWallet, usePrivy, useWallets } from '@privy-io/react-auth';

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCSPopup, setShowCSPopup] = useState(false);
  const [csBalance, setCsBalance] = useState(0);
  const [ethAmount, setEthAmount] = useState('');
  const [csAmount, setCsAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const { connectWallet } = useConnectWallet();
  const { logout, ready } = usePrivy();
  const { wallets } = useWallets();

  // CS Token exchange rate (1 ETH = 1000 CS for example)
  const CS_EXCHANGE_RATE = 1000;

  // Get wallet address
  const walletAddress = wallets?.[0]?.address || '';
  const isConnected = wallets && wallets.length > 0 && walletAddress;

  // Simulate fetching CS balance (replace with actual contract call)
  useEffect(() => {
    if (isConnected) {
      // This would be replaced with actual smart contract call
      // For demo purposes, using localStorage to persist balance
      const savedBalance = localStorage.getItem(`cs_balance_${walletAddress}`);
      setCsBalance(parseFloat(savedBalance) || 0);
    }
  }, [isConnected, walletAddress]);

  // Truncate wallet address
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Copy address to clipboard
  const copyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress);
        alert('Address copied!');
      } catch (err) {
        const textArea = document.createElement('textarea');
        textArea.value = walletAddress;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Address copied!');
      }
    }
    setShowDropdown(false);
  };

  // Disconnect wallet
  const handleDisconnect = async () => {
    try {
      setShowDropdown(false);
      await logout();
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  // Connect wallet
  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Connect failed:', error);
    }
  };

  // Handle ETH input change
  const handleEthChange = (e) => {
    const value = e.target.value;
    setEthAmount(value);
    setCsAmount(value ? (parseFloat(value) * CS_EXCHANGE_RATE).toFixed(2) : '');
  };

  // Handle CS input change
  const handleCsChange = (e) => {
    const value = e.target.value;
    setCsAmount(value);
    setEthAmount(value ? (parseFloat(value) / CS_EXCHANGE_RATE).toFixed(6) : '');
  };

  // Buy CS tokens
  const handleBuyCS = async () => {
    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      alert('Please enter a valid ETH amount');
      return;
    }

    setLoading(true);
    try {
      // This would be replaced with actual smart contract interaction
      // For demo purposes, simulating the purchase
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newBalance = csBalance + parseFloat(csAmount);
      setCsBalance(newBalance);
      
      // Save to localStorage (replace with actual contract state)
      localStorage.setItem(`cs_balance_${walletAddress}`, newBalance.toString());
      
      alert(`Successfully purchased ${csAmount} CS tokens!`);
      setShowCSPopup(false);
      setEthAmount('');
      setCsAmount('');
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/swap", label: "Buy Crypto" },
    { href: "/market", label: "Market" },
    { href: "/portfolio", label: "Your Portfolio" },
    { href: "/support", label: "Support" }
  ];

  return (
    <>
      <div className=''>
        <ul className="flex items-center justify-between p-4 w-full">
          <div className="flex space-x-20 items-center">
            <li>
              <Link href="/" className="flex flex-col items-center no-underline text-yellow-400">
                <Image src={Logo} alt="Logo" width={40} height={40} />
                <h3>CRYPTOSETU</h3>
              </Link>
            </li>
            {navItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href} className="no-underline text-white hover:text-amber-300">
                  {item.label}
                </Link>
              </li>
            ))}
          </div>
          
          <div className="flex items-center space-x-3">
            {/* CS Token Balance */}
            {isConnected && (
              <button
                onClick={() => setShowCSPopup(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-md font-medium text-sm
                           hover:from-purple-600 hover:to-pink-600 hover:shadow-lg hover:scale-105 
                           transition-all duration-200 ease-in-out
                           border-2 border-transparent hover:border-purple-300
                           active:scale-95 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8.070 7.681 8.433 7.418zM11 12.849v-1.698c.22.071.412.164.567.267.364.263.364.922 0 1.185A2.305 2.305 0 0111 12.849z"/>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6.602 7.766 7.324 8.246 7.676 8.57 8.065 8.8 8.5 8.971V11.5c-.356.046-.68.166-.923.374-.568.384-.568 1.015 0 1.399.243.208.567.328.923.374V14a1 1 0 102 0v-.252c.607-.046 1.167-.214 1.676-.662.722-.48.722-2.012 0-2.492-.354-.32-.743-.548-1.176-.719V8.971c.356-.046.68-.166.923-.374.568-.384.568-1.015 0-1.399A3.536 3.536 0 0011 6.844V6z" clipRule="evenodd"/>
                </svg>
                <span>{csBalance.toFixed(2)} CS</span>
              </button>
            )}

            {/* Wallet Connection */}
            <li className='relative'>
              {!ready ? (
                <div className="bg-gray-400 text-gray-600 px-4 py-1.5 rounded-md font-medium text-sm">
                  Loading...
                </div>
              ) : !isConnected ? (
                <button 
                  onClick={handleConnectWallet}
                  className="bg-yellow-400 text-blue-900 px-4 py-1.5 rounded-md font-medium text-sm
                             hover:bg-yellow-300 hover:shadow-lg hover:scale-105 
                             transition-all duration-200 ease-in-out
                             border-2 border-transparent hover:border-yellow-200
                             active:scale-95"
                >
                  Connect
                </button>
              ) : (
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="bg-yellow-400 text-blue-900 px-4 py-1.5 rounded-md font-medium text-sm
                               hover:bg-yellow-300 hover:shadow-lg hover:scale-105 
                               transition-all duration-200 ease-in-out
                               border-2 border-transparent hover:border-yellow-200
                               active:scale-95 flex items-center space-x-2"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{truncateAddress(walletAddress)}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      <div className="py-1">
                        <button
                          onClick={copyAddress}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy Address
                        </button>
                        <button
                          onClick={handleDisconnect}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Disconnect
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </li>
          </div>
        </ul>

        {showDropdown && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
        )}
      </div>

      {/* CS Token Purchase Popup */}
      {showCSPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8.070 7.681 8.433 7.418zM11 12.849v-1.698c.22.071.412.164.567.267.364.263.364.922 0 1.185A2.305 2.305 0 0111 12.849z"/>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6.602 7.766 7.324 8.246 7.676 8.57 8.065 8.8 8.5 8.971V11.5c-.356.046-.68.166-.923.374-.568.384-.568 1.015 0 1.399.243.208.567.328.923.374V14a1 1 0 102 0v-.252c.607-.046 1.167-.214 1.676-.662.722-.48.722-2.012 0-2.492-.354-.32-.743-.548-1.176-.719V8.971c.356-.046.68-.166.923-.374.568-.384.568-1.015 0-1.399A3.536 3.536 0 0011 6.844V6z" clipRule="evenodd"/>
                </svg>
                Buy CS Tokens
              </h2>
              <button
                onClick={() => setShowCSPopup(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Current Balance */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Current CS Balance</p>
                <p className="text-2xl font-bold text-purple-600">{csBalance.toFixed(2)} CS</p>
              </div>

              {/* Exchange Rate */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  Exchange Rate: 1 ETH = {CS_EXCHANGE_RATE.toLocaleString()} CS
                </p>
              </div>

              {/* ETH Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pay with ETH (Sepolia)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={ethAmount}
                    onChange={handleEthChange}
                    placeholder="0.00"
                    step="0.000001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-bold text-green-600 placeholder-gray-400"
                  />
                  <span className="absolute right-3 top-3 text-green-600 font-bold text-lg">ETH</span>
                </div>
              </div>

              {/* CS Output */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Receive CS Tokens
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={csAmount}
                    onChange={handleCsChange}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-bold text-green-600 placeholder-gray-400"
                  />
                  <span className="absolute right-3 top-3 text-green-600 font-bold text-lg">CS</span>
                </div>
              </div>

              {/* Buy Button */}
              <button
                onClick={handleBuyCS}
                disabled={loading || !ethAmount || parseFloat(ethAmount) <= 0}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-medium text-lg
                           hover:from-purple-700 hover:to-pink-700 transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Buy CS Tokens</span>
                  </>
                )}
              </button>

              {/* Network Info */}
              <div className="text-center text-sm text-gray-500">
                <p>Network: Ethereum Sepolia Testnet</p>
                <p>Make sure you have sufficient ETH for gas fees</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}