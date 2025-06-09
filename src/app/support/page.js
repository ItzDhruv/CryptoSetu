'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, MessageCircle, HelpCircle, FileText, Phone } from 'lucide-react';
import Header from '.././../components/heder';

export default function SupportPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm CryptoSetu AI Assistant. How can I help you today? I can assist you with trading questions, technical issues, account problems, and general cryptocurrency information.",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Static responses for quick questions
  const staticResponses = {
    "How do I deposit cryptocurrency?": `To deposit cryptocurrency to your CryptoSetu account:

1. Login to your CryptoSetu account
2. Navigate to 'Wallet' or 'Deposit' section
3. Select the cryptocurrency you want to deposit
4. Copy the deposit address or scan the QR code
5. Send your crypto from your external wallet to this address
6. Wait for network confirmations (usually 3-6 confirmations)

⚠️ Important: Always double-check the deposit address and network type. Wrong addresses can result in permanent loss of funds.

💡 Tip: Start with a small test transaction first if you're depositing a large amount.`,

    "What are your trading fees?": `CryptoSetu Trading Fees Structure:

Spot Trading:
• Maker Fee: 0.10%
• Taker Fee: 0.10%

Volume-Based Discounts:
• 30-day volume > ₹10 Lakhs: 0.08%
• 30-day volume > ₹50 Lakhs: 0.06%
• 30-day volume > ₹1 Crore: 0.04%

Additional Fees:
• Deposit: FREE for all cryptocurrencies
• Withdrawal: Network fees apply (varies by crypto)
• INR Deposits: FREE via UPI/IMPS
• INR Withdrawals: ₹10 flat fee

💎 CryptoSetu Premium: Get 50% fee discount with our premium membership!`,

    "How to verify my account?": `Account Verification Process:

Level 1 - Basic KYC:
1. Personal Details: Name, DOB, Address
2. Phone Verification: OTP verification
3. Email Verification: Confirmation link
4. PAN Card: Upload clear photo of PAN
5. Aadhaar: Upload front & back images

Level 2 - Enhanced KYC:
1. Bank Account: Add and verify bank account
2. Video KYC: Live verification call
3. Address Proof: Utility bill/bank statement
4. Income Proof: Salary slip/ITR (for higher limits)

Verification Time:
• Level 1: 2-24 hours
• Level 2: 1-3 business days

Benefits:
• Level 1: Basic trading (₹1 Lakh daily limit)
• Level 2: Full access (₹10 Lakh+ daily limits)`,

    "Is my account secure?": `CryptoSetu Security Features:

Account Protection:
🔐 2FA Authentication: Google Authenticator/SMS
🔒 Cold Storage: 95% funds stored offline
🛡️ SSL Encryption: Bank-grade 256-bit encryption
📱 Device Management: Monitor login devices

Advanced Security:
• Anti-Phishing Code: Personalized email protection
• Withdrawal Whitelist: Pre-approved addresses only
• IP Whitelisting: Restrict access by location
• Auto-Logout: Session timeout protection

Regulatory Compliance:
✅ RBI Guidelines: Fully compliant exchange
✅ KYC/AML: Strict identity verification
✅ Regular Audits: Third-party security audits
✅ Insurance: FDIC equivalent crypto insurance

Your Actions:
• Use strong, unique passwords
• Enable 2FA immediately
• Never share login credentials
• Verify all withdrawal requests`,

    "How to withdraw funds?": `Withdrawal Process:

Cryptocurrency Withdrawal:
1. Go to Wallet → Select cryptocurrency
2. Click Withdraw → Enter recipient address
3. Enter Amount → Review network fees
4. 2FA Verification → Enter Google Auth code
5. Email Confirmation → Click confirmation link
6. Processing Time: 10-30 minutes

INR Withdrawal:
1. Verify Bank Account (one-time setup)
2. Go to INR Wallet → Click Withdraw
3. Enter Amount → Select bank account
4. 2FA Verification → Confirm transaction
5. Processing Time: 2-24 hours (working days)

Withdrawal Limits:
• Basic KYC: ₹1 Lakh/day
• Enhanced KYC: ₹10 Lakh/day
• Premium: ₹50 Lakh/day

Fees:
• Crypto: Network fees (₹50-500 depending on network)
• INR: ₹10 flat fee

⚠️ Security Tip: Always verify withdrawal addresses carefully!`,

    "What cryptocurrencies do you support?": `CryptoSetu Supported Cryptocurrencies:

Major Cryptocurrencies:
• Bitcoin (BTC) - The original cryptocurrency
• Ethereum (ETH) - Smart contract platform
• Binance Coin (BNB) - Exchange token
• Cardano (ADA) - Proof-of-stake blockchain
• Solana (SOL) - High-speed blockchain
• Polkadot (DOT) - Multi-chain protocol

Popular Altcoins:
• Polygon (MATIC) - Ethereum scaling
• Chainlink (LINK) - Oracle network
• Litecoin (LTC) - Digital silver
• Ripple (XRP) - Cross-border payments
• Dogecoin (DOGE) - Meme cryptocurrency
• Shiba Inu (SHIB) - Community token

DeFi Tokens:
• Uniswap (UNI) - DEX protocol
• Aave (AAVE) - Lending protocol
• Compound (COMP) - Yield farming

Indian Favorites:
• WazirX (WRX) - Indian exchange token
• Ather (ATH) - Gaming token

Total: 100+ cryptocurrencies supported
New Listings: Added regularly based on community demand

💡 Don't see your favorite crypto? Contact us to request new listings!`
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToGemini = async (userMessage) => {
    try {
      // Use environment variable correctly
      const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyCV-PffVbqMwt2lNy2IWtJUqw1z2zawAXc';
      
      if (!API_KEY) {
        throw new Error('Gemini API key is not configured');
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are CryptoSetu AI Assistant, a helpful cryptocurrency exchange support bot. 
              
              Context: You work for CryptoSetu, a cryptocurrency exchange platform. Help users with:
              - Trading questions and guidance
              - Account issues and verification
              - Technical support for deposits/withdrawals
              - General cryptocurrency education
              - Platform features and navigation
              - Security best practices
              
              Keep responses helpful, professional, and focused on cryptocurrency/exchange topics.
              If asked about something unrelated to crypto/trading, politely redirect to crypto topics.
              
              User question: ${userMessage}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      // Return static response if available, otherwise generic error
      return staticResponses[userMessage] || "I apologize, but I'm having trouble connecting to my AI service right now. Please try again in a moment, or contact our human support team for immediate assistance.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInputMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      let botResponse;
      
      // Check if it's a quick question first
      if (staticResponses[currentInputMessage]) {
        botResponse = staticResponses[currentInputMessage];
      } else {
        // Try Gemini API, fallback to static response
        botResponse = await sendMessageToGemini(currentInputMessage);
      }
      
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        text: "I'm sorry, I encountered an error. Please try again or contact our support team.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "How do I deposit cryptocurrency?",
    "What are your trading fees?",
    "How to verify my account?",
    "Is my account secure?",
    "How to withdraw funds?",
    "What cryptocurrencies do you support?"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        
        {/* Support Header Section */}
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                CryptoSetu Support Center
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Get instant help with our AI assistant or browse our support resources
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Support Options */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold mb-6 text-yellow-400">Support Options</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition-colors cursor-pointer">
                  <div className="flex items-center mb-3">
                    <MessageCircle className="w-6 h-6 text-yellow-400 mr-3" />
                    <h3 className="text-lg font-semibold">Live AI Chat</h3>
                  </div>
                  <p className="text-gray-300">Get instant answers to your questions with our AI assistant</p>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition-colors cursor-pointer">
                  <div className="flex items-center mb-3">
                    <FileText className="w-6 h-6 text-yellow-400 mr-3" />
                    <h3 className="text-lg font-semibold">Knowledge Base</h3>
                  </div>
                  <p className="text-gray-300">Browse our comprehensive guides and tutorials</p>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition-colors cursor-pointer">
                  <div className="flex items-center mb-3">
                    <Phone className="w-6 h-6 text-yellow-400 mr-3" />
                    <h3 className="text-lg font-semibold">Contact Support</h3>
                  </div>
                  <p className="text-gray-300">Reach out to our human support team</p>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition-colors cursor-pointer">
                  <div className="flex items-center mb-3">
                    <HelpCircle className="w-6 h-6 text-yellow-400 mr-3" />
                    <h3 className="text-lg font-semibold">FAQ</h3>
                  </div>
                  <p className="text-gray-300">Find answers to commonly asked questions</p>
                </div>
              </div>

              {/* Quick Questions */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-yellow-400">Quick Questions</h3>
                <div className="space-y-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Chat Section */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-xl border border-gray-700 h-[600px] flex flex-col">
                
                {/* Chat Header */}
                <div className="bg-gray-900 rounded-t-xl p-4 border-b border-gray-700">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                      <Bot className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="font-semibold">CryptoSetu AI Assistant</h3>
                      <p className="text-sm text-green-400">● Online</p>
                    </div>
                  </div>
                </div>

                {/* Messages Container */}
                <div 
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`rounded-2xl p-4 ${
                            message.sender === 'user'
                              ? 'bg-yellow-500 text-black ml-4'
                              : 'bg-gray-700 text-white mr-4'
                          }`}
                        >
                          <div className="flex items-start">
                            {message.sender === 'bot' && (
                              <Bot className="w-5 h-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                            )}
                            {message.sender === 'user' && (
                              <User className="w-5 h-5 text-gray-800 mr-2 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className="whitespace-pre-wrap">{message.text}</p>
                              <p className={`text-xs mt-2 ${
                                message.sender === 'user' ? 'text-gray-700' : 'text-gray-400'
                              }`}>
                                {message.timestamp}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%]">
                        <div className="bg-gray-700 text-white rounded-2xl p-4 mr-4">
                          <div className="flex items-center">
                            <Loader2 className="w-5 h-5 text-yellow-400 mr-2 animate-spin" />
                            <p>CryptoSetu is thinking...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Section */}
                <div className="border-t border-gray-700 p-4">
                  <div className="flex space-x-2">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message here... (Press Enter to send)"
                      className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none min-h-[44px] max-h-32"
                      rows={1}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black p-2 rounded-lg transition-colors min-w-[44px] flex items-center justify-center"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    AI responses are generated and may not always be accurate. For critical issues, please contact human support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}