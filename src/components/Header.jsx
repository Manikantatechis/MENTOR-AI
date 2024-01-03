import React from 'react';
import close from "../assets/img/close.svg";

function Header({ setBotOpen }) {
  return (
    <div className="header">
      <img src="https://techis.io/assets/img/icon-techis.png" alt="Tech IS" />
      <div className="header-details">
        <div className="name">Tech IS Mentor</div>
        <div className="status">Active</div> {/* This could be dynamic based on state */}
      </div>
      <img className="close-icon" src={close} onClick={() => setBotOpen(false)} alt="Close" />
    </div>
  );
}

export default Header;
