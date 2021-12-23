import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Chart from "./components/Chart";

function App() {
  return (
    <div className="App">
      <header>Snapshot</header>
      <main>
        <Chart
          space="jbdao.eth"
          tokenSymbol="JBX"
          tokenContractAddress="0x3abF2A4f8452cCC2CF7b4C1e4663147600646f66"
        />
      </main>
    </div>
  );
}

export default App;
