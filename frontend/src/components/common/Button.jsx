import React from "react";
import { useNavigate } from "react-router-dom";

const Button = ({ title, children, link, href, className = "", onClick, ...props }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (link) {
      e.preventDefault();
      navigate(link);
    }
  };

  const content = children ? children : title;

  if (href) {
    return (
      <a href={href} className={className} {...props}>
        {content}
      </a>
    );
  }
  if (link) {
    return (
      <a href={link} className={className} onClick={handleClick} {...props}>
        {content}
      </a>
    );
  }
  return (
    <button onClick={handleClick} className={className} {...props}>
      {content}
    </button>
  );
};

export default Button;
