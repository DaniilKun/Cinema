import React, { useState } from 'react';

const Header = ({ handleSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
    handleSearch(event.target.value);
  };

  return (
    <header className="container">
      <div className="header__content">
        <a href="/" className="header__logo">AvitoCinema</a>
        <form>
          <input
            type="text"
            className="header__search"
            placeholder="Поиск"
            value={searchQuery}
            onChange={handleChange}
          />
        </form>
      </div>
    </header>
  );
};

export default Header;
