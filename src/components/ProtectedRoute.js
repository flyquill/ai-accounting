import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const ProtectedRoute = () => {
  const { isLoaded, isSignedIn } = useUser();
  const location = useLocation();
  const LOGIN_PATH = "/logina";

  // While Clerk is initializing, don't redirect — show nothing or a loader
  if (!isLoaded) return null; // or return <div>Loading...</div>

  // If Clerk is loaded and user not signed in, redirect to login.
  // We pass state so we can redirect back after login if wanted.
  if (!isSignedIn) {
    return <Navigate to={LOGIN_PATH} state={{ from: location }} replace />;
  }

  // User is signed in -> render the protected route children
  return <Outlet />;
};

export default ProtectedRoute;
