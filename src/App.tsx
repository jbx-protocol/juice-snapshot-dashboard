import "./App.css";
import ProposalsChart from "./components/ProposalsChart";

function App() {
  return (
    <div className="App">
      <header>
        <img height={40} src="/assets/logo.png" alt="Juicebox logo" />
      </header>
      <main>
        <div style={{ width: "80%", height: "80%" }}>
          <ProposalsChart
            space="jbdao.eth"
            tokenSymbol="JBX"
            tokenContractAddress="0xee2eBCcB7CDb34a8A822b589F9E8427C24351bfc"
            voteThreshold={15}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
