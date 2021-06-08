import React from "react";
import Essay from "./Essay";

const Essays = ({ addEssay }) => {
  return (
    <div className="essays">
      <div className="essays__heading">
        <h2 className="essays__title"> Latest Essays </h2>
        <a href="#" className="essays__add" onClick={addEssay}>
          <i className="fas fa-plus-circle"> </i>
        </a>
      </div>
      <div className="essays__all">
        <Essay />
        <Essay />
        <Essay />
        <Essay />
        <Essay />
        <Essay />
        <Essay />
        <Essay />
        <Essay />
      </div>
    </div>
  );
};

export default Essays;
