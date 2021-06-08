import React, { useState, useEffect } from "react";

const FeedBack = ({
  orthStats,
  gramStats,
  stiStats,
  mistakes,
  role,
  user,
  setFeedBackOrth,
  setFeedBackGram,
  setFeedBackSti,
  grade,
  orthRate,
  gramRate,
  stiRate,
  countOrth,
  countGram,
  countSti,
}) => {
  const feedback = [
    {
      orth: [
        {
          bad:
            "Έκανες πολλά ορθογραφικά λάθη. Χρησιμοποίησε τις προτεινόμενες λέξεις για να τα πας καλύτερα την επόμενη φορά!",
          good:
            "Μπορείς να τα πας και καλύτερα! Τα ορθογραφικά σου λάθη είναι αρκετά.",
          veryGood:
            "Μπράβο τα πήγες πολύ καλά! Τα ορθογραφικά σου λάθη είναι ελάχιστα.",
          best: "Τέλεια! Τα πήγες περίφημα!",
        },
      ],
      gram: [
        {
          bad:
            "Τα γραμματικά σου λάθη είναι αρκετά! Έλεγξε ξανά το κέιμενο σου και ακολούθησε τις προτεινόμενες διορθώσεις για να βελτιωθείς!",
          good:
            "Η γραμματική σου χρειάζεται βελτίωση! Προσπάθησε να είσαι πιο προσεκτικός.",
          veryGood:
            "Δεν τα πήγες και άσχημα! Τα γραμματικά σου λάθη είναι ελάχιστα.",
          best: "Εξαιρετικά! Η γραμματική του κείμενου είναι άρτια!",
        },
      ],
      sti: [
        {
          bad:
            "Το κείμενο έιναι δυσνόητο! Υπάρχουν πολλά λάθη στα σημέια στίξης.",
          good: "Προσοχή στα σημεία στίξης! Μπορείς να τα πας και καλύτερα!",
          veryGood:
            "Τα λάθη στα σημεία στίξης έιναι ελάχιστα, τα πήγες πολύ καλά!",
          best: "Το νοήμα του κείμενου έιναι κατανοητό! Μπράβο!",
        },
      ],
    },
  ];

  const feedbackMessage = [
    {
      orth: [
        {
          comment: `Τα ορθογραφικά σας λάθη αποτελούν το ${orthRate}% των λέξεων.`,
          correct: `Δεν υπάρχουν ορθογραφικά λάθη!`,
        },
      ],
      gram: [
        {
          comment: `Τα γραμματικά σας λάθη αποτελούν το ${gramRate}% των λέξεων.`,
          correct: `Δεν υπάρχουν γραμματικά λάθη!`,
        },
      ],
      sti: [
        {
          comment: `Τα λάθη στίξης, αποτελούν το ${stiRate}% των λέξεων.`,
          correct: `Δεν υπάρχουν λάθη στίξης!`,
        },
      ],
    },
  ];

  const pickFeedback = (orthStats, gramStats, stiStats) => {
    console.log("ORTH", orthStats);
    console.log("ORTH", gramStats);
    console.log("ORTH", stiStats);
    /*if (orthStats > 0.95) {
      let message = feedback[0].orth[0].best;
      setFeedBackOrth(message);
    } else if (orthStats > 0.5 && orthStats <= 0.95) {
      let message = feedback[0].orth[0].veryGood;
      setFeedBackOrth(message);
    } else if (orthStats > 0.25 && orthStats <= 0.5) {
      let message = feedback[0].orth[0].good;
      setFeedBackOrth(message);
    } else if (orthStats > 0 && orthStats <= 0.25) {
      let message = feedback[0].orth[0].bad;
      setFeedBackOrth(message);
    }

    if (gramStats > 0.95) {
      let message = feedback[0].gram[0].best;
      setFeedBackGram(message);
    } else if (gramStats > 0.5 && gramStats <= 0.95) {
      let message = feedback[0].gram[0].veryGood;
      setFeedBackGram(message);
    } else if (gramStats > 0.25 && gramStats <= 0.5) {
      let message = feedback[0].gram[0].good;
      setFeedBackGram(message);
    } else if (gramStats > 0 && gramStats <= 0.25) {
      let message = feedback[0].gram[0].bad;
      setFeedBackGram(message);
    }

    if (stiStats > 0.95) {
      let message = feedback[0].sti[0].best;
      setFeedBackSti(message);
    } else if (stiStats > 0.5 && stiStats <= 0.95) {
      let message = feedback[0].sti[0].veryGood;
      setFeedBackSti(message);
    } else if (stiStats > 0.25 && stiStats <= 0.5) {
      let message = feedback[0].sti[0].good;
      setFeedBackSti(message);
    } else if (stiStats > 0 && stiStats <= 0.25) {
      let message = feedback[0].sti[0].bad;
      setFeedBackSti(message);
    }*/

    if (orthStats === 0) {
      setFeedBackOrth(feedbackMessage[0].orth[0].correct);
    } else {
      setFeedBackOrth(feedbackMessage[0].orth[0].comment);
    }

    if (gramStats === 0) {
      setFeedBackGram(feedbackMessage[0].gram[0].correct);
    } else {
      setFeedBackGram(feedbackMessage[0].gram[0].comment);
    }
    if (stiStats === 0) {
      setFeedBackSti(feedbackMessage[0].sti[0].correct);
    } else {
      setFeedBackSti(feedbackMessage[0].sti[0].comment);
    }
  };

  useEffect(() => {
    if (role && user) {
      pickFeedback(orthStats, gramStats, stiStats);
    }
  }, [mistakes, grade]);

  return <div></div>;
};

export default FeedBack;
