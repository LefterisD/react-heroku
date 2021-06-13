import React, { useState, useEffect, useRef } from "react";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Modal from "react-modal";

const MoreInfo = ({ info, role }) => {
  let content;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [usr, setUsr] = useState("");
  const [age, setAge] = useState("");
  const [edu, setEdu] = useState("");
  const [m_tongue, setM_tongue] = useState("");

  function openModal() {
    setIsOpen(!modalIsOpen);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const form = useRef(null);

  const afterSubmit = (e) => {
    //change info value in local storage to hide the form from the user
    localStorage.setItem("info", "set");
    e.preventDefault();
    //Must fix this
    const data = new FormData(document.getElementById("info-form"));
    fetch("http://127.0.0.1:5000/user/user_info", {
      method: "POST",
      body: data,
    }).then((results) => console.log(results));
    window.location.reload();
  };

  useEffect(() => {
    let temp_id = localStorage.getItem("uniqid");
    setUsr(temp_id);
  }, []);

  if (info == "none") {
    content = (
      <div className="info_wrapper" onClick={openModal}>
        <AccountCircleIcon id="info-icon" />
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="student_info_modal"
          contentLabel="Test Modal"
          closeTimeoutMS={300}
        >
          <header onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal}>
              <i class="fas fa-times"> </i>
            </button>
          </header>
          <div className="container-box" onClick={(e) => e.stopPropagation()}>
            <div className="title">
              <h1> Στοιχεία </h1>
            </div>
            <div className="main-section">
              <form id="info-form" method="POST" onSubmit={afterSubmit}>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="age"
                    name="age"
                    className="student_info_field"
                    placeholder=" "
                    onChange={(e) => {
                      setAge(e.target.value);
                    }}
                  />
                  <label htmlFor="age">Ηλικία</label>
                </div>
                <div className="select-wrapper">
                  <label className="select-label" htmlFor="level">
                    Μορφωτικό Επίπεδο
                  </label>
                  <select
                    id="level"
                    name="level"
                    className="student_select_field"
                    onChange={(e) => {
                      setEdu(e.target.value);
                    }}
                  >
                    <option disabled selected value>
                      -- Επιλέξτε --
                    </option>
                    <option className="option-value" value="Γυμνάσιο">
                      Γυμνάσιο
                    </option>
                    <option className="option-value" value="Λύκειο">
                      Λύκειο
                    </option>
                    <option className="option-value" value="Πανεπιστήμιο">
                      Πανεπιστήμιο
                    </option>
                  </select>
                  {/*<input
                    type="text"
                    id="level"
                    name="level"
                    className="student_info_field"
                    placeholder=" "
                    onChange={(e) => {
                      setEdu(e.target.value);
                    }}
                  />*/}
                </div>
                <div className="select-wrapper">
                  <label className="select-label" htmlFor="level">
                    Μητρική Γλώσσα
                  </label>
                  <select
                    id="MT"
                    name="MT"
                    className="student_select_field"
                    onChange={(e) => {
                      setEdu(e.target.value);
                    }}
                  >
                    <option disabled selected value>
                      -- Επιλέξτε --
                    </option>
                    <option className="option-value" value="Ελληνικά">
                      Ελληνικά
                    </option>
                    <option className="option-value" value="Αγγλικά">
                      Αγγλικά
                    </option>
                    <option className="option-value" value="Άλλη">
                      Άλλη
                    </option>
                  </select>
                  {/*<input
                    type="text"
                    id="MT"
                    name="MT"
                    className="student_info_field"
                    placeholder=" "
                    onChange={(e) => {
                      setM_tongue(e.target.value);
                    }}
                  />
                  <label htmlFor="MT">Μητρική γλώσσα</label>*/}
                </div>
                <div className="input-wrapper">
                  <input type="text" id="id" name="id" value={usr} />
                </div>
                <div className="input-wrapper">
                  <input type="text" id="role" name="role" value={role} />
                </div>
                <input type="submit" id="sbmt_btn" value="Προσθήκη" />
              </form>
            </div>
          </div>
        </Modal>
        <p id="acc-info">Δώσε μας λίγες παραπάνω πληροφορίες για εσένα.</p>
      </div>
    );
  } else {
    content = <div></div>;
  }

  return <div>{content}</div>;
};

export default MoreInfo;
