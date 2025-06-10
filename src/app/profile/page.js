'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/heder';
import Image from 'next/image';
import { useAccount, useReadContract } from 'wagmi';
import { useWallets } from '@privy-io/react-auth';
import { formatUnits } from 'viem';
import { 
  User, 
  Wallet, 
  TrendingUp, 
  History, 
  Settings, 
  Shield, 
  Copy, 
  ExternalLink,
  Eye,
  EyeOff,
  Edit3,
  Save,
  X
} from 'lucide-react';
import ABI from '../utils/cstoken.json';

const CONTRACT_CONFIG = {
  address: process.env.NEXT_PUBLIC_CRYPTOSETU_TOKEN_ADDRESS,
  abi: ABI,
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showBalance, setShowBalance] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Crypto Trader',
    email: 'trader@cryptosetu.com',
    joinDate: '2024-01-15',
    bio: 'Passionate cryptocurrency trader and blockchain enthusiast'
  });
  const [editProfile, setEditProfile] = useState(userProfile);

  const { address, isConnected } = useAccount();
  const { wallets } = useWallets();
  const walletAddress = address || wallets?.[0]?.address || '';

  // Fetch CS Token Balance
  const { data: csBalance, refetch: refetchBalance } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'balanceOf',
    args: [walletAddress],
    query: {
      enabled: !!walletAddress && !!CONTRACT_CONFIG.address,
    }
  });

  const formattedCSBalance = csBalance ? formatUnits(csBalance, 18) : '0';

  const copyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress);
        alert('Address copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  const handleSaveProfile = () => {
    setUserProfile(editProfile);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditProfile(userProfile);
    setIsEditing(false);
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const mockTransactions = [
    { id: 1, type: 'Buy', amount: '1000 CS', value: '$100', date: '2024-01-20', status: 'Completed' },
    { id: 2, type: 'Sell', amount: '500 CS', value: '$50', date: '2024-01-18', status: 'Completed' },
    { id: 3, type: 'Buy', amount: '2000 CS', value: '$200', date: '2024-01-15', status: 'Completed' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!isConnected) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-12 h-12 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">Please connect your wallet to view your profile</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 mb-8 border border-gray-700">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center space-x-6 mb-6 md:mb-0">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-900" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-800 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{userProfile.name}</h1>
                  <p className="text-gray-400 mb-2">{userProfile.email}</p>
                  <p className="text-sm text-gray-500">Member since {new Date(userProfile.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-medium transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </div>

          {/* CS Token Balance Card */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Image 
                      src="/logos.png" 
                      alt="CS Token" 
                      width={32} 
                      height={32} 
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">CS Token Balance</h3>
                    <p className="text-purple-100 text-sm">CryptoSetu Token</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
              
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold mb-2">
                    {showBalance ? `${parseFloat(formattedCSBalance).toFixed(2)} CS` : '••••••'}
                  </p>
                  <p className="text-purple-100 text-sm">
                    ≈ ${showBalance ? (parseFloat(formattedCSBalance) * 0.1).toFixed(2) : '••••'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-green-300 text-sm flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12.5%
                  </p>
                  <p className="text-purple-100 text-xs">24h change</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-gray-800 rounded-xl p-2 mb-8 border border-gray-700">
            <div className="flex space-x-2 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-yellow-500 text-black'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Account Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Total Portfolio Value</h3>
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-2xl font-bold text-green-400">$1,250.00</p>
                    <p className="text-sm text-gray-400">+15.2% this month</p>
                  </div>
                  
                  <div className="bg-gray-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Total Trades</h3>
                      <History className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold text-blue-400">47</p>
                    <p className="text-sm text-gray-400">This month</p>
                  </div>
                  
                  <div className="bg-gray-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Success Rate</h3>
                      <Shield className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="text-2xl font-bold text-purple-400">78%</p>
                    <p className="text-sm text-gray-400">Profitable trades</p>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">About</h3>
                  <p className="text-gray-300">{userProfile.bio}</p>
                </div>
              </div>
            )}

            {/* Wallet Tab */}
            {activeTab === 'wallet' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Wallet Information</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Connected Wallet</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-green-400">Connected</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-lg">{truncateAddress(walletAddress)}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={copyAddress}
                          className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Token Holdings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-600 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Image 
                            src="/logos.png" 
                            alt="CS Token" 
                            width={32} 
                            height={32} 
                            className="rounded-full"
                          />
                          <div>
                            <p className="font-semibold">CryptoSetu Token</p>
                            <p className="text-sm text-gray-400">CS</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{parseFloat(formattedCSBalance).toFixed(2)}</p>
                          <p className="text-sm text-gray-400">≈ ${(parseFloat(formattedCSBalance) * 0.1).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
                
                <div className="space-y-4">
                  {mockTransactions.map((tx) => (
                    <div key={tx.id} className="bg-gray-700 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'Buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {tx.type === 'Buy' ? '+' : '-'}
                        </div>
                        <div>
                          <p className="font-semibold">{tx.type} {tx.amount}</p>
                          <p className="text-sm text-gray-400">{tx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{tx.value}</p>
                        <p className={`text-sm ${tx.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                          {tx.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-700 rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Security</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Two-Factor Authentication</span>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">
                          Enabled
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Email Notifications</span>
                        <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm">
                          Configure
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <button
                onClick={handleCancelEdit}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={editProfile.name}
                  onChange={(e) => setEditProfile({...editProfile, name: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={editProfile.email}
                  onChange={(e) => setEditProfile({...editProfile, email: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={editProfile.bio}
                  onChange={(e) => setEditProfile({...editProfile, bio: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSaveProfile}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}