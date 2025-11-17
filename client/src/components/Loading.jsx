import React from 'react';
import { Heart } from 'lucide-react';

const Loading = ({ fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center">
      <Heart className="w-16 h-16 text-blue-600 animate-pulse" />
      <p className="mt-4 text-gray-600 font-medium">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;