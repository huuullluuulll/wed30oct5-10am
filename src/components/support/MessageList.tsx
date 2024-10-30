import React from 'react';

interface Message {
  id: string;
  message: string;
  created_at: string;
  is_admin: boolean;
}

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.is_admin ? 'justify-start' : 'justify-end'}`}
        >
          <div className={`max-w-[80%] rounded-lg p-4 ${
            message.is_admin 
              ? 'bg-gray-100 dark:bg-gray-700' 
              : 'bg-blue-100 dark:bg-blue-900'
          }`}>
            <p className="text-gray-900 dark:text-white break-words">{message.message}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {new Date(message.created_at).toLocaleString('ar-EG')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};