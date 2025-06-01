'use client';

import React, { useState } from 'react'; 
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../public/exx.webp';
import { useConnectWallet, usePrivy, useWallets } from '@privy-io/react-auth';

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);

  const { connectWallet } = useConnectWallet();
  const { logout, ready } = usePrivy();
  const { wallets } = useWallets();

  // Get wallet address
  const walletAddress = wallets?.[0]?.address || '';
  const isConnected = wallets && wallets.length > 0 && walletAddress;

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

  // Disconnect wallet - FIXED VERSION
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

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/swap", label: "Buy Crypto" },
    { href: "/market", label: "Market" },
    { href: "/portfolio", label: "Your Portfolio" },
    { href: "/support", label: "Support" }
  ];

  return (
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
      </ul>

      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}