import React from "react";
import "./LoadingDot.css"; // Create a corresponding CSS file

const LoadingDot = ({ delay }) => {
  return (
    <div className="loading-dot" style={{ animationDelay: `${delay}s` }}></div>
  );
};

export default LoadingDot;
