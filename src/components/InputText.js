import React, { useState, useEffect } from "react";
import { HighlightWithinTextarea } from "react-highlight-within-textarea";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import Loader from "react-loader-spinner";

const InputText = ({
  setInputText,
  getMistakes,
  mistakes,
  setWordsToHighlight,
  setcountGram,
  setcountOrth,
  setcountSti,
  setWordsOrth,
  setWordsGram,
  role,
  setWordCountProf,
  setWordCountStu,
  loading,
}) => {
  const [textAreaInput, setTextAreaInput] = useState("");
  const [words_json, setWordsJson] = useState([]);

  const [tooltipReplacements, setTooltipReplacements] = useState([]);
  const [characters, setCharacters] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [currUser, setCurrUser] = useState("");

  const [weightSpell, setWeightSpell] = useState(0);
  const [weightGram, setWeightGram] = useState(0);
  const [weightPunc, setWeightPunc] = useState(0);

  let words = [];
  let tooltipMessage = "";
  let tooltipshortMessage = "";
  let replacement_words = [];
  let fakeWordsOrth = [];
  let fakeWordsGram = [];
  let countOrth1;
  let countSti1;
  let countGram1;
  let content;

  //Fetching the api to insert into the db or update a specific word count
  const insert_to_database = (word, type, role) => {
    fetch(
      `https://checkitapi.herokuapp.com/role/${role}/id/${currUser}/type/${type}/word/${word}`,
      {
        method: "POST",
      }
    ).then((results) => console.log(results));
  };
  //kossy wordCount
  const insert_count = (wordCount) => {
    fetch(
      `https://checkitapi.herokuapp.com/mistakes/${wordCount}/${currUser}/${role}`,
      {
        method: "POST",
      }
    ).then((results) => console.log(results));
  };

  const inputTextHandler = (e) => {
    let input_value = e.target.value;
    let char_count = input_value.length;
    let w_count = input_value.split(" ").length;

    setInputText(input_value);
    setTextAreaInput(input_value);
    setCharacters(char_count);
    setWordCount(w_count);
    setWordCountProf(w_count);
    setWordCountStu(w_count);
  };

  //vazei sto map tis lekseis kai to poses fores einai lathos
  const setOrthWords = (word) => {
    let counter = 0; // xrisimopoieite gia na elegxoume ama mia leksi uparxei idi mesa sto map
    if (fakeWordsOrth.length !== 0) {
      fakeWordsOrth.map((item) => {
        //console.log("Mpike sto map");
        if (item.word === word) {
          //console.log("Yparxei idia leksi",item.word);
          item.count = item.count + 1;
          counter = 1;
          insert_to_database(word, "spelling", role);
        }
      });
      if (counter === 0) {
        // console.log("DEn Yparxei i leksi");
        let newobject = {
          word: word,
          count: 1,
        };
        fakeWordsOrth.push(newobject);
        insert_to_database(word, "spelling", role);
      }
    } else {
      //console.log(" pinakas kenos");
      let newobject = {
        word: word,
        count: 1,
      };
      fakeWordsOrth.push(newobject);
      insert_to_database(word, "spelling", role);
    }
    setWordsOrth(fakeWordsOrth);
  };

  const setGramWords = (word) => {
    let counter = 0; // xrisimopoieite gia na elegxoume ama mia leksi uparxei idi mesa sto map
    if (fakeWordsGram.length !== 0) {
      fakeWordsGram.map((item) => {
        //console.log("Mpike sto map");
        if (item.word === word) {
          //console.log("Yparxei idia leksi",item.word);
          item.count = item.count + 1;
          counter = 1;
          insert_to_database(word, "grammar", role);
        }
      });
      if (counter === 0) {
        // console.log("DEn Yparxei i leksi")
        let newobject = {
          word: word,
          count: 1,
        };
        fakeWordsGram.push(newobject);
        insert_to_database(word, "grammar", role);
      }
    } else {
      //console.log(" pinakas kenos");
      let newobject = {
        word: word,
        count: 1,
      };
      fakeWordsGram.push(newobject);
      insert_to_database(word, "grammar", role);
    }
    setWordsGram(fakeWordsGram);
  };

  //count mistakes for charts
  const findCount = (item, word, firstTime) => {
    if (firstTime == 0) {
      countOrth1 = 0;
      countSti1 = 0;
      countGram1 = 0;
    }
    if (item.shortMessage == "Ορθογραφικό λάθος") {
      countOrth1++;

      setOrthWords(word); // gia na stelnw tin leksi pou einai orthografika lathos
    } else if (
      item.shortMessage == "Ελέγξτε τη στίξη" ||
      item.shortMessage == ""
    ) {
      countSti1++;

      insert_to_database(word, "syntax", role);
    } else if (item.shortMessage == "Επανάληψη λέξης") {
      countGram1++;

      setGramWords(word);
    }
  };

  //vriskei tis lathos leksis mia mia
  const wrongWord = (item) => {
    let offset = item.context.offset;
    let length = item.context.length;
    let sentence = item.context.text;
    // To get only the mistake slice from (offset to offset + length) e.g offset = 3  length = 5 => slice(3,8)
    let word1 = sentence.slice(offset, offset + length);
    return word1;
  };

  // This functions finds all the mistakes (words) the user made and puts them in an array that then is returned to the highlight component to highlight the correspponding words
  const findWrongWords = (mistakes) => {
    insert_count(wordCount);
    if (mistakes.length != 0) {
      let firstTime = 0;
      words = [];
      mistakes.map((item) => {
        let word = wrongWord(item); // vriskei tin leksi
        findCount(item, word, firstTime); // vriskei ta lathi
        firstTime = 1;
        words.push(word);
      });
      console.log("PROFESOR COUNT", countOrth1);
      adduser(0);
      //------------
      setcountOrth(countOrth1); // dinei me to set sto countorth to athrisma
      setcountSti(countSti1);
      setcountGram(countGram1);
      setWordsOrth(fakeWordsOrth);
      setWordsGram(fakeWordsGram);
      return words;
    } else {
      //test
      let randomNum = -1000 + Math.floor(Math.random() * 100);
      setWordsOrth(randomNum);
      //test
      //If no mistakes are found
      adduser(1);
      // if mistakes array is empty use a placeholder for the words
      words = [];
      words.push(["placeholder"]);
      return words;
    }
  };

  const adduser = (flag) => {
    //get weights to use in the model
    getWeights();
    if (flag === 0) {
      //FOR feedback
      if (role == "student") {
        //setOrthStats(orthPercentage);
        //setGramStats(gramPercentage);
        //setStiStats(stiPercentage);
      }
      if (weightSpell === 0 && weightPunc === 0 && weightGram === 0) {
        //IF the user enter for he first time we need to give the model he average of each weight
        getTotalAverageOfWeights();
      }
      getWeights();
    } else {
      if (role && currUser) {
        if (role == "student") {
          //let orthPercentage = computeErrorPercentage(wordCount, countOrth);
          //let gramPercentage = computeErrorPercentage(wordCount, countGram);
          //let stiPercentage = computeErrorPercentage(wordCount, countSti);
          //setOrthStats(orthPercentage);
          //setGramStats(gramPercentage);
          //setStiStats(stiPercentage);
        }
      }
    }
  };
  //Get weights for a specific user
  const getWeights = () => {
    fetch(`https://checkitapi.herokuapp.com/weights/by/${role}/${currUser}`)
      .then((res) => res.json())
      .then((data) => {
        let json_obj = JSON.parse(JSON.stringify(data));

        setWeightSpell(json_obj[0].spelling_w);
        setWeightGram(json_obj[0].grammar_w);
        setWeightPunc(json_obj[0].punctuation_w);
      });
  };
  //Get total average of weights If the user enters for he first time
  const getTotalAverageOfWeights = () => {
    let w1 = 0,
      w2 = 0,
      w3 = 0,
      count = 0;
    fetch(`https://checkitapi.herokuapp.com/test/route`)
      .then((res) => res.json())
      .then((data) => {
        let json_obj = JSON.parse(JSON.stringify(data));
        /*setWeightSpell(json_obj[0].spelling_w);
      setWeightGram(json_obj[0].grammar_w);
      setWeightPunc(json_obj[0].punctuation_w);
      w1 = json_obj[0].spelling_w;
      w2 = json_obj[0].grammar_w;
      w3 = json_obj[0].punctuation_w;*/
        json_obj.map((x) => {
          w1 = w1 + x.w1;
          w2 = w2 + x.w2;
          w3 = w3 + x.w3;
          count = count + 1;
        });
        if (count !== 0) {
          w1 = w1 / count;
          w2 = w2 / count;
          w3 = w3 / count;
        }
        assignUserWeight(w1, w2, w3);
      });
  };

  const assignUserWeight = (w1, w2, w3) => {
    fetch(
      `https://checkitapi.herokuapp.com/add/user/weights/${role}/${currUser}/${w1}/${w2}/${w3}`,
      {
        method: "POST",
      }
    ).then((results) => console.log(results));
  };

  useEffect(() => {
    fakeWordsOrth = [];
    fakeWordsGram = [];
    setWordsToHighlight(findWrongWords(mistakes));
    prepare_words_for_highlight();
    setCurrUser(localStorage.getItem("uniqid"));
  }, [mistakes]);

  /*---------------------------------Toolip--------------------------------*/

  const tooltip_content = (wrong_word) => {
    replacement_words = [];
    mistakes.map((item) => {
      let offset = item.context.offset;
      let length = item.context.length;
      let sentence = item.context.text;
      // To get only the mistake slice from (offset to offset + length) e.g offset = 3  length = 5 => slice(3,8)
      let word = sentence.slice(offset, offset + length);
      //prepei na mpei se sinartisi
      if (word === wrong_word) {
        let message = item.message;
        let shortMessage = item.shortMessage;
        tooltipshortMessage = shortMessage;
        tooltipMessage = message;
        let repls = item.replacements;
        let sliced = repls.slice(0, 2);
        sliced.map((repl) => {
          replacement_words.push(repl.value);
        });
        //console.log(replacement_words);
      }
    });
  };
  //Sets different background color for the highlighted word based on type of mistake
  const pick_color = (mistakes, word) => {
    let class_name = "";
    mistakes.map((item) => {
      let match = wrongWord(item);
      if (word === match) {
        let message = item.shortMessage;
        if (message == "Ορθογραφικό λάθος") {
          class_name = "blue";
        } else if (message == "Ελέγξτε τη στίξη" || message == "") {
          class_name = "yellow";
        } else if (message == "Επανάληψη λέξης") {
          class_name = "green";
        }
      }
    });
    return class_name;
  };

  const prepare_words_for_highlight = () => {
    //words_json = [];

    if (words.length != 0) {
      let temp_arr = [];
      words.map((item, index) => {
        let temp_item = {
          highlight: item,
          enhancement: ToolTip,
          className: pick_color(mistakes, item),
        };
        temp_arr.push(temp_item);
      });
      setWordsJson(temp_arr);
    }
  };

  function ToolTip(props) {
    tooltip_content(props.data.text); // call the function to update the tooltip message state
    replacement_words = replacement_words.slice(0, 2);
    const content = (
      <div
        style={{
          whiteSpace: "pre",
          overflow: "hidden",
          textOverflow: "ellipsis",
          backgroundColor: "transparent",
        }}
      >
        <div className="tooltip-message">
          <div className="tooltp-content">
            <h1 className="tooltip-header">{tooltipshortMessage}</h1>
            <p className="tooltip-info">{tooltipMessage}</p>
            <div className="rightwords">
              {replacement_words.map((ww, count) => (
                <button className="new-word">{ww}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
    const overlayStyle = {
      position: "absolute",
      height: "50%",
      width: "100%",
      background: "transparent",
      zIndex: 1,
    };

    return (
      <mark style={{ position: "relative" }}>
        <Tippy content={content} maxWidth="400px">
          <mark style={overlayStyle}></mark>
        </Tippy>
        <props.MarkView />
      </mark>
    );
  }
  /*---------------------------------Toolip--------------------------------*/

  return (
    <div className="content">
      <div className="text-box-check">
        <form>
          <HighlightWithinTextarea
            id="textarea-box2"
            value={textAreaInput}
            highlight={words_json}
            onChange={inputTextHandler}
            containerClassName="textarea-container"
            placeholder="Γράψτε εδώ..."
          />
          <div className="footer">
            <div className="word-count">
              <div className="words">
                λέξεις:<span className="number-color"> {wordCount}</span>
              </div>
              <div className="chars">
                χαρακτήρες:<span className="number-color"> {characters} </span>
              </div>
            </div>
            {content}
            {loading ? (
              <div id="loader">
                <Loader
                  type="ThreeDots"
                  color=" #8bd8bd"
                  height={100}
                  width={30}
                  timeout={10000} //10 secs
                />
              </div>
            ) : (
              <input
                type="submit"
                onClick={getMistakes}
                value="Έλεγχος"
                id="check-text-btn"
              />
            )}
          </div>
        </form>
      </div>
      <div className="svgbox" styles="overflow: hidden;">
        <div id="top-svg"></div>
      </div>
    </div>
  );
};

export default InputText;
