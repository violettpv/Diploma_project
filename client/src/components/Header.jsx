import React from 'react';
import '../css/Header.css';

function Header({ styleHeader }) {
  return (
    <div className="Header" style={styleHeader}>
      {/* <div className="app-name">BrightDent</div> */}
      <div className="app-name">
        <a href="/menu">BrightDent</a>
      </div>
    </div>
  );
}

export default Header;
