import React, { useState, useEffect, useRef } from "react";
import InputText from "./InputText";
import Modal from "react-modal";
import Charts from "./Charts";
import EssayCounter from "./EssayCounter";
import DataTable from "./DataTable";
import ChartOne from "./ChartOne";
import ProfGrade from "./ProfGrade";
import AlertMessage from "./AlertMessage";
import DropDownBtn from "./DropDownBtn";

const customStyles = {
  overlay: {
    zIndex: 1000,
    background: "rgba(0,0,0, 0.3)",
  },
};

Modal.setAppElement("#root");

const ProfessorPage = ({
  inputText,
  setInputText,
  getMistakes,
  mistakes,
  user,
  setUser,
  setRole,
  change,
  noMistakes,
  loading,
  alert,
}) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [wordsToHighlight, setWordsToHighlight] = useState([]);
  const [countOrth, setcountOrth] = useState(0);
  const [countGram, setcountGram] = useState(0);
  const [countSti, setcountSti] = useState(0);
  const [wordsOrth, setWordsOrth] = useState([]);
  const [wordsGram, setWordsGram] = useState([]);
  const [userName, setUserName] = useState("");
  const [essayNum, setEssayNum] = useState(0);
  const [grade, setGrade] = useState(0);
  const [storedID, setStoredID] = useState("");
  const [wordCountProf, setWordCountProf] = useState(0);
  const [wordCountStu, setWordCountStu] = useState(0);
  const [flag, setFlag] = useState(false);

  const [posted, setPosted] = useState();

  const ROLE = "professor";

  function openAddNewEssayModal(e) {
    e.preventDefault();
    setIsOpen(true);
  }

  function closeAddNewEssayModal() {
    setIsOpen(false);
  }

  const deleteMistakes = () => {
    fetch(
      `http://127.0.0.1:5000/mistakes/delete_by_id/id=/${user}/role=/${ROLE}`,
      {
        method: "POST",
      }
    ).then((results) => console.log(results));
  };
  //Sends a POST request to our users api to insert new user into the DB
  const addUser = (id) => {
    fetch(`http://127.0.0.1:5000/user/${ROLE}/${id}`, {
      method: "POST",
    }).then((results) => console.log(results));
  };

  //Checks if local storage uniqid EXISTS and sets the global userid state to the stored id
  //IF not it uses an external uniqid generator and sets the uniqid in local storage
  //then is uses the addUser function from above to insert the user into the users table
  useEffect(() => {
    setRole("professor");
    let stored_id = localStorage.getItem("uniqid");
    setStoredID(stored_id);
    if (stored_id) {
      setUser(stored_id);
      if (localStorage.getItem("Role")) {
        console.log("YPARXEI");
      } else {
        localStorage.setItem("Role", "professor");
      }

      addUser(stored_id);
    }
  }, []);

  useEffect(() => {
    let stored_userName = localStorage.getItem("userName");
    if (
      stored_userName.slice(-1) === "ς" ||
      stored_userName.slice(-1) === "σ"
    ) {
      stored_userName = stored_userName.slice(0, -1);
    }
    setUserName(stored_userName);
  }, []);
  return (
    <div className="return">
      <DropDownBtn role={ROLE} />
      <div className="title-wrapper">
        <h1 className="title-prof">Καλώς όρισατε κ.{userName}</h1>
      </div>
      {alert ? <AlertMessage /> : <div></div>}
      <InputText
        setInputText={setInputText}
        getMistakes={getMistakes}
        mistakes={mistakes}
        setWordsToHighlight={setWordsToHighlight}
        setcountOrth={setcountOrth}
        setcountGram={setcountGram}
        setcountSti={setcountSti}
        setWordsOrth={setWordsOrth}
        setWordsGram={setWordsGram}
        role={ROLE}
        setWordCountProf={setWordCountProf}
        setWordCountStu={setWordCountStu}
        loading={loading}
      />
      <ProfGrade
        mistakes={mistakes}
        wordCountProf={wordCountProf}
        role={ROLE}
        user={storedID}
        flag={flag}
        countOrth={countOrth}
        countGram={countGram}
        countSti={countSti}
        setFlag={setFlag}
        wordsOrth={wordsOrth}
        setPosted={setPosted}
        noMistakes={noMistakes}
      />
      <EssayCounter
        mistakes={mistakes}
        role={ROLE}
        setEssayNum={setEssayNum}
        wordsOrth={wordsOrth}
      />

      <div className="chart_section">
        <div className="charts">
          <div className="chart-section-title">
            <h2 className="title-chart">
              Συνολικά στατιστικά <span id="chart-span">{essayNum} </span>
              κειμένων
            </h2>
          </div>
          <Charts
            countOrth={countOrth}
            countGram={countGram}
            countSti={countSti}
            wordsOrth={wordsOrth}
            wordsGram={wordsGram}
            mistakes={mistakes}
            user={user}
            role={ROLE}
          />
        </div>
        <div className="charts">
          <div className="chart-section-title">
            <h2 className="title-chart" id="sec-title">
              Στατιστικά τρέχοντος κειμένου
            </h2>
          </div>
          <ChartOne
            countOrth={countOrth}
            countGram={countGram}
            countSti={countSti}
            wordsOrth={wordsOrth}
            wordsGram={wordsGram}
            mistakes={mistakes}
            user={user}
            role={ROLE}
            change={change}
          />
        </div>
      </div>
      <section className="essay-section">
        <div id="essay-details">
          <h1 id="essay-header">Πληροφορίες για τα Κείμενα των μαθητών</h1>
          <p>
            Στον παρακάτω πίνακα εμφανίζονται τα κείμενα που έχουν ελεγχθεί. Πιο
            συγκεκριμένα θα βρείτε πληροφορίες για τον βαθμό του κειμένου κάθε
            μαθητή, τον αριθμό των ορθογραφικών, γραμματικών και λαθών στίξης
            καθώς και τον συνολικό αριθμό λέξεων. Επιπλέον μπορείτε να κάνετε
            εξαγωγή τα δεδομένα αυτά σε μορφή csv.
          </p>
        </div>
        <DataTable
          role={ROLE}
          mistakes={mistakes}
          wordsOrth={wordsOrth}
          countOrth={countOrth}
          countGram={countGram}
          countSti={countSti}
          change={change}
          posted={posted}
        />
      </section>
    </div>
  );
};

export default ProfessorPage;
