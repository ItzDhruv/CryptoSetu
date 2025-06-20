import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import PrivyProvider from "./auth/PrivyProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './config/config'
import Provider from "./provider/provider";

const queryClient = new QueryClient()

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CRYPTOSETU",
  description: "Bridge to your crypto assert",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
      
          {children}
      </Provider>
      
          
      </body>
    </html>
  );
}