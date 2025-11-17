import React from 'react';

const Card = ({ children, className = '', hover = false, onClick }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
        hover ? 'hover:shadow-2xl hover:-translate-y-1 cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;