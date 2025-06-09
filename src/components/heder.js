'use client';

import React, { useState, useEffect } from 'react'; 
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../public/exx.webp';
import { useConnectWallet, usePrivy, useWallets } from '@privy-io/react-auth';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatUnits } from 'viem';

import ABI from '../app/utils/cstoken.json'

const CONTRACT_CONFIG = {
  address: process.env.NEXT_PUBLIC_CRYPTOSETU_TOKEN_ADDRESS,
  abi: ABI,
};

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showCSPopup, setShowCSPopup] = useState(false);
  const [ethAmount, setEthAmount] = useState('');
  const [csAmount, setCsAmount] = useState('');
  const [isTransactionPending, setIsTransactionPending] = useState(false);

  const { connectWallet } = useConnectWallet();
  const { logout, ready } = usePrivy();
  const { wallets } = useWallets();
  const { address, isConnected } = useAccount();

  const walletAddress = address || wallets?.[0]?.address || '';

  const { data: csBalance, refetch: refetchBalance } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'balanceOf',
    args: [walletAddress],
    query: {
      enabled: !!walletAddress && !!CONTRACT_CONFIG.address,
    }
  });

  const { writeContract, data: hash, error: writeError, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const formattedCSBalance = csBalance ? formatUnits(csBalance, 18) : '0';
  const CS_TO_ETH_RATE = 0.0001;

  useEffect(() => {
    if (isConfirmed) {
      refetchBalance();
      setShowCSPopup(false);
      setEthAmount('');
      setCsAmount('');
      setIsTransactionPending(false);
    }
  }, [isConfirmed, refetchBalance]);

  useEffect(() => {
    if (writeError) {
      console.error('Transaction error:', writeError);
      alert(`Transaction failed: ${writeError.shortMessage || writeError.message}`);
      setIsTransactionPending(false);
    }
  }, [writeError]);

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

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

  const handleDisconnect = async () => {
    try {
      setShowDropdown(false);
      await logout();
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Connect failed:', error);
    }
  };

  const handleEthChange = (e) => {
    const value = e.target.value;
    setEthAmount(value);
    setCsAmount(value ? (parseFloat(value) / CS_TO_ETH_RATE).toFixed(0) : '');
  };

  const handleCsChange = (e) => {
    const value = e.target.value;
    setCsAmount(value);
    setEthAmount(value ? (parseFloat(value) * CS_TO_ETH_RATE).toFixed(6) : '');
  };

  const handleBuyCS = async () => {
    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      alert('Please enter a valid ETH amount');
      return;
    }

    if (!csAmount || parseFloat(csAmount) <= 0) {
      alert('Invalid CS token amount');
      return;
    }

    if (!CONTRACT_CONFIG.address) {
      alert('Contract address not configured');
      return;
    }

    try {
      setIsTransactionPending(true);
      
      await writeContract({
        ...CONTRACT_CONFIG,
        functionName: 'buyToken',
        args: [BigInt(csAmount), walletAddress],
        value: parseEther(ethAmount)
      });

    } catch (error) {
      console.error('Purchase failed:', error);
      setIsTransactionPending(false);
      alert(`Purchase failed: ${error.shortMessage || error.message}`);
    }
  };

  const navItems = [
    { href: "/swap", label: "Exchange" },
    { href: "/market", label: "Market" },
    { href: "/nft", label: "NFT" },
    { href: "/stake", label: "Staking" },
  ];

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-900/95 border-b border-slate-800/50 shadow-lg">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Section - Top Left */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <Image 
                    src={Logo} 
                    alt="CryptoSetu Logo" 
                    width={36} 
                    height={36} 
                    className="rounded-lg group-hover:scale-110 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400/20 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
                    CRYPTOSETU
                  </h1>
                </div>
              </Link>
            </div>

            {/* Navigation - Center */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-medium text-slate-300 hover:text-white 
                             rounded-lg transition-all duration-200 hover:bg-slate-800/50 
                             group flex items-center space-x-2"
                >
                  <svg className="w-4 h-4 opacity-70 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24">
                    <path d={item.icon} />
                  </svg>
                  <span>{item.label}</span>
                  <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-yellow-400/0 via-yellow-400/70 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </Link>
              ))}
            </nav>

            {/* Wallet Section - Top Right */}
            <div className="flex items-center space-x-3">
              
              {/* CS Token Balance */}
              {isConnected && (
                <button
                  onClick={() => setShowCSPopup(true)}
                  className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 
                             hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-medium
                             transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6.602 7.766 7.324 8.246 7.676 8.57 8.065 8.8 8.5 8.971V11.5c-.356.046-.68.166-.923.374-.568.384-.568 1.015 0 1.399.243.208.567.328.923.374V14a1 1 0 102 0v-.252c.607-.046 1.167-.214 1.676-.662.722-.48.722-2.012 0-2.492-.354-.32-.743-.548-1.176-.719V8.971c.356-.046.68-.166.923-.374.568-.384.568-1.015 0-1.399A3.536 3.536 0 0011 6.844V6z" clipRule="evenodd"/>
                  </svg>
                  <span>{parseFloat(formattedCSBalance).toFixed(2)} CS</span>
                </button>
              )}

              {/* Profile Dropdown */}
              {isConnected && (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white 
                               rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                      <div className="py-1">
                        <Link 
                          href="/profile"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </Link>
                        <Link 
                          href="/support"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-150"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.196L12 21.804M21.804 12L2.196 12" />
                          </svg>
                          Support
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Wallet Connect Button */}
              <div className="relative">
                {!ready ? (
                  <div className="px-4 py-2 bg-slate-700 text-slate-400 rounded-lg text-sm font-medium">
                    Loading...
                  </div>
                ) : !isConnected ? (
                  <button 
                    onClick={handleConnectWallet}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 
                               text-slate-900 font-semibold rounded-lg text-sm transition-all duration-200 
                               hover:shadow-lg hover:scale-105 active:scale-95 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Connect Wallet</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 
                               hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg text-sm
                               transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
                  >
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                    <span className="hidden sm:inline">{truncateAddress(walletAddress)}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}

                {/* Wallet Dropdown */}
                {showDropdown && isConnected && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                    <div className="py-1">
                      <button
                        onClick={copyAddress}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Address
                      </button>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={handleDisconnect}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
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

              {/* Mobile Menu Button */}
              <button className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile CS Token Balance */}
        {isConnected && (
          <div className="sm:hidden px-4 pb-3">
            <button
              onClick={() => setShowCSPopup(true)}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 
                         hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-medium
                         transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6.602 7.766 7.324 8.246 7.676 8.57 8.065 8.8 8.5 8.971V11.5c-.356.046-.68.166-.923.374-.568.384-.568 1.015 0 1.399.243.208.567.328.923.374V14a1 1 0 102 0v-.252c.607-.046 1.167-.214 1.676-.662.722-.48.722-2.012 0-2.492-.354-.32-.743-.548-1.176-.719V8.971c.356-.046.68-.166.923-.374.568-.384.568-1.015 0-1.399A3.536 3.536 0 0011 6.844V6z" clipRule="evenodd"/>
              </svg>
              <span>{parseFloat(formattedCSBalance).toFixed(2)} CS Tokens</span>
            </button>
          </div>
        )}
      </header>

      {/* Overlay for closing dropdowns */}
      {(showDropdown || showProfileDropdown) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setShowDropdown(false);
            setShowProfileDropdown(false);
          }}
        />
      )}

      {/* CS Token Purchase Popup */}
      {showCSPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6.602 7.766 7.324 8.246 7.676 8.57 8.065 8.8 8.5 8.971V11.5c-.356.046-.68.166-.923.374-.568.384-.568 1.015 0 1.399.243.208.567.328.923.374V14a1 1 0 102 0v-.252c.607-.046 1.167-.214 1.676-.662.722-.48.722-2.012 0-2.492-.354-.32-.743-.548-1.176-.719V8.971c.356-.046.68-.166.923-.374.568-.384.568-1.015 0-1.399A3.536 3.536 0 0011 6.844V6z" clipRule="evenodd"/>
                  </svg>
                </div>
                Buy CS Tokens
              </h2>
              <button
                onClick={() => setShowCSPopup(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Current Balance */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {parseFloat(formattedCSBalance).toFixed(2)} CS
                </p>
              </div>

              {/* Exchange Rate */}
              <div className="bg-gray-50 p-3 rounded-xl text-center">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Exchange Rate:</span> 1 CS = 0.0001 ETH
                </p>
              </div>

              {/* ETH Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Pay with ETH (Sepolia)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={ethAmount}
                    onChange={handleEthChange}
                    placeholder="0.000000"
                    step="0.000001"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-bold text-green-600 placeholder-gray-400"
                  />
                  <span className="absolute right-4 top-3 text-gray-500 font-medium">ETH</span>
                </div>
              </div>

              {/* CS Output */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Receive CS Tokens
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={csAmount}
                    onChange={handleCsChange}
                    placeholder="0"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-bold text-green-600 placeholder-gray-400"
                  />
                  <span className="absolute right-4 top-3 text-gray-500 font-medium">CS</span>
                </div>
              </div>

              {/* Transaction Status */}
              {hash && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
                  <p className="text-sm font-medium text-blue-700">
                    {isConfirming ? '⏳ Confirming transaction...' : '✅ Transaction submitted!'}
                  </p>
                  <p className="text-xs text-blue-600 break-all mt-1">
                    Hash: {hash.slice(0, 20)}...
                  </p>
                </div>
              )}

              {/* Buy Button */}
              <button
                onClick={handleBuyCS}
                disabled={isPending || isConfirming || isTransactionPending || !ethAmount || parseFloat(ethAmount) <= 0 || !CONTRACT_CONFIG.address}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 
                           text-white py-3 px-4 rounded-xl font-semibold text-lg transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-600 disabled:hover:to-pink-600
                           flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                {(isPending || isConfirming || isTransactionPending) ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>
                      {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Submitting...'}
                    </span>
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
              <div className="text-center text-xs text-gray-500 space-y-1">
                <p>🌐 Network: Ethereum Sepolia Testnet</p>
                <p>⚡ Ensure sufficient ETH for gas fees</p>
                {!CONTRACT_CONFIG.address && (
                  <p className="text-red-500 font-medium">⚠️ Contract address not configured</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}