import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Modal from "react-modal";
import step1 from "../assets/step1.gif";
import step2 from "../assets/step2.gif";
import grade_img from "../assets/grade_img.png";
import charts from "../assets/charts.jpg";
import table from "../assets/table.jpg";
import deleteimg from "../assets/deleteimg.jpg";
import exportimg from "../assets/exportimg.jpg";
import dislike from "../assets/dislike.gif";
import newgrade from "../assets/newgrade.gif";

const DropDownBtn = ({ role }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  function openHelpModal(e) {
    e.preventDefault();
    setIsOpen(true);
  }

  function closeHelpModal() {
    setIsOpen(false);
  }

  return (
    <div className="dropdown_wrapper">
      <div class="dropdown">
        <button class="dropbtn">
          Επιλογες <i class="fas fa-chevron-down"></i>
        </button>
        <div class="dropdown-content">
          <button onClick={openHelpModal}>Βοήθεια</button>
          <button onClick={goBack}>Έξοδος</button>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeHelpModal}
        className="help_modal"
        contentLabel=""
        closeTimeoutMS={300}
      >
        <header>
          <button onClick={closeHelpModal}>
            <i class="fas fa-times"> </i>
          </button>
        </header>
        {role === "professor" ? (
          <div className="steps">
            <div className="step">
              <p className="step_counter">
                <span className="step_number">1ο</span> Βήμα
              </p>
              <p className="details">Εισάγετε τα στοιχεία του μαθητή.</p>
              <div className="gif_wrapper">
                <img src={step1} alt="" />
              </div>
            </div>
            <div className="step">
              <p className="step_counter">
                <span className="step_number">2ο</span> Βήμα
              </p>
              <p className="details">
                Προσθέστε το κέιμενο προς έλεγχο και περιμένετε να ολοκληρωθεί η
                διαδικασία, ώστε να εντοπιστούν τα λάθη.
              </p>
              <div className="gif_wrapper">
                <img src={step2} alt="" />
              </div>
            </div>
            <div className="step">
              <p className="step_counter">
                <span className="step_number">3ο</span> Βήμα
              </p>
              <p className="details">
                Η διαδικασία έχει ολοκληρωθεί! Στην σελίδα παρουσιάζεται η
                βαθμολογία του κειμένου με τα αντίστοιχα σχόλια ως προς τα λάθη.
                Επιπλέον προσφέρονται διαγράμματα που παρουσιάζουν τα λάθη στο
                χρόνο, σε σύγκριση με τα λάθη του τρέχοντος κειμένου και ένας
                πίνακας που αποθηκέυει συνολικά για όλους τους μαθητές τα
                αποτελέσματά τους.
              </p>
              <div className="images">
                <div className="image_box">
                  <p className="help-title">Βαθμός - Σχόλια</p>
                  <div className="gif_wrapper">
                    <img src={grade_img} alt="" />
                  </div>
                </div>
                <div className="image_box">
                  <p className="help-title">Διαγράμματα</p>
                  <div className="imges_wrapper">
                    <img className="chart-img" src={charts} alt="" />
                  </div>
                </div>
                <div className="image_box">
                  <p className="help-title">Πίνακας Δεδομένων</p>
                  <div className="gif_wrapper">
                    <img className="chart-img" src={table} alt="" />
                  </div>
                </div>
              </div>
            </div>
            <div className="step">
              <p className="step_counter">
                <span className="step_number">4ο</span> Βήμα
              </p>
              <p className="details">
                H εφαρμογή προσφέρει την εξαγωγή των δεδομένων που εμφανίζονται
                στον πίνακα σε αρχείο csv καθώς και την διαγραφή όλων των
                δεδομένων που έχουν αποθηκευτεί στην σελίδα.
              </p>
              <div className="image_box">
                <div className="gif_wrapper">
                  <img src={deleteimg} alt="" />
                </div>
              </div>
              <div className="image_box">
                <div className="gif_wrapper">
                  <img src={exportimg} alt="" />
                </div>
              </div>
            </div>
            <div className="step">
              <p className="step_counter">
                <span className="step_number_icon">
                  <i class="fas fa-plus"> </i>
                </span>{" "}
                Επιπλέον λειτουργίες
              </p>
              <p className="details">
                Σε περίπτωση που βαθμός που υπολογίζεται από την εφαρμογή δεν
                είναι ικανοποιητικός, έχετε την δυνατότητα πατώντας το κουμπί
                dislike, να εισάγετε την δική σας βαθμολογία και να δώσετε
                βαρύτητα σε μια από τις 3
                παραμέτρους(ορθογραφικά-γραμματικά-λάθη στίξης) ώστε να
                βελτιωθεί ο τρόπος βαθμολόγησης.
              </p>
              <div className="image_box">
                <div className="gif_wrapper">
                  <img src={dislike} alt="" />
                </div>
              </div>
              <div className="image_box">
                <div className="gif_wrapper">
                  <img src={newgrade} alt="" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="steps">
            <div className="step">
              <p className="step_counter">
                <span className="step_number">1ο</span> Βήμα
              </p>
              <p className="details">
                Προσθέστε το κέιμενο προς έλεγχο και περιμένετε να ολοκληρωθεί η
                διαδικασία, ώστε να εντοπιστούν τα λάθη.
              </p>
              <div className="gif_wrapper">
                <img src={step2} alt="" />
              </div>
            </div>
            <div className="step">
              <p className="step_counter">
                <span className="step_number">2ο</span> Βήμα
              </p>
              <p className="details">
                Η διαδικασία έχει ολοκληρωθεί! Στην σελίδα παρουσιάζεται η
                βαθμολογία του κειμένου με τα αντίστοιχα σχόλια ως προς τα λάθη.
                Επιπλέον προσφέρονται διαγράμματα που παρουσιάζουν τα λάθη στο
                χρόνο, σε σύγκριση με τα λάθη του τρέχοντος κειμένου.
              </p>
              <div className="images">
                <div className="image_box">
                  <p className="help-title">Βαθμός - Σχόλια</p>
                  <div className="gif_wrapper">
                    <img src={grade_img} alt="" />
                  </div>
                </div>
                <div className="image_box">
                  <p className="help-title">Διαγράμματα</p>
                  <div className="imges_wrapper">
                    <img className="chart-img" src={charts} alt="" />
                  </div>
                </div>
              </div>
            </div>
            <div className="step">
              <p className="step_counter">
                <span className="step_number">3ο</span> Βήμα
              </p>
              <p className="details">
                H εφαρμογή προσφέρει την διαγραφή όλων των δεδομένων που έχουν
                αποθηκευτεί στην σελίδα.
              </p>
              <div className="image_box">
                <div className="gif_wrapper">
                  <img src={deleteimg} alt="" />
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DropDownBtn;
