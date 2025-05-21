'use client';

import { useEffect, useState, useRef } from 'react';

type Message = {
  id: string;
  content: string;
  sender: string;
  createdAt: string;
};

export default function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    setError(null);
    try {
      // Use absolute URL to avoid path issues
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/messages`);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched messages:', data);
      setMessages(data);
      setIsLoading(false);
      
      // Scroll to bottom after messages update
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages. Please try again later.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Set up auto-reload every minute (60000ms)
    const intervalId = setInterval(fetchMessages, 60000);
    
    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchMessages}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto p-4 h-full">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 my-auto">
          No messages yet. Be the first to say hello!
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg max-w-xs ${
              message.sender === localStorage.getItem('username')
                ? 'bg-blue-500 text-white self-end'
                : 'bg-gray-200 self-start'
            }`}
          >
            <p className="font-bold text-xs">{message.sender}</p>
            <p>{message.content}</p>
            <p className="text-xs opacity-70">
              {new Date(message.createdAt).toLocaleTimeString()}
            </p>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}