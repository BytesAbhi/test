import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./Pages/Home";
import Admin from "./Pages/Admin";
import NavBar from "./Components/NavBar";

function App() {
  return (
    <div id="mainDiv">
      <NavBar />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />   } /> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;
