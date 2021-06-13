import React, { useState, useEffect } from "react";
import FeedBack from "./FeedBack";
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

const COLORS = ["#243665", "#e1e5ea"];

const Grade = ({
  mistakes,
  role,
  user,
  wordCountStu,
  flag,
  countOrth,
  countGram,
  countSti,
  setFlag,
  wordsOrth,
  noMistakes,
}) => {
  const [orthComments, setOrthComments] = useState("");
  const [gramComments, setGramComments] = useState("");
  const [stiComments, setStiComments] = useState("");
  const [data, setData] = useState([]);

  const [feedBackOrth, setFeedBackOrth] = useState("");
  const [feedBackGram, setFeedBackGram] = useState("");
  const [feedBackSti, setFeedBackSti] = useState("");

  const [orthStats, setOrthStats] = useState(0);
  const [gramStats, setGramStats] = useState(0);
  const [stiStats, setStiStats] = useState(0);

  const [grade, setGrade] = useState(0);

  const [orthRate, setOrthRate] = useState(0);
  const [gramRate, setGramRate] = useState(0);
  const [stiRate, setStiRate] = useState(0);

  let content;

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
    if (mistakes.length !== 0) {
      //Essay grading
      compute_grade(0);
    } else {
      compute_grade(1);
    }
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
        addEssay(countOrth, countGram, countSti, wordCountStu, temp_grade);
      });
  };
  //add essay to  use table
  const addEssay = (countOrth, countGram, countSti, wordCount, grade) => {
    fetch(
      `https://checkitapi.herokuapp.com/essays/add/role/${role}/id/${user}/student/${"όνομα"}/class/${"τμήμα"}/spelling/${countOrth}/grammar/${countGram}/puncutation/${countSti}/words/${wordCount}/${grade}`,
      {
        method: "POST",
      }
    ).then((results) => console.log(results));
  };

  //compute coefficient fro ypes of mistakes
  const computeErrorPercentage = (wordCount, errors) => {
    let count_1 = wordCount - errors;
    return count_1 / wordCount;
  };

  const computeRate = (wordCountStu, errors) => {
    let pos = 0;
    pos = 100 * errors;
    console.log(errors);
    console.log(wordCountStu);
    console.log(pos);
    pos = pos / wordCountStu;
    //console.log(pos);
    pos = Math.round(pos * 10) / 10;
    return pos;
  };

  const compute_grade = (flag) => {
    if (flag === 0) {
      //Sydelestis 0-1 gia kathe kathgoria
      let orthPercentage = computeErrorPercentage(wordCountStu, countOrth);
      let gramPercentage = computeErrorPercentage(wordCountStu, countGram);
      let stiPercentage = computeErrorPercentage(wordCountStu, countSti);
      setOrthStats(orthPercentage);
      setGramStats(gramPercentage);
      setStiStats(stiPercentage);
      //pososto spelling
      setOrthRate(computeRate(wordCountStu, countOrth));
      setGramRate(computeRate(wordCountStu, countGram));
      setStiRate(computeRate(wordCountStu, countSti));
      //Get weights to compute grade
      getWeights(orthPercentage, gramPercentage, stiPercentage);
    } else {
      if (noMistakes === "yes") {
        setOrthStats(0);
        setGramStats(0);
        setStiStats(0);
        fillData(20);
        setGrade(20);
        addEssay(0, 0, 0, wordCountStu, 20);
      }
    }
  };

  useEffect(() => {
    if (flag === false) {
      setFlag(true);
    } else {
      findGrade();
    }
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
          <div id="color-info" className="stu-types-info">
            <span className="color-box">ΟΡΘΟΓΡΑΦΙΚΑ</span>
            <span className="color-box">ΣΤΙΞΗΣ</span>
            <span className="color-box">ΓΡΑΜΜΑΤΙΚΑ</span>
          </div>
        </div>
      </div>
    );
  } else {
    content = <div></div>;
  }
  return <div>{content}</div>;
};
export default Grade;
