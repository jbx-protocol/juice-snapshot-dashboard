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
        <Proposals
          name="JuiceboxDAO"
          space="jbdao.eth"
          tokenSymbol="JBX"
          tokenContractAddress="0xee2eBCcB7CDb34a8A822b589F9E8427C24351bfc"
          juiceboxLink="https://juicebox.money/#/p/juicebox"
          governanceProcessLink="https://info.juicebox.money/docs/resources/juicebox-dao/governance-process"
          tokenVoteThresholdPercent={0.66}
          quorum={80000000}
        />
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
