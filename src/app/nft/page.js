'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/heder';
import Image from 'next/image';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Heart, 
  Share2, 
  Eye, 
  TrendingUp, 
  Star,
  ShoppingCart,
  Zap,
  Award,
  Users,
  Clock,
  Flame
} from 'lucide-react';

export default function NFTMarketplace() {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [likedNFTs, setLikedNFTs] = useState(new Set());

  // Mock NFT data
  const nftCollections = [
    {
      id: 1,
      name: "Crypto Punks Elite",
      image: "/logos.png",
      price: "2.5 ETH",
      usdPrice: "$4,250",
      creator: "CryptoPunk Labs",
      likes: 1247,
      views: 5420,
      category: "art",
      rarity: "legendary",
      isHot: true,
      timeLeft: "2d 14h",
      description: "Exclusive collection of elite crypto punks with rare attributes"
    },
    {
      id: 2,
      name: "Digital Dragons",
      image: "/logos.png",
      price: "1.8 ETH",
      usdPrice: "$3,060",
      creator: "Dragon Studios",
      likes: 892,
      views: 3210,
      category: "gaming",
      rarity: "epic",
      isHot: false,
      timeLeft: "5d 8h",
      description: "Mythical dragons living in the blockchain realm"
    },
    {
      id: 3,
      name: "Neon Cityscapes",
      image: "/logos.png",
      price: "0.9 ETH",
      usdPrice: "$1,530",
      creator: "Future Vision",
      likes: 654,
      views: 2180,
      category: "art",
      rarity: "rare",
      isHot: true,
      timeLeft: "1d 22h",
      description: "Cyberpunk-inspired cityscapes from the future"
    },
    {
      id: 4,
      name: "Space Explorers",
      image: "/logos.png",
      price: "3.2 ETH",
      usdPrice: "$5,440",
      creator: "Cosmic Arts",
      likes: 1856,
      views: 7890,
      category: "collectibles",
      rarity: "legendary",
      isHot: true,
      timeLeft: "3d 5h",
      description: "Brave explorers venturing into the unknown cosmos"
    },
    {
      id: 5,
      name: "Pixel Warriors",
      image: "/logos.png",
      price: "1.2 ETH",
      usdPrice: "$2,040",
      creator: "Retro Games",
      likes: 743,
      views: 2950,
      category: "gaming",
      rarity: "epic",
      isHot: false,
      timeLeft: "4d 12h",
      description: "8-bit warriors ready for battle in the metaverse"
    },
    {
      id: 6,
      name: "Abstract Minds",
      image: "/logos.png",
      price: "0.7 ETH",
      usdPrice: "$1,190",
      creator: "Mind Bender",
      likes: 432,
      views: 1560,
      category: "art",
      rarity: "rare",
      isHot: false,
      timeLeft: "6d 18h",
      description: "Abstract representations of consciousness and thought"
    }
  ];

  const categories = [
    { id: 'all', label: 'All Categories', icon: Grid },
    { id: 'art', label: 'Digital Art', icon: Star },
    { id: 'gaming', label: 'Gaming', icon: Zap },
    { id: 'collectibles', label: 'Collectibles', icon: Award },
    { id: 'music', label: 'Music', icon: Users },
  ];

  const sortOptions = [
    { id: 'trending', label: 'Trending' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'newest', label: 'Newest' },
    { id: 'oldest', label: 'Oldest' },
    { id: 'most-liked', label: 'Most Liked' },
  ];

  const toggleLike = (nftId) => {
    const newLikedNFTs = new Set(likedNFTs);
    if (newLikedNFTs.has(nftId)) {
      newLikedNFTs.delete(nftId);
    } else {
      newLikedNFTs.add(nftId);
    }
    setLikedNFTs(newLikedNFTs);
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400 bg-yellow-400/20';
      case 'epic': return 'text-purple-400 bg-purple-400/20';
      case 'rare': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const filteredNFTs = nftCollections.filter(nft => {
    const matchesCategory = selectedCategory === 'all' || nft.category === selectedCategory;
    const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nft.creator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-teal-900/50">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-20">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                CryptoSetu NFT Marketplace
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Discover, collect, and trade extraordinary NFTs from the world&apos;s most talented creators
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { number: "50K+", label: "NFTs", icon: Award },
                  { number: "15K+", label: "Creators", icon: Users },
                  { number: "₹2.5Cr+", label: "Volume", icon: TrendingUp },
                  { number: "99.9%", label: "Uptime", icon: Zap }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <Icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{stat.number}</div>
                      <div className="text-gray-300 text-sm">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Search and Filters */}
          <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search NFTs, creators, collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4">
                
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode */}
                <div className="flex bg-gray-700 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>

          {/* NFT Grid */}
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredNFTs.map((nft) => (
              <div
                key={nft.id}
                className={`group bg-gray-800 rounded-2xl border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden ${
                  viewMode === 'list' ? 'flex items-center p-4' : 'p-4'
                }`}
              >
                
                {/* NFT Image */}
                <div className={`relative ${viewMode === 'list' ? 'w-24 h-24 mr-6' : 'w-full h-64 mb-4'} rounded-xl overflow-hidden`}>
                  <Image
                    src={nft.image}
                    alt={nft.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Hot Badge */}
                  {nft.isHot && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center">
                      <Flame className="w-3 h-3 mr-1" />
                      HOT
                    </div>
                  )}

                  {/* Rarity Badge */}
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold capitalize ${getRarityColor(nft.rarity)}`}>
                    {nft.rarity}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                    <button
                      onClick={() => toggleLike(nft.id)}
                      className={`p-2 rounded-full transition-colors ${
                        likedNFTs.has(nft.id) ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${likedNFTs.has(nft.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 bg-white/20 text-white hover:bg-white/30 rounded-full transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-white/20 text-white hover:bg-white/30 rounded-full transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* NFT Info */}
                <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className={`${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}>
                    <div className={`${viewMode === 'list' ? 'flex-1' : 'mb-3'}`}>
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                        {nft.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">by {nft.creator}</p>
                      {viewMode === 'grid' && (
                        <p className="text-gray-500 text-xs line-clamp-2">{nft.description}</p>
                      )}
                    </div>

                    {/* Price and Actions */}
                    <div className={`${viewMode === 'list' ? 'text-right ml-6' : ''}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-xl font-bold text-white">{nft.price}</p>
                          <p className="text-gray-400 text-sm">{nft.usdPrice}</p>
                        </div>
                        {viewMode === 'grid' && (
                          <div className="text-right">
                            <div className="flex items-center text-gray-400 text-sm mb-1">
                              <Heart className="w-4 h-4 mr-1" />
                              {nft.likes}
                            </div>
                            <div className="flex items-center text-gray-400 text-sm">
                              <Eye className="w-4 h-4 mr-1" />
                              {nft.views}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Time Left */}
                      <div className="flex items-center text-yellow-400 text-sm mb-3">
                        <Clock className="w-4 h-4 mr-1" />
                        {nft.timeLeft}
                      </div>

                      {/* Buy Button */}
                      <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-lg">
                        <ShoppingCart className="w-4 h-4" />
                        <span>Buy Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105">
              Load More NFTs
            </button>
          </div>

          {/* Featured Collections */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Featured Collections
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Cosmic Legends", items: "2.5K items", volume: "1,250 ETH", image: "/logos.png" },
                { name: "Digital Dreams", items: "1.8K items", volume: "890 ETH", image: "/logos.png" },
                { name: "Pixel Paradise", items: "3.2K items", volume: "2,100 ETH", image: "/logos.png" }
              ].map((collection, index) => (
                <div key={index} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden">
                      <Image
                        src={collection.image}
                        alt={collection.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{collection.name}</h3>
                      <p className="text-gray-400">{collection.items}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-sm">Volume</p>
                      <p className="text-lg font-bold text-purple-400">{collection.volume}</p>
                    </div>
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                      View Collection
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}