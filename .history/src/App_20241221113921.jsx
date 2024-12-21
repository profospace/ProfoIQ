import React from "react";
import ButtonComponent from "./ButtonComponent";

function App() {
  let squares = [];
  for (let i = 0; i < 512; i++) {
    squares.push(<div key={i}></div>);
  }
  return (
    <div className="app">
      {/* <div className="container">{squares}</div>
      <button>Start</button> */}
    </div>
  );
}

export default App;
