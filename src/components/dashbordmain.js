import React from 'react';
import { Shield, Zap, Users, TrendingUp, Award, Globe, Lock, Headphones } from 'lucide-react';
import Link from 'next/link';
const CryptosetuDashboard = () => {
  const advantages = [
    {
      icon: <Shield className="w-8 h-8 text-blue-400" />,
      title: "Bank-Grade Security",
      description: "Advanced encryption and multi-layer security protocols protect your assets 24/7",
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Lightning Fast Trades",
      description: "Execute trades in milliseconds with our high-performance matching engine",
      gradient: "from-yellow-500 to-orange-400"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-400" />,
      title: "Global Community",
      description: "Join millions of traders worldwide in the most trusted crypto ecosystem",
      gradient: "from-purple-500 to-pink-400"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-400" />,
      title: "Advanced Analytics",
      description: "Professional trading tools and real-time market insights at your fingertips",
      gradient: "from-green-500 to-emerald-400"
    },
    {
      icon: <Award className="w-8 h-8 text-red-400" />,
      title: "Industry Leading",
      description: "Award-winning platform trusted by professionals and beginners alike",
      gradient: "from-red-500 to-rose-400"
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-400" />,
      title: "24/7 Global Access",
      description: "Trade anytime, anywhere with our mobile-first responsive platform",
      gradient: "from-indigo-500 to-blue-400"
    },
    {
      icon: <Lock className="w-8 h-8 text-teal-400" />,
      title: "Regulatory Compliant",
      description: "Fully licensed and compliant with international financial regulations",
      gradient: "from-teal-500 to-cyan-400"
    },
    {
      icon: <Headphones className="w-8 h-8 text-orange-400" />,
      title: "Premium Support",
      description: "Get instant help from our expert support team whenever you need it",
      gradient: "from-orange-500 to-red-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-teal-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
              Welcome to CRYPTOSETU
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience the future of cryptocurrency trading with unmatched security, 
              lightning-fast execution, and professional-grade tools designed for every trader.
            </p>
            <div className="flex justify-center gap-6 mt-8">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                Start Trading Now
              </button>
              <Link href="/support" className="text-white">
              <button className="px-8 py-4 border border-gray-600 rounded-xl font-semibold hover:bg-gray-800 transform hover:scale-105 transition-all duration-300">
                Learn More
              </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          {[
            { number: "10M+", label: "Active Users", color: "text-blue-400" },
            { number: "$50B+", label: "Trading Volume", color: "text-green-400" },
            { number: "200+", label: "Cryptocurrencies", color: "text-purple-400" },
            { number: "99.9%", label: "Uptime", color: "text-yellow-400" }
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105">
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
                <div className="text-gray-400 text-lg">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Advantages Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Why Choose CRYPTOSETU?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover the advantages that make us the preferred choice for cryptocurrency trading
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <div 
              key={index} 
              className="group relative bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${advantage.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {advantage.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                  {advantage.title}
                </h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {advantage.description}
                </p>
              </div>

              {/* Hover Effect Border */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${advantage.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`}></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-12 border border-gray-700">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ready to Start Your Crypto Journey?
            </h3>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Join millions of users who trust CRYPTOSETU for their cryptocurrency trading needs. 
              Sign up today and experience the difference.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl">
                Create Account
              </button>
              <Link href="/market" className="text-white">
              <button className="px-10 py-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-xl">
                View Markets
              </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptosetuDashboard;