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
          tokenContractAddress="0xee2eBCcB7CDb34a8A822b589F9E8427C24351bfc"
        />
      </main>
    </div>
  );
}

export default App;
