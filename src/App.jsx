import "./App.css";
import Main from "./Components/Main";
import Info from "./Components/Info";

function App() {
  return (
    <div className="App">
      <div className="heading-container">
      </div>
      <div className="main-content">
        {/* Wrapper for Info and Main */}
        <div className="model-container relative">
        <Info className="info-cont" />
          <Main />
           {/* Ensuring Info is on top */}
        </div>
      </div>
    </div>
  );
}

export default App;
