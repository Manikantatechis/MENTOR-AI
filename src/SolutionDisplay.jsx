// SolutionDisplay.js
import React from 'react';

function SolutionDisplay({ solution }) {
  return (
    <div>
      <h2>Solution:</h2>
      <p>{solution || "Submit an error to get a solution."}</p>
    </div>
  );
}

export default SolutionDisplay;
