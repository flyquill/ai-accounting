import logo from "./logo.svg";
import "./App.css";
import ChatUI from "./components/ChatUI";
import Sidebar from "./components/Sidebar";
import BusinessesPage from "./pages/businesses";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  const n8nServer = process.env.REACT_APP_N8N_WEB_SERVER;

  return (
    <Router>
      <div className="d-flex">
      <Sidebar />
      <Routes>
        <Route path="/chat" element={<ChatUI n8nServer={n8nServer} />} />
        <Route path="/businesses" element={<BusinessesPage n8nServer={n8nServer} />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
