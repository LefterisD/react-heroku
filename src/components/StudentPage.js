import React, { useState, useEffect } from "react";
import InputText from "./InputText";
import EssayCounter from "./EssayCounter";
import MoreInfo from "./MoreInfo";
import Charts from "./Charts";
import ChartOne from "./ChartOne";
import uniqid from "uniqid";
import FeedBack from "./FeedBack";
import Grade from "./Grade";
import { PagesSharp } from "@material-ui/icons";
import DropDownBtn from "./DropDownBtn";

const StudentPage = ({ user, change, noMistakes }) => {
  const [wordsToHighlightStudent, setWordsToHighlightStudent] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [wordsToHighlight, setWordsToHighlight] = useState([]);
  const [countOrth, setcountOrth] = useState(0);
  const [countGram, setcountGram] = useState(0);
  const [countSti, setcountSti] = useState(0);
  const [wordsOrth, setWordsOrth] = useState([]);
  const [wordsGram, setWordsGram] = useState([]);
  const [userName, setUserName] = useState("");
  const [mistakesStudent, setMistakesStudent] = useState([]);
  const [inputTextStudent, setInputTextStudent] = useState("");
  const [studentUser, setStudentUser] = useState("");
  const [userFilledInfo, setUserFilledInfo] = useState("");

  const [wordCountStu, setWordCountStu] = useState(0);
  const [wordCountProf, setWordCountProf] = useState(0);
  const [flag, setFlag] = useState(false);

  const [essayNumStu, setEssayNumStu] = useState(0);

  const [loadingStu, setLoadingStu] = useState(false);
  //feedback

  const [noMistakesStu, setNoMistakesStu] = useState("no");

  const [grade, setGrade] = useState(0);

  const ROLE = "student";
  const getMistakesStudent = (e) => {
    e.preventDefault();
    setLoadingStu(true);
    fetch(` https://checkitapi.herokuapp.com/api/v1/check/${inputTextStudent}`)
      .then((res) => res.json())
      .then((data) => {
        var json_obj = JSON.parse(JSON.stringify(data));
        setMistakesStudent(json_obj.matches);
        if (json_obj.matches.length === 0) {
          setNoMistakesStu("yes");
        } else {
          setNoMistakesStu("no");
        }
        setLoadingStu(false);
      })
      .catch(function () {
        setLoadingStu(false);
      });
    update_essay_count();
  };

  const update_essay_count = () => {
    let curr_user = localStorage.getItem("uniqid");
    fetch(
      `https://checkitapi.herokuapp.com/update_essay_count/user/${curr_user}/role/${ROLE}`,
      {
        method: "POST",
      }
    ).then((results) => console.log(results));
  };

  //Sends a POST request to our users api to insert new user into the DB
  const addUser = (id) => {
    fetch(`https://checkitapi.herokuapp.com/user/${ROLE}/${id}`, {
      method: "POST",
    }).then((results) => console.log(results));
  };

  useEffect(() => {
    let stored_id = localStorage.getItem("uniqid");
    if (stored_id) {
      setStudentUser(stored_id);
    } else {
      let uniid = uniqid();
      localStorage.setItem("uniqid", uniid);
    }
  }, []);

  useEffect(() => {
    let stored_id = localStorage.getItem("uniqid");
    if (stored_id) {
      setStudentUser(stored_id);
      if (localStorage.getItem("Role")) {
        console.log("YPARXEI");
      } else {
        localStorage.setItem("Role", "student");
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
    let info = localStorage.getItem("info");
    if (localStorage.getItem("info")) {
      setUserFilledInfo(info);
    } else {
      localStorage.setItem("info", "none");
      setUserFilledInfo(localStorage.getItem("info"));
    }
  }, []);

  return (
    <div className="return">
      <DropDownBtn role={ROLE} />
      <div className="title-wrapper">
        <h1 className="title-prof">Καλώς όρισες {userName}</h1>
      </div>
      <InputText
        setInputText={setInputTextStudent}
        getMistakes={getMistakesStudent}
        mistakes={mistakesStudent}
        setWordsToHighlight={setWordsToHighlightStudent}
        setcountOrth={setcountOrth}
        setcountGram={setcountGram}
        setcountSti={setcountSti}
        setWordsOrth={setWordsOrth}
        setWordsGram={setWordsGram}
        role={ROLE}
        setWordCountProf={setWordCountProf}
        setWordCountStu={setWordCountStu}
        loading={loadingStu}
      />
      <EssayCounter
        mistakes={mistakesStudent}
        role={ROLE}
        setEssayNum={setEssayNumStu}
        wordsOrth={wordsOrth}
      />

      <Grade
        mistakes={mistakesStudent}
        role={ROLE}
        user={user}
        wordCountStu={wordCountStu}
        flag={flag}
        countOrth={countOrth}
        countGram={countGram}
        countSti={countSti}
        setFlag={setFlag}
        wordsOrth={wordsOrth}
        noMistakes={noMistakesStu}
      />
      <MoreInfo info={userFilledInfo} role={ROLE} />
      <div className="chart_section">
        <div className="charts">
          <div className="chart-section-title">
            <h2 className="title-chart">
              Συνολικά στατιστικά <span id="chart-span">{essayNumStu} </span>
              κειμένων
            </h2>
          </div>
          <Charts
            countOrth={countOrth}
            countGram={countGram}
            countSti={countSti}
            wordsOrth={wordsOrth}
            wordsGram={wordsGram}
            mistakes={mistakesStudent}
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
            mistakes={mistakesStudent}
            user={user}
            role={ROLE}
            change={change}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
