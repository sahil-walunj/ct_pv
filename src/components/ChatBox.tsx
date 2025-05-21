'use client';

import { useEffect, useState } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function ChatBox() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Listen for custom refresh event
    const handleRefresh = () => {
      setRefreshTrigger(prev => prev + 1);
    };
    
    window.addEventListener('refreshMessages', handleRefresh);
    
    return () => {
      window.removeEventListener('refreshMessages', handleRefresh);
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <MessageList key={refreshTrigger} />
      </div>
      <MessageInput />
    </div>
  );
}