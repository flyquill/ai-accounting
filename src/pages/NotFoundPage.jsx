// src/pages/NotFoundPage.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/NotFoundPage.css'; // We'll create this CSS file for custom styles

const NotFoundPage = () => {
  const navigate = useNavigate();

  // Function to navigate back to the previous page in history
  const handleGoBack = () => {
    navigate(-1); // -1 tells the router to go back one step
  };

  return (
    <div className="not-found-container d-flex align-items-center justify-content-center text-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-body p-5">
                {/* SVG Illustration */}
                <div className="mb-4">
                  <svg 
                    className="not-found-svg" 
                    viewBox="0 0 500 300" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <text x="50%" y="45%" dominantBaseline="middle" textAnchor="middle" 
                          className="svg-text-404">
                      404
                    </text>
                    <g transform="translate(100, 200)">
                      <path d="M-30,-15 L30,-15 L0,30 Z" className="svg-magnifying-glass-triangle" />
                      <circle cx="-40" cy="-40" r="25" className="svg-magnifying-glass-circle" />
                      <line x1="-58" y1="-58" x2="-75" y2="-75" className="svg-magnifying-glass-handle" />
                    </g>
                  </svg>
                </div>
                
                <h1 className="display-4 fw-bold text-primary">Page Not Found</h1>
                <p className="lead text-muted mt-3">
                  Oops! The page you are looking for doesn't exist. It might have been moved or deleted.
                </p>
                <div className="mt-4 d-flex justify-content-center gap-3">
                  <Link to="/dashboard" className="btn btn-primary btn-lg">
                    <i className="bi bi-house-door-fill me-2"></i>
                    Go to Dashboard
                  </Link>
                  <button onClick={handleGoBack} className="btn btn-outline-secondary btn-lg">
                    <i className="bi bi-arrow-left me-2"></i>
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;