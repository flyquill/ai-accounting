import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatUI from "./components/ChatUI";
import Sidebar from "./components/Sidebar";
import BusinessesPage from "./pages/businesses";
import Login from "./pages/Login";
import LoadingSpinner from "./components/LoadingSpinner";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";

// Component to conditionally render sidebar
function AppLayout({ children }) {
  const { isSignedIn, isLoaded } = useAuth();
  
  // Show full-screen loading spinner while Clerk is determining auth status
  if (!isLoaded) {
    return (
      <LoadingSpinner 
        type="ring"
        size={50}
        color="#007bff"
        message="Initializing application..."
        overlay={true}
      />
    );
  }
  
  return (
    <div className="d-flex">
      {isSignedIn && <Sidebar />}
      <div className="flex-grow-1">
        {children}
      </div>
    </div>
  );
}

function App() {
  const n8nServer = import.meta.env.VITE_N8N_WEB_SERVER;
  const backendServer = import.meta.env.VITE_BACKEND_SERVER;
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!PUBLISHABLE_KEY) {
    throw new Error("Add your Clerk Publishable Key to the .env file");
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route
                path="/chat"
                element={
                  <ChatUI n8nServer={n8nServer} backendServer={backendServer} />
                }
              />
              <Route
                path="/businesses"
                element={<BusinessesPage backendServer={backendServer} />}
              />
            </Route>

            <Route 
              path="*" 
              element={
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '400px',
                  flexDirection: 'column',
                  gap: '20px'
                }}>
                  <h2>404 - Page Not Found</h2>
                  <p>The page you're looking for doesn't exist.</p>
                </div>
              } 
            />
          </Routes>
        </AppLayout>
      </Router>
    </ClerkProvider>
  );
}

export default App;