import React from "react";

const AlertMessage = () => {
  return (
    <div id="alert_wrapper">
      <div id="alert-cont">
        <i class="fas fa-exclamation-circle"></i>
        <div id="countdown">
          <p>Παρακαλώ εισάγετε όνομα μαθητή και τμήμα!</p>
        </div>
      </div>
    </div>
  );
};

export default AlertMessage;
