import React from "react";
import { ClipLoader, BeatLoader, RingLoader } from "react-spinners";

const LoadingSpinner = ({ 
  type = "clip",
  size = 35, 
  color = "#3498db", 
  message = "Loading...",
  overlay = false 
}) => {
  const getSpinner = () => {
    switch (type) {
      case "clip":
        return <ClipLoader color={color} size={size} />;
      case "beat":
        return <BeatLoader color={color} size={size} />;
      case "ring":
        return <RingLoader color={color} size={size} />;
      default:
        return <ClipLoader color={color} size={size} />;
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    ...(overlay ? {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      zIndex: 9999
    } : {
      minHeight: '200px',
      padding: '20px'
    })
  };

  const messageStyle = {
    margin: 0,
    color: '#666',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center'
  };

  return (
    <div style={containerStyle}>
      {getSpinner()}
      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
};

export default LoadingSpinner;