import React from 'react';
import '../css/Button.css';

export default function Button({ onClick, type = 'button', text, color, ...props }) {
  return (
    <>
      <button
        type={type}
        onClick={onClick}
        style={{ backgroundColor: color }}
        className="custom-button"
        {...props}
      >
        {text}
      </button>
    </>
  );
}
