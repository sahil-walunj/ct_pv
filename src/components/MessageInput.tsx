'use client';

import { useState, useEffect } from 'react';

export default function MessageInput() {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get username from localStorage or prompt for a new one
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      const newUsername = prompt('Enter your username:') || 'Anonymous';
      localStorage.setItem('username', newUsername);
      setUsername(newUsername);
    }
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    setError(null);
    setIsSending(true);
    
    try {
      // Use absolute URL to avoid path issues
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message,
          sender: username,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }
      
      setMessage('');
      
      // Trigger an immediate refresh of messages
      const refreshEvent = new CustomEvent('refreshMessages');
      window.dispatchEvent(refreshEvent);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const changeUsername = () => {
    const newUsername = prompt('Enter your new username:') || 'Anonymous';
    localStorage.setItem('username', newUsername);
    setUsername(newUsername);
  };

  return (
    <div className="border-t p-4 bg-white">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      
      <div className="flex items-center mb-2">
        <span className="text-sm mr-2">Posting as: <strong>{username}</strong></span>
        <button 
          onClick={changeUsername} 
          className="text-xs text-blue-500 hover:underline"
        >
          Change
        </button>
      </div>
      
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={isSending}
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={isSending || !message.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-blue-300"
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
