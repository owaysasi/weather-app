import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="loader">
      <div className="spinner"></div>
      <p>Loading weather...</p>
    </div>
  );
};

export default Loader;
