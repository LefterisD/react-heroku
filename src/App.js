import "./App.css";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Student from "./components/Student";
import Professor from "./components/Professor";
import Card from "./components/Card";
import Navbar from "./components/Navbar";
import ProfessorPage from "./components/ProfessorPage";
import StudentPage from "./components/StudentPage";
import NameForm from "./components/NameForm";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import uniqid from "uniqid";
import TypeWriter from "react-typewriter";

const customStyles = {
  overlay: {
    zIndex: 1000,
    background: "rgba(0,0,0, 0.3)",
  },
};

Modal.setAppElement("#root");

function App() {
  var subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [mistakes, setMistakes] = useState([]);
  const [noMistakes, setNoMistakes] = useState("no");
  const [inputText, setInputText] = useState("");
  const [user, setUser] = useState("");
  const [role, setRole] = useState("");
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);

  let nameForm;
  let cards;

  const STUDENT_TEXT =
    "Είσαι μαθητής; Χρησιμοποίησε την εφαρμογή 'Για μαθητές' ώστε να ελέγξεις τις εκθέσεις σου. ";
  const PROFESSOR_TEXT =
    "Είσαι δάσκαλος; Χρησιμοποίησε την εφαρμογή 'Για δασκάλους' ώστε να ελέγξεις τις εκθέσεις των μαθητών σου. ";

  const getMistakes = (e) => {
    e.preventDefault();
    let stu_name = localStorage.getItem("StudentName");
    let stu_class = localStorage.getItem("StudentClass");
    if (stu_name && stu_class) {
      setLoading(true);
      fetch(` https://checkitapi.herokuapp.com/api/v1/check/${inputText}`)
        .then((res) => res.json())
        .then((data) => {
          var json_obj = JSON.parse(JSON.stringify(data));
          setMistakes(json_obj.matches);
          if (json_obj.matches.length === 0) {
            setNoMistakes("yes");
          } else {
            setNoMistakes("no");
          }
          setLoading(false);
        });

      update_essay_count();
      setChange(!change);
    } else {
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 8000);
    }
  };

  const update_essay_count = () => {
    let curr_user = localStorage.getItem("uniqid");
    fetch(
      `https://checkitapi.herokuapp.com/update_essay_count/user/${curr_user}/role/${role}`,
      {
        method: "POST",
      }
    ).then((results) => console.log(results));
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function afterOpenModal() {
    subtitle.style.color = "#f00";
  }

  useEffect(() => {
    let stored_id = localStorage.getItem("uniqid");
    if (stored_id) {
      setUser(stored_id);
    } else {
      let uniid = uniqid();
      localStorage.setItem("uniqid", uniid);
    }
  }, []);

  if (localStorage.getItem("userName")) {
    let user_role = localStorage.getItem("Role");
    let user_name = localStorage.getItem("userName");
    if (user_name.slice(-1) === "ς" || user_name.slice(-1) === "σ") {
      user_name = user_name.slice(0, -1);
    }
    if (user_role) {
      nameForm = (
        <p id="greeting-message">
          Γεια σου {user_name}, έχεις επιλέξει την ιδιότητα του{" "}
          {user_role === "professor" ? "δασκάλου" : "μαθητή"}.
        </p>
      );
    } else {
      nameForm = <div></div>;
    }
  } else {
    nameForm = <NameForm />;
  }

  if (localStorage.getItem("Role")) {
    if (localStorage.getItem("Role") === "professor") {
      cards = (
        <div className="cards">
          <Link to="/professors" style={{ textDecoration: "none" }}>
            <Card
              Svgicon={Professor}
              Title={"Για Δασκάλους"}
              text={PROFESSOR_TEXT}
            />
          </Link>
        </div>
      );
    } else if (localStorage.getItem("Role") === "student") {
      cards = (
        <div className="cards">
          <Link to="/students" style={{ textDecoration: "none" }}>
            <Card Svgicon={Student} Title={"Για Μαθητές"} text={STUDENT_TEXT} />
          </Link>
        </div>
      );
    }
  } else {
    cards = (
      <div className="cards">
        <Link to="/students" style={{ textDecoration: "none" }}>
          <Card Svgicon={Student} Title={"Για Μαθητές"} text={STUDENT_TEXT} />
        </Link>

        <Link to="/professors" style={{ textDecoration: "none" }}>
          <Card
            Svgicon={Professor}
            Title={"Για Καθηγητές"}
            text={PROFESSOR_TEXT}
          />
        </Link>
      </div>
    );
  }
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact>
            <Navbar OpenModal={openModal} />
            <div id="skewed">
              <div className="jumbo">
                <h1> CheckIt </h1>
                {/*<p>
                  Το CheckIt είναι μια web εφαρμογή ελέγχου και βαθμολόγησης
                  εκθέσεων που χρησιμοποιείται από καθηγητές και μαθητές σε όλη
                  την Ελλάδα.
                </p>*/}
                <TypeWriter typing={2} fixed={true}>
                  Το CheckIt είναι μια web εφαρμογή ελέγχου και βαθμολόγησης
                  κειμένων που χρησιμοποιείται από καθηγητές και μαθητές σε όλη
                  την Ελλάδα.
                </TypeWriter>
              </div>
              {nameForm}
              {cards}
            </div>
            <div id="not_skewed"> </div>
          </Route>
          <Route path="/professors">
            <ProfessorPage
              inputText={inputText}
              setInputText={setInputText}
              getMistakes={getMistakes}
              mistakes={mistakes}
              user={user}
              setUser={setUser}
              setRole={setRole}
              change={change}
              noMistakes={noMistakes}
              loading={loading}
              alert={alert}
            />
          </Route>
          <Route path="/students">
            <StudentPage user={user} change={change} noMistakes={noMistakes} />
          </Route>
        </Switch>
      </Router>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal"
        style={customStyles}
        contentLabel="Test Modal"
        closeTimeoutMS={300}
      >
        <header>
          <button onClick={closeModal}>
            <i class="fas fa-times"> </i>
          </button>
        </header>
        <div className="container">
          <div className="title">
            <div className="svg-wrapper">
              <svg
                width="338"
                height="234"
                viewBox="0 0 717 334"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M474.565 121.55C463.945 103.605 442.936 102.769 442.936 102.769C442.936 102.769 422.463 100.151 409.33 127.481C397.089 152.955 380.195 177.55 406.61 183.513L411.382 168.662L414.337 184.619C418.098 184.89 421.871 184.954 425.639 184.812C453.928 183.899 480.868 185.08 480.001 174.928C478.848 161.432 484.783 138.816 474.565 121.55Z"
                  fill="#2F2E41"
                />
                <path
                  d="M430.977 159.107C434.636 167.202 436.943 176.851 438.321 187.568L467.699 185.732C460.945 176.161 458.702 165.175 461.272 152.68L430.977 159.107Z"
                  fill="#FFB8B8"
                />
                <path
                  opacity="0.2"
                  d="M430.977 159.107C434.636 167.202 436.943 176.851 438.321 187.568L467.699 185.732C460.945 176.161 458.702 165.175 461.272 152.68L430.977 159.107Z"
                  fill="black"
                />
                <path
                  d="M294.673 313.229C294.673 313.229 279.469 321.374 287.184 328.328C294.9 335.282 305.092 319.123 305.092 319.123L294.673 313.229Z"
                  fill="#FFB8B8"
                />
                <path
                  d="M480.552 289.478L480.315 300.605L479.808 324.648V324.652L479.66 331.615H382.429L386.38 309.671L386.384 309.654L389.923 290.014L391.502 281.218V281.214L471.372 270.197L480.552 289.478Z"
                  fill="#2F2E41"
                />
                <path
                  d="M480.552 289.479L480.313 300.607C452.055 299.881 408.255 293.06 389.922 290.012L391.501 281.216L471.371 270.199L480.552 289.479Z"
                  fill="#3F3D56"
                />
                <path
                  d="M445.207 166.911C457.882 166.911 468.158 156.634 468.158 143.958C468.158 131.281 457.882 121.005 445.207 121.005C432.531 121.005 422.255 131.281 422.255 143.958C422.255 156.634 432.531 166.911 445.207 166.911Z"
                  fill="#FFB8B8"
                />
                <path
                  d="M489.273 301.874C489.273 301.874 492.027 326.663 475.502 324.826L472.748 300.037L458.059 285.348L416.747 284.429L386.451 312.891C386.451 312.891 385.533 283.511 389.206 280.757C392.878 278.003 401.14 271.576 401.14 271.576V266.985L376.353 216.489C376.353 216.489 391.042 186.191 402.976 185.273L418.583 184.355C418.583 184.355 424.091 181.601 424.091 180.683C424.091 179.764 423.173 172.419 427.764 174.256C427.764 174.256 428.177 164.836 433.015 167.71C433.015 167.71 448.245 179.645 463.705 168.233C463.705 168.233 470.912 166.911 469.994 170.583C469.076 174.256 469.994 177.01 471.83 177.01C473.666 177.01 481.929 179.764 481.929 181.601C481.929 181.995 482.525 185.796 483.462 191.516V191.525C486.868 212.376 494.781 258.722 494.781 258.722C494.781 258.722 503.044 270.658 489.273 301.874Z"
                  fill="#FFD89B"
                />
                <path
                  d="M382.779 211.898L376.353 216.489L317.598 291.774L286.384 316.563C286.384 316.563 303.827 313.809 300.155 328.499L407.567 266.985L382.779 211.898Z"
                  fill="#FFD89B"
                />
                <path
                  d="M483.462 191.516V191.525C482.241 198.705 442.452 197.209 436.944 197.209C431.436 197.209 426.846 196.29 421.337 192.618C415.829 188.946 418.583 184.355 418.583 184.355C418.583 184.355 423.273 180.782 423.273 179.864C423.273 178.946 422.355 171.601 426.946 173.438C426.946 173.438 427.359 164.018 432.197 166.891C432.197 166.891 448.245 179.645 463.705 168.233C463.705 168.233 470.912 166.911 469.994 170.583C469.076 174.256 469.994 177.01 471.83 177.01C473.666 177.01 481.929 179.764 481.929 181.601C481.929 181.995 482.525 185.796 483.462 191.516Z"
                  fill="#3F3D56"
                />
                <path
                  d="M478.715 157.271C478.715 157.271 471.371 141.663 464.027 149.008C456.682 156.352 472.289 167.37 472.289 167.37L478.715 157.271Z"
                  fill="#FFB8B8"
                />
                <path
                  d="M478.715 153.598C478.715 153.598 467.374 167.931 463.864 169.028C463.864 169.028 474.125 209.603 486.978 220.621L494.322 258.263C494.322 258.263 525.536 245.41 518.192 224.293C518.118 224.082 518.045 223.872 517.972 223.663C511.84 206.078 503.377 189.394 492.809 174.058L478.715 153.598Z"
                  fill="#FFD89B"
                />
                <path
                  opacity="0.2"
                  d="M472.655 196.11L495.24 258.263L486.978 220.62L472.655 196.11Z"
                  fill="black"
                />
                <path
                  d="M469.87 119.82L449.113 108.947L420.45 113.395L414.519 139.59L429.282 139.022L433.406 129.398V138.863L440.218 138.601L444.171 123.28L446.642 139.59L470.858 139.096L469.87 119.82Z"
                  fill="#2F2E41"
                />
                <path
                  d="M665.952 261.112L677.729 303.124C677.729 303.124 675.302 340.336 686.627 333.056C698.216 325.605 693.907 294.226 693.907 294.226L687.119 256.536L665.952 261.112Z"
                  fill="#A0616A"
                />
                <path
                  d="M672.245 143.259L681.97 152.985V199.325C681.97 199.325 687.691 207.907 686.547 210.195C685.403 212.484 684.259 212.484 685.403 214.2C686.547 215.916 687.691 217.06 686.547 218.205C685.403 219.349 685.403 222.209 686.547 223.353C687.691 224.498 689.979 226.214 688.263 227.93C686.547 229.647 684.259 228.502 686.547 234.796C688.835 241.089 692.84 242.805 691.695 245.093C690.551 247.382 690.551 253.103 690.551 253.103L665.952 256.536L660.804 191.888L672.245 143.259Z"
                  fill="#D0CDE1"
                />
                <path
                  d="M691.695 252.531L663.092 253.675L664.236 265.689L689.407 261.113L691.695 252.531Z"
                  fill="#3F3D56"
                />
                <path
                  d="M613.037 83.4741L609.604 117.8L644.5 122.949L647.074 103.212L649.649 83.4741H613.037Z"
                  fill="#A0616A"
                />
                <path
                  opacity="0.1"
                  d="M613.037 83.2881L609.604 117.614L644.5 122.763L647.074 103.026L649.649 83.2881H613.037Z"
                  fill="black"
                />
                <path
                  d="M537.238 246.81L556.688 288.573C556.688 288.573 560.121 308.025 565.269 308.597C570.418 309.169 575.566 288.573 575.566 288.573L568.702 277.703L560.693 246.81H537.238Z"
                  fill="#A0616A"
                />
                <path
                  d="M670.38 332.02H560.418C561.29 318.237 561.838 309.741 561.838 309.741L563.298 307.441L570.379 296.314L575.435 288.369L577.198 285.596L577.853 284.569L584.778 283.305L656.227 270.267C657.408 275.558 659.08 280.729 661.221 285.71C661.708 286.819 662.232 287.927 662.792 289.024C664.588 292.53 666.78 295.852 669.386 298.298C669.979 298.854 670.409 300.339 670.687 302.622C671.374 308.215 671.178 318.614 670.38 332.02Z"
                  fill="#2F2E41"
                />
                <path
                  d="M632.201 94.6301C647.366 94.6301 659.66 82.3353 659.66 67.169C659.66 52.0027 647.366 39.708 632.201 39.708C617.035 39.708 604.742 52.0027 604.742 67.169C604.742 82.3353 617.035 94.6301 632.201 94.6301Z"
                  fill="#A0616A"
                />
                <path
                  d="M570.99 123.235L566.985 120.947C566.985 120.947 549.251 132.961 543.531 159.85C537.81 186.739 533.806 193.604 533.806 193.604C533.806 193.604 528.085 194.748 532.089 198.753C536.094 202.758 536.094 202.186 532.662 204.474C529.229 206.762 526.941 202.186 529.229 206.762C531.517 211.339 534.378 210.195 532.089 213.056C529.801 215.916 525.797 215.916 528.085 218.205C530.373 220.493 525.797 225.642 528.657 227.93C531.517 230.219 532.662 230.791 532.662 234.796C532.644 237.133 533.031 239.456 533.806 241.661H563.553C563.553 241.661 557.832 230.791 559.549 228.502C561.265 226.214 561.837 223.926 560.693 222.781C559.549 221.637 556.116 223.926 559.549 221.065C562.981 218.205 564.125 219.921 562.981 216.488C561.837 213.056 559.549 214.772 561.837 213.056C564.125 211.339 565.841 211.911 564.697 210.195C563.553 208.479 561.265 208.479 563.553 207.335C565.841 206.19 567.557 207.335 566.985 204.474C566.413 201.614 565.841 202.758 566.985 201.614C568.13 200.469 580.143 161.566 580.143 160.422C580.143 159.278 570.99 123.235 570.99 123.235Z"
                  fill="#D0CDE1"
                />
                <path
                  d="M565.269 239.373L529.229 241.661L538.382 250.242L563.553 250.815L565.269 239.373Z"
                  fill="#3F3D56"
                />
                <path
                  d="M575.566 282.28L568.13 296.011C568.13 296.011 590.44 298.871 598.449 301.732C606.458 304.592 627.052 308.597 627.052 308.597L632.201 288.573L575.566 282.28Z"
                  fill="#3F3D56"
                />
                <path
                  d="M640.781 288.573L647.074 307.453L672.245 302.304L669.385 284.569L640.781 288.573Z"
                  fill="#3F3D56"
                />
                <path
                  d="M651.079 103.784C651.079 103.784 649.363 102.639 645.358 104.928C641.354 107.216 628.196 108.361 621.904 101.495C615.611 94.63 611.034 88.909 609.318 90.0532C607.602 91.1974 606.458 104.356 606.458 104.356L600.737 108.933L566.985 120.947L569.846 198.181L574.994 215.916C574.994 215.916 570.99 229.647 576.138 237.656C581.287 245.666 573.278 248.526 573.278 248.526C573.278 248.526 571.562 250.814 572.706 256.536C573.85 262.257 571.562 283.424 571.562 283.424C571.562 283.424 620.187 305.164 671.101 286.285L665.38 264.545L662.52 215.916C662.52 215.916 665.38 207.907 664.808 204.474C664.236 201.041 681.97 152.985 681.97 152.985C681.97 152.985 679.11 128.956 664.236 123.807C649.363 118.658 647.074 113.509 647.074 113.509C647.074 113.509 653.939 106.072 651.079 103.784Z"
                  fill="#D0CDE1"
                />
                <path
                  d="M604.551 70.6868C604.551 70.6868 601.7 66.4093 602.796 61.8027C603.452 59.1874 603.711 56.4884 603.564 53.7961C603.564 53.7961 605.867 46.3379 608.17 42.17C610.474 38.0022 609.377 36.2473 616.615 34.9311C623.854 33.615 620.892 24.1825 639.975 34.3827C640.619 35.2817 641.515 35.9698 642.549 36.3602C643.584 36.7507 644.711 36.8258 645.788 36.5763C649.736 35.8086 651.162 41.2926 651.162 41.2926C651.162 41.2926 653.794 39.7571 654.781 41.9507C655.768 44.1443 662.806 40.6341 662.806 55.4409C662.806 70.2477 654.797 83.474 654.797 83.474C654.797 83.474 655.384 58.5672 642.333 56.0445C629.282 53.5219 615.244 46.1733 611.844 55.6058C608.445 65.0383 604.551 70.6868 604.551 70.6868Z"
                  fill="#2F2E41"
                />
                <path
                  d="M655.083 76.6088C656.505 76.6088 657.658 75.0719 657.658 73.1761C657.658 71.2803 656.505 69.7435 655.083 69.7435C653.661 69.7435 652.509 71.2803 652.509 73.1761C652.509 75.0719 653.661 76.6088 655.083 76.6088Z"
                  fill="#A0616A"
                />
                <path
                  d="M276.965 140.265H8.1195C5.96679 140.263 3.90294 139.407 2.38075 137.885C0.858552 136.363 0.0023485 134.3 0 132.148V68.1167C0.00235051 65.9647 0.858553 63.9016 2.38075 62.3799C3.90294 60.8583 5.96679 60.0023 8.1195 60H276.965C279.118 60.0023 281.182 60.8583 282.704 62.3799C284.226 63.9016 285.082 65.9647 285.085 68.1167V132.148C285.082 134.3 284.226 136.363 282.704 137.885C281.182 139.407 279.118 140.263 276.965 140.265V140.265ZM8.1195 61.8037C6.44523 61.8057 4.84013 62.4715 3.65624 63.655C2.47236 64.8385 1.80637 66.443 1.80434 68.1167V132.148C1.80637 133.822 2.47236 135.427 3.65624 136.61C4.84013 137.794 6.44523 138.459 8.1195 138.461H276.965C278.639 138.459 280.244 137.794 281.428 136.61C282.612 135.427 283.278 133.822 283.28 132.148V68.1167C283.278 66.443 282.612 64.8385 281.428 63.655C280.244 62.4715 278.639 61.8057 276.965 61.8037H8.1195Z"
                  fill="#3F3D56"
                />
                <path
                  d="M263.884 126.737H21.2009C21.0822 126.738 20.9646 126.714 20.8549 126.669C20.7451 126.624 20.6453 126.558 20.5613 126.474C20.4772 126.39 20.4106 126.291 20.3651 126.181C20.3196 126.072 20.2961 125.954 20.2961 125.835C20.2961 125.717 20.3196 125.599 20.3651 125.49C20.4106 125.38 20.4772 125.281 20.5613 125.197C20.6453 125.113 20.7451 125.047 20.8549 125.001C20.9646 124.956 21.0822 124.933 21.2009 124.933H263.884C264.002 124.933 264.12 124.956 264.23 125.001C264.34 125.047 264.439 125.113 264.523 125.197C264.607 125.281 264.674 125.38 264.72 125.49C264.765 125.599 264.789 125.717 264.789 125.835C264.789 125.954 264.765 126.072 264.72 126.181C264.674 126.291 264.607 126.39 264.523 126.474C264.439 126.558 264.34 126.624 264.23 126.669C264.12 126.714 264.002 126.738 263.884 126.737V126.737Z"
                  fill="#E6E6E6"
                />
                <path
                  d="M46.9126 96.976H27.065C26.8262 96.9767 26.5974 97.0721 26.4288 97.2411C26.2602 97.4102 26.1655 97.6392 26.1655 97.8779C26.1655 98.1166 26.2602 98.3456 26.4288 98.5147C26.5974 98.6837 26.8262 98.7791 27.065 98.7798H36.0867V114.727C36.0708 115.883 36.4964 117.001 37.2768 117.854C38.0571 118.707 39.1335 119.231 40.2866 119.318C40.3429 119.321 40.4011 119.322 40.4601 119.322C41.1693 119.308 41.8646 119.123 42.4859 118.781C43.1072 118.438 43.6356 117.95 44.0256 117.358C44.1687 117.166 44.23 116.926 44.196 116.69C44.162 116.453 44.0355 116.24 43.8443 116.096C43.6531 115.953 43.4128 115.892 43.1762 115.925C42.9396 115.959 42.7261 116.085 42.5825 116.276C42.3526 116.658 42.0268 116.974 41.6373 117.191C41.2479 117.409 40.8084 117.521 40.3623 117.516C39.673 117.452 39.0338 117.128 38.5748 116.61C38.1157 116.092 37.8713 115.419 37.8911 114.727V98.7797H46.9127C47.0314 98.7801 47.149 98.757 47.2588 98.7118C47.3685 98.6667 47.4683 98.6003 47.5523 98.5165C47.6364 98.4327 47.7031 98.3332 47.7486 98.2236C47.7941 98.114 47.8175 97.9965 47.8175 97.8779C47.8175 97.7592 47.7941 97.6417 47.7486 97.5321C47.7031 97.4225 47.6364 97.323 47.5523 97.2392C47.4683 97.1554 47.3685 97.0891 47.2588 97.0439C47.149 96.9987 47.0314 96.9757 46.9127 96.976L46.9126 96.976Z"
                  fill="#FFD89B"
                />
                <path
                  d="M114.575 175.437C118.561 175.437 121.793 172.207 121.793 168.222C121.793 164.238 118.561 161.008 114.575 161.008C110.589 161.008 107.358 164.238 107.358 168.222C107.358 172.207 110.589 175.437 114.575 175.437Z"
                  fill="#E6E6E6"
                />
                <path
                  d="M142.542 175.437C146.528 175.437 149.76 172.207 149.76 168.222C149.76 164.238 146.528 161.008 142.542 161.008C138.556 161.008 135.325 164.238 135.325 168.222C135.325 172.207 138.556 175.437 142.542 175.437Z"
                  fill="#FFD89B"
                />
                <path
                  d="M170.509 175.437C174.495 175.437 177.727 172.207 177.727 168.222C177.727 164.238 174.495 161.008 170.509 161.008C166.523 161.008 163.292 164.238 163.292 168.222C163.292 172.207 166.523 175.437 170.509 175.437Z"
                  fill="#E6E6E6"
                />
                <path
                  d="M51.1252 118.649C51.4198 118.639 51.6989 118.514 51.9038 118.303C52.1086 118.091 52.223 117.807 52.223 117.513C52.223 117.218 52.1086 116.935 51.9038 116.723C51.6989 116.511 51.4198 116.387 51.1252 116.377C50.8306 116.387 50.5514 116.511 50.3466 116.723C50.1418 116.935 50.0273 117.218 50.0273 117.513C50.0273 117.807 50.1418 118.091 50.3466 118.303C50.5514 118.514 50.8306 118.639 51.1252 118.649V118.649Z"
                  fill="#3F3D56"
                />
                <path
                  d="M58.3425 118.649C58.6371 118.639 58.9162 118.514 59.1211 118.303C59.3259 118.091 59.4403 117.807 59.4403 117.513C59.4403 117.218 59.3259 116.935 59.1211 116.723C58.9162 116.511 58.6371 116.387 58.3425 116.377C58.0479 116.387 57.7687 116.511 57.5639 116.723C57.3591 116.935 57.2446 117.218 57.2446 117.513C57.2446 117.807 57.3591 118.091 57.5639 118.303C57.7687 118.514 58.0479 118.639 58.3425 118.649V118.649Z"
                  fill="#3F3D56"
                />
                <path
                  d="M65.5598 118.649C65.8544 118.639 66.1336 118.514 66.3384 118.303C66.5432 118.091 66.6576 117.807 66.6576 117.513C66.6576 117.218 66.5432 116.935 66.3384 116.723C66.1336 116.511 65.8544 116.387 65.5598 116.377C65.2652 116.387 64.9861 116.511 64.7813 116.723C64.5764 116.935 64.462 117.218 64.462 117.513C64.462 117.807 64.5764 118.091 64.7813 118.303C64.9861 118.514 65.2652 118.639 65.5598 118.649V118.649Z"
                  fill="#3F3D56"
                />
                <path
                  d="M99 275C99 302.082 116.444 324 138 324Z"
                  fill="#46455B"
                />
                <path
                  d="M138 324C138 296.362 157.234 274 181 274Z"
                  fill="#FFD89B"
                />
                <path
                  d="M113 277C113 302.979 124.184 324 138 324Z"
                  fill="#FFD89B"
                />
                <path
                  d="M138 324C138 288.627 160.365 260 188 260Z"
                  fill="#46455B"
                />
                <path
                  opacity="0.1"
                  d="M136 334C141.523 334 146 333.328 146 332.5C146 331.672 141.523 331 136 331C130.477 331 126 331.672 126 332.5C126 333.328 130.477 334 136 334Z"
                  fill="#FFD89B"
                />
                <path
                  d="M130 324.86C130 324.86 135.381 324.695 136.995 323.562C138.609 322.429 145.265 321.068 145.668 322.889C146.072 324.711 153.739 331.951 147.675 331.998C141.611 332.046 133.567 331.066 131.953 330.097C130.339 329.128 130 324.86 130 324.86Z"
                  fill="#A8A8A8"
                />
                <path
                  opacity="0.2"
                  d="M147.783 331.381C141.715 331.427 133.685 330.467 132.065 329.517C130.834 328.795 130.344 326.194 130.177 325H130C130 325 130.339 329.184 131.958 330.135C133.577 331.085 141.608 332.045 147.675 331.998C149.429 331.998 150.031 331.381 149.999 330.493C149.757 331.033 149.117 331.37 147.783 331.381Z"
                  fill="black"
                />
              </svg>
            </div>
            <h1> CheckIt </h1>
          </div>
          <div className="main-section">
            <p>
              Το Checkit είναι μία web εφαρμογή που χρησιμοποιείται για τον
              έλεγχο κειμένων της ελληνικής γλώσσας. Η εφαρμογή χωρίζεται σε δύο
              υποεφαρμογές, οι οποίες ονομάζονται 'Για Μαθητές' και 'Για
              Δασκάλους'. Τόσο η εφαρμογή του μαθητή όσο και η εφαρμογή για του
              δασκάλου, εντοπίζει τα ορθογραφικά, γραμματικά και λάθη στίξης των
              κειμένων. Σκοπός της υπό-εφαρμογής 'Για μαθητές' είναι η μείωση
              των λαθών του μαθητή που επιτυγχάνεται με την χρήση κατάλληλων
              σχολίων και στατιστικών στο χρόνο. Η υποεφαρμογή 'Για Δασκάλους',
              στοχεύει στην μείωση του χρόνου διόρθωσης και βαθμολόγησης
              κειμένων των μαθητών αλλά και στην εξαγωγή πληροφοριών που αφορούν
              τα κείμενα των μαθητών.
            </p>
            <div className="icon-wrapper">
              <i class="fab fa-github"> </i>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;
