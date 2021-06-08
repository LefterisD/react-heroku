import React from "react";

const Card = ({ Svgicon, Title, text }) => {
  return (
    <div className="card">
      <div className="svg-wrapper">
        <Svgicon />
      </div>
      <div className="title">
        <h2>{Title}</h2>
      </div>
      <div className="text">
        <p>{text}</p>
      </div>
    </div>
  );
};

export default Card;
