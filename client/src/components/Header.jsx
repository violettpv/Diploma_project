import React from 'react';
import '../css/Header.css';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <>
      <div className="Header">
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          <div className="app-name">BrightDent</div>
        </Link>
      </div>
    </>
  );
}

export default Header;
