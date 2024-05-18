import React from 'react';
import '../css/Header.css';
import { Link } from 'react-router-dom';

function HeaderMenu() {
  return (
    <>
      <div className="HeaderMenu">
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          <div className="app-name">BrightDent</div>
        </Link>
      </div>
    </>
  );
}

export default HeaderMenu;
