import React from "react";
import "./PrivDiscM.css";

const PrivDiscM = ({ show, handleClose }) => {
  return (
    <div className={`PrivDiscM ${show ? "show" : ""}`} onClick={handleClose}>
      <div className="PrivDiscM-content" onClick={(e) => e.stopPropagation()}>
        <p>
          By providing your email address, you expressly consent to the
          collection and use of your personal information by the VERIFY TMS Quizzes website.
          This may include disclosing your full name, organization details, and
          quiz progress to other users who hold just your email address within
          the VERIFY TMS Quizzes website. We prioritize the protection and
          privacy of your data and will only disclose it for legitimate purposes
          within the VERIFY study. You have the right to withdraw
          your consent or update your preferences at any time.
        </p>
        <button className="priv-close-button" onClick={handleClose}>
          Okay
        </button>
      </div>
    </div>
  );
};

export default PrivDiscM;
