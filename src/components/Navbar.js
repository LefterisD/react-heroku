import React from "react";

const Navbar = ({ OpenModal }) => {
  return (
    <header id="nav">
      <h2>CHECKIT</h2>
      <div className="link-wrapper">
        <button onClick={OpenModal}>About</button>
      </div>
    </header>
  );
};

export default Navbar;
