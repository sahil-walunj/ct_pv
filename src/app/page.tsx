'use client';

import ChatBox from '@/components/ChatBox';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  // Check API connectivity on load
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const baseUrl = window.location.origin;
        const response = await fetch(`${baseUrl}/api/messages`);
        setIsConnected(response.ok);
      } catch (error) {
        console.error('API connectivity check failed:', error);
        setIsConnected(false);
      }
    };

    checkConnection();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Real-Time Chat</h1>
          {isConnected !== null && (
            <span className={`text-xs px-2 py-1 rounded ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}>
              {isConnected ? 'Connected' : 'Offline'}
            </span>
          )}
        </div>
        <div className="h-[calc(100%-64px)]">
          {isConnected === false ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="text-red-500 text-xl mb-4">⚠️ Connection Error</div>
              <p className="mb-4">
                Cannot connect to the chat server. This could be due to:
              </p>
              <ul className="text-left list-disc ml-6 mb-4">
                <li>Database connection issues</li>
                <li>API route configuration problems</li>
                <li>Network connectivity problems</li>
              </ul>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <ChatBox />
          )}
        </div>
      </div>
    </main>
  );
}