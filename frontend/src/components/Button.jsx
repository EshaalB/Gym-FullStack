import React from 'react';

const Button = ({ title, link, href, className = "", onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (link) {
      window.location.href = link;
    }
  };

  const baseClasses = "inline-flex items-center justify-center px-6 py-3 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer";
  const defaultClasses = "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white";
  
  const buttonClasses = className || defaultClasses;
  const finalClasses = `${baseClasses} ${buttonClasses}`;

  if (href) {
    return (
      <a href={href} className={finalClasses}>
        {title}
      </a>
    );
  }

  return (
    <button 
      onClick={handleClick}
      className={finalClasses}
    >
      {title}
    </button>
  );
};

export default Button;
