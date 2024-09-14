import "./App.css";
import Main from "./Components/Main";
import GardenHeading from "./Components/GardenHeading";

function App() {
  return (
    <div className="App">
      <div className="heading-container">
        <GardenHeading className="garden-heading" />
      </div>
      <div className="main-content">
        <Main />
      </div>
    </div>
  );
}

export default App;
