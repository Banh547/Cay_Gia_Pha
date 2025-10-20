import React from 'react';
import './Header.css';

const Header = ({ onLogout, onAddNewPerson }) => {
  return (
    <header className="app-header">
      <div className="header-title">
        Cây Gia Phả
      </div>
      <div className="header-actions">
        <button onClick={onAddNewPerson} className="action-button new-person-btn">
          Thêm Thành Viên
        </button>
        <button onClick={onLogout} className="logout-button">
          Đăng xuất
        </button>
      </div>
    </header>
  );
};

export default Header;