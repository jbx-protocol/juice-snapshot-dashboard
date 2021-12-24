import "./App.css";
import ProposalsChart from "./components/ProposalsChart";
import logo from "./assets/logo.png"; // Tell webpack this JS file uses this image

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
        <div style={{ width: "80%", height: "80%", margin: "0 auto" }}>
          <ProposalsChart
            space="jbdao.eth"
            tokenSymbol="JBX"
            tokenContractAddress="0xee2eBCcB7CDb34a8A822b589F9E8427C24351bfc"
            voteThreshold={15}
          />
        </div>
      </main>
      <footer>
        <a href="https://snapshot.org/#/jbdao.eth">Snapshot</a>
      </footer>
    </div>
  );
}

export default App;
