import React, { useState, useEffect } from "react";
import FeedBack from "./FeedBack";
import Modal from "react-modal";

import {
  PieChart,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Pie,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#16c79a ", "#e1e5ea"];

const customStyles = {
  overlay: {
    zIndex: 1000,
    background: "rgba(0,0,0, 0.3)",
  },
};

const ProfGrade = ({
  mistakes,
  wordCountProf,
  role,
  user,
  flag,
  setFlag,
  countGram,
  countOrth,
  countSti,
  wordsOrth,
  setPosted,
  noMistakes,
}) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [grade, setGrade] = useState(0);
  const [userGrade, setUserGrade] = useState(0);
  //const [weightSpell, setWeightSpell] = useState(0);
  const [weightGram, setWeightGram] = useState(0);
  const [weightPunc, setWeightPunc] = useState(0);
  const [message, setMessage] = useState("");
  const [afterFixMessage, setAferFixMessage] = useState("");

  const [orthRate, setOrthRate] = useState(0);
  const [gramRate, setGramRate] = useState(0);
  const [stiRate, setStiRate] = useState(0);

  const [orthStats, setOrthStats] = useState(0);
  const [gramStats, setGramStats] = useState(0);
  const [stiStats, setStiStats] = useState(0);

  const [feedBackOrth, setFeedBackOrth] = useState("");
  const [feedBackGram, setFeedBackGram] = useState("");
  const [feedBackSti, setFeedBackSti] = useState("");

  const [dataExist, setDataExist] = useState("");

  let content;

  function openWeightFixModal(e) {
    e.preventDefault();
    setIsOpen(true);
  }

  function closeAddNewEssayModal() {
    setIsOpen(false);
  }

  const fillData = (grade) => {
    if (grade) {
      let temp_data = [
        {
          name: "Βαθμός",
          value: grade,
        },
        {
          name: "_",
          value: 20 - grade,
        },
      ];
      setData(temp_data);
    } else {
      let temp_data = [
        { name: "Βαθμός", value: 0 },
        { name: "", value: 0 },
      ];
      setData(temp_data);
    }
  };

  const findGrade = () => {
    console.log("EDWW TA KALA MISTAKES", mistakes);
    if (mistakes.length !== 0) {
      //Essay grading
      setDataExist(new Date());
      compute_grade(0);
    } else {
      compute_grade(1);
    }
  };

  const computeRate = (wordCount, errors) => {
    let pos = 0;
    pos = 100 * errors;
    console.log(errors);
    console.log(wordCount);
    console.log(pos);
    pos = pos / wordCount;
    //console.log(pos);
    pos = Math.round(pos * 10) / 10;
    return pos;
  };

  const compute_grade = (flag) => {
    if (flag === 0) {
      //Sydelestis 0-1 gia kathe kathgoria
      let orthPercentage = computeErrorPercentage(wordCountProf, countOrth);
      let gramPercentage = computeErrorPercentage(wordCountProf, countGram);
      let stiPercentage = computeErrorPercentage(wordCountProf, countSti);

      setOrthStats(orthPercentage);
      setGramStats(gramPercentage);
      setStiStats(stiPercentage);
      //pososto spelling
      setOrthRate(computeRate(wordCountProf, countOrth));
      setGramRate(computeRate(wordCountProf, countGram));
      setStiRate(computeRate(wordCountProf, countSti));

      //Get weights to compute grade
      //setNoMistakes(false);
      getWeights(orthPercentage, gramPercentage, stiPercentage);
    } else {
      //setNoMistakes(true);
      if (noMistakes === "yes") {
        setOrthStats(0);
        setGramStats(0);
        setStiStats(0);
        fillData(20);
        setGrade(20);
        addEssay(0, 0, 0, wordCountProf, 20);
        setPosted(new Date());
      }
    }
  };

  //compute coefficient fro ypes of mistakes
  const computeErrorPercentage = (wordCount, errors) => {
    let count_1 = wordCount - errors;
    return count_1 / wordCount;
  };

  const getWeights = (orthPercentage, gramPercentage, stiPercentage) => {
    fetch(`https://checkitapi.herokuapp.com/weights/by/${role}/${user}`)
      .then((res) => res.json())
      .then((data) => {
        let weights = JSON.parse(JSON.stringify(data));

        let temp_grade =
          weights[0].spelling_w * orthPercentage +
          weights[0].grammar_w * gramPercentage +
          weights[0].punctuation_w * stiPercentage;

        temp_grade = Math.round(temp_grade * 10) / 10;

        fillData(temp_grade);
        setGrade(temp_grade);
        addEssay(countOrth, countGram, countSti, wordCountProf, temp_grade);
        setPosted(new Date());
      });
  };

  const addEssay = (countOrth, countGram, countSti, wordCount, grade) => {
    let stu_name = localStorage.getItem("StudentName");
    let stu_class = localStorage.getItem("StudentClass");
    fetch(
      `https://checkitapi.herokuapp.com/essays/add/role/${role}/id/${user}/student/${stu_name}/class/${stu_class}/spelling/${countOrth}/grammar/${countGram}/puncutation/${countSti}/words/${wordCount}/${grade}`,
      {
        method: "POST",
      }
    ).then((results) => console.log(results));
    //Delete user info from local storage once the essay data is posted in the db
    localStorage.setItem("StudentName", "");
    localStorage.setItem("StudentClass", "");
  };

  const fixWeights = (type) => {
    if (type === "spelling") {
      setAferFixMessage(
        "Το σύστημα θα δίνει πλέον μεγαλύτερη βαρύτητα στα ορθογραφικά λάθη!"
      );
    } else if (type === "grammar") {
      setAferFixMessage(
        "Το σύστημα θα δίνει πλέον μεγαλύτερη βαρύτητα στα γραμματικά λάθη!"
      );
    } else {
      setAferFixMessage(
        "Το σύστημα θα δίνει πλέον μεγαλύτερη βαρύτητα στα λάθη στίξης!"
      );
    }

    fetch(
      `https://checkitapi.herokuapp.com/weights/update/${role}/${user}/${type}/${grade}/${userGrade}`,
      {
        method: "POST",
      }
    ).then((results) => console.log(results));
  };
  const changeMessage = () => {
    setMessage(
      "Τέλεια! Το feedback σας βοηθάει την εφαρμογή να μάθει πιο γρήρορα."
    );
  };

  useEffect(() => {
    if (flag === false) {
      setFlag(true);
    } else {
      findGrade();
    }
    setMessage("");
    setAferFixMessage("");
  }, [wordsOrth]);

  if (mistakes.length !== 0 || noMistakes === "yes") {
    content = (
      <div className="grade_box">
        <FeedBack
          orthStats={orthStats}
          gramStats={gramStats}
          stiStats={stiStats}
          mistakes={mistakes}
          role={role}
          user={user}
          setFeedBackOrth={setFeedBackOrth}
          setFeedBackGram={setFeedBackGram}
          setFeedBackSti={setFeedBackSti}
          grade={grade}
          orthRate={orthRate}
          gramRate={gramRate}
          stiRate={stiRate}
          countOrth={countOrth}
          countGram={countGram}
          countSti={countSti}
        />
        <p className="chart-title">Βαθμός:</p>
        <div className="grade_chart">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart width={500} height={180} id="pie-grade">
              <Pie
                data={data}
                startAngle={180}
                endAngle={0}
                innerRadius={65}
                outerRadius={85}
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="grade-text">
            <p>
              {grade}
              <span id="grade-span">/20</span>
            </p>
          </div>
        </div>

        <div className="content_feedback">
          <p id="title">Σχόλια:</p>
          <div className="comments">
            <div className="comment-wrapper">
              <p className="comment">{feedBackOrth}</p>
            </div>
            <div className="comment-wrapper">
              <p className="comment">{feedBackGram}</p>
            </div>
            <div className="comment-wrapper">
              <p className="comment">{feedBackSti}</p>
            </div>
          </div>
          <div id="color-info">
            <span className="color-box">ΟΡΘΟΓΡΑΦΙΚΑ</span>
            <span className="color-box">ΣΤΙΞΗΣ</span>
            <span className="color-box">ΓΡΑΜΜΑΤΙΚΑ</span>
          </div>
        </div>
        <div className="content_feedback">
          <p id="title">Ήταν ικανοποιητική η βαθμολόγηση;</p>
          <div className="weight_update_btns">
            <button className="weight_btn" onClick={changeMessage}>
              <i class="fa fa-thumbs-up thumb" aria-hidden="true"></i>
            </button>
            <button className="weight_btn" onClick={openWeightFixModal}>
              <i class="fa fa-thumbs-down thumb" aria-hidden="true"></i>
            </button>
          </div>
          <div className="message_feedback">
            <p>{message}</p>
          </div>
        </div>
      </div>
    );
  } else {
    content = <div></div>;
  }
  return (
    <div>
      {content}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeAddNewEssayModal}
        className="modal-essay"
        style={customStyles}
        contentLabel="Test Modal"
        closeTimeoutMS={300}
      >
        <header>
          <button onClick={closeAddNewEssayModal}>
            <i class="fas fa-times"></i>
          </button>
        </header>
        <div className="fix_weights_container">
          <div className="computed_grade_wrapper">
            Ο βαθμός που υπολογίστηκε είναι:
            <span id="computed_grade">{grade}</span>
          </div>
          <div className="new_grade_input">
            <label htmlFor="new_grade">Τι βαθμό θα βάζατε;</label>
            <input
              type="number"
              name="new_grade"
              id="new_grade"
              step="0.1"
              onChange={(e) => setUserGrade(e.target.value)}
            />
          </div>
          <div className="category_wrapper">
            <p>
              Σε ποια κατηγορία λαθών θα θέλατε το σύστημα να δίνει μεγαλύτερη
              βαρύτητα;
            </p>
            <div id="type_btn_wrapper">
              <button
                className="type_btn"
                id="spelling"
                onClick={() => fixWeights("spelling")}
              >
                Ορθογραφικά
              </button>
              <button
                className="type_btn"
                id="grammar"
                onClick={() => fixWeights("grammar")}
              >
                Γραμματικά
              </button>
              <button
                className="type_btn"
                id="punctuation"
                onClick={() => fixWeights("punctuation")}
              >
                Στίξης
              </button>
            </div>
          </div>
          <div id="after_fix_info">
            <p>{afterFixMessage}</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default ProfGrade;
