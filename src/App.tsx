import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Chart from "./components/Chart";

function App() {
  return (
    <div className="App">
      <header className="App-header">Snapshot</header>
      <main>
        <Chart space="jbdao.eth" />
      </main>
    </div>
  );
}

export default App;
