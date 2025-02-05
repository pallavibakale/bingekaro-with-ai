import React, { useState, useRef } from "react";

const Header = ({ onSearch }) => {
  const searchRef = useRef();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    onSearch(searchRef.current.value);
    searchRef.current.value = ""; // Pass searchInput back to parent component (index.jsx)
  };

  return (
    <header>
      <a href="/">
        <img alt="Binge Karo" src="/assets/logo.jpg" />
      </a>
      <form onSubmit={handleSearch} className="search_form">
        <input
          type="text"
          id="searchInput"
          ref={searchRef}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for a movie..."
          autoComplete="off"
        />
        <button type="submit">Search</button>
      </form>
    </header>
  );
};

export default Header;
