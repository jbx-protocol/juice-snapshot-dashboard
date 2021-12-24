import "./App.css";
import Proposals from "./components/Proposals";
import logo from "./assets/logo.png";

function App() {
  return (
    <div className="App">
      <header>
        <a href="https://juicebox.money" rel="noopener noreferrer">
          <img height={40} src={logo} alt="Juicebox logo" />
        </a>
      </header>
      <main>
        <h1>JuiceboxDAO active proposals</h1>

        <Proposals
          space="jbdao.eth"
          tokenSymbol="JBX"
          tokenContractAddress="0xee2eBCcB7CDb34a8A822b589F9E8427C24351bfc"
          voteThreshold={8}
          tokenVoteThresholdPercent={0.66}
        />
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
