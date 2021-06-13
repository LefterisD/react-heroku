import React, { useState, useEffect } from "react";

const EssayCounter = ({ mistakes, role, setEssayNum, wordsOrth }) => {
  const [averageGrade, setAverageGrade] = useState(0);
  const [counter2, setCounter2] = useState(0);
  const [essayNum, setEssays] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [averageWords, setAverageWords] = useState(0);
  //student info
  const [name, setName] = useState("");
  const [stuClass, setClass] = useState("");
  let content;
  let proffContent;
  let compoClass;
  let counter = 0;

  const nameHandler = (e) => {
    let name = e.target.value;
    setName(name);
  };
  const classHandler = (e) => {
    let stuClass = e.target.value;
    setClass(stuClass);
  };

  const addStudentInfo = (e) => {
    e.preventDefault();
    localStorage.setItem("StudentName", name);
    localStorage.setItem("StudentClass", stuClass);

    document.getElementById("info_form").reset();
  };

  const get_essay_count = () => {
    let curr_user = localStorage.getItem("uniqid");
    fetch(
      `https://checkitapi.herokuapp.com/update_essay_count/user/${curr_user}/role/${role}`
    )
      .then((res) => res.json())
      .then((data) => {
        let json_obj = JSON.parse(JSON.stringify(data));
        //setCounter2(json_obj[0].essayCount);
        setEssayNum(json_obj[0].essayCount);
        setEssays(json_obj[0].essayCount);
        counter = json_obj[0].essayCount;
        if (json_obj[0].essayCount >= 0) {
          console.log("GETESSAYCOUNT+++++BHKE", json_obj[0].essayCount);
          getWordCount();
        }
      });
  };

  const getWordCount = () => {
    let curr_user = localStorage.getItem("uniqid");
    fetch(`https://checkitapi.herokuapp.com/getTotalWords/${curr_user}/${role}`)
      .then((res) => res.json())
      .then((data) => {
        let json_obj = JSON.parse(JSON.stringify(data));
        getGradeTA();
        if (counter != 0) {
          let temp_total_average = Math.floor(
            json_obj[0].averageWords / counter
          );
          setAverageWords(temp_total_average);
        } else {
          setAverageWords(0);
        }
      });
  };

  const getGradeTA = () => {
    let user_id = localStorage.getItem("uniqid");
    fetch(
      `https://checkitapi.herokuapp.com/essays/all/role/${role}/id/${user_id}`
    )
      .then((res) => res.json())
      .then((essays) => {
        let essay_data = JSON.parse(JSON.stringify(essays));
        let grade_counter = 0;
        essay_data.map((essay) => {
          grade_counter = grade_counter + parseFloat(essay.grade);
        });
        console.log("ALL", grade_counter);
        console.log("counter", counter);
        let result = Math.floor(grade_counter / counter);
        if (counter !== 0) {
          setAverageGrade(result);
          setCounter2(counter);
        } else {
          setAverageGrade(0);
          setCounter2(counter);
        }
      });
  };

  const clear_data = () => {
    let curr_user = localStorage.getItem("uniqid");
    fetch(
      `https://checkitapi.herokuapp.com/mistakes/delete_by_id/id/${curr_user}/role/${role}`,
      {
        method: "POST",
      }
    ).then((results) => console.log(results));
    window.location.reload();
  };

  useEffect(() => {
    get_essay_count();
  }, [wordsOrth]);

  if (role == "professor") {
    compoClass = "counter-wrapper";
    proffContent = (
      <div id="prof-side-bar-title">
        <p className="side-bar-title">Στοιχεια μαθητη</p>
        <div className="student_info_wrapper">
          <div className="student_info_form">
            <form id="info_form">
              <div className="student_input">
                <label htmlFor="name">Όνομα μαθητή</label>
                <input
                  type="text"
                  name="name"
                  onChange={nameHandler}
                  required
                />
              </div>
              <div className="student_input">
                <label htmlFor="class">Τμήμα</label>
                <input
                  type="text"
                  name="class"
                  onChange={classHandler}
                  required
                />
              </div>
              <div id="btn_wrapper">
                <button id="add_student_info" onClick={addStudentInfo}>
                  Προσθήκη
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  } else {
    compoClass = "counter-wrapper counter-wrapper-stu";
  }

  return (
    <div className={compoClass}>
      {proffContent}
      <div className="side-bar-info">
        <p className="side-bar-title">ΠΛΗΡΟΦΟΡΙΕΣ</p>
        <div className="upper-section">
          <div className="stat-cont">
            <h2>Αριθμός εκθέσεων:</h2>
            <div className="number-wrapper">
              <p>{essayNum}</p>
            </div>
          </div>
          <div className="stat-cont">
            <h2>Μ.Ο λέξεων:</h2>
            <div className="number-wrapper">
              <p>{averageWords}</p>
            </div>
          </div>
          <div className="stat-cont">
            <h2>Μ.Ο βαθμών:</h2>
            <div className="number-wrapper">
              <p>{averageGrade}</p>
            </div>
          </div>
          <div className="delete-content">
            <p>Διαγραφή δεδομένων</p>
            <button onClick={clear_data}>Διαγραφή</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EssayCounter;
