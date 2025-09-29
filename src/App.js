import logo from "./logo.svg";
import "./App.css";
import ChatUI from "./components/ChatUI";
import Sidebar from "./components/Sidebar";
import BusinessesPage from "./pages/businesses";
import Login from "./pages/Login";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ClerkProvider } from '@clerk/clerk-react'


function App() {
  const n8nServer = process.env.REACT_APP_N8N_WEB_SERVER;
  const backendServer = process.env.REACT_APP_BACKEND_SERVER;
  // Import your Publishable Key
  const PUBLISHABLE_KEY = process.env.REACT_APP_VITE_CLERK_PUBLISHABLE_KEY;

  if (!PUBLISHABLE_KEY) {
    throw new Error('Add your Clerk Publishable Key to the .env file')
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Router>
        <div className="d-flex">
          <Sidebar />
          <Routes>
            <Route path="/chat" element={<ChatUI n8nServer={n8nServer} backendServer={backendServer} />} />
            <Route path="/businesses" element={<BusinessesPage backendServer={backendServer} />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App;
