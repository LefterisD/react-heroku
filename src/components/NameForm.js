import React, { useState } from "react";

const NameForm = () => {
  const [userName, setUserName] = useState("");

  const inputTextHandler = (e) => {
    let input_value = e.target.value;
    setUserName(input_value);
  };

  const addUserNameToLocalStorage = () => {
    let stored_name = localStorage.getItem("userName");
    if (!stored_name) {
      localStorage.setItem("userName", userName);
      window.location.reload();
    }
  };

  return (
    <div className="form-cont">
      <div className="container">
        <div className="main-section">
          <div className="input-box">
            <input
              type="text"
              id="name"
              name="name"
              className="input-field"
              placeholder=" "
              onChange={inputTextHandler}
            />
            <label htmlFor="name">Γράψτε το όνομά σας!</label>
          </div>
        </div>
        <button onClick={addUserNameToLocalStorage}>Προσθήκη</button>
      </div>
    </div>
  );
};

export default NameForm;
