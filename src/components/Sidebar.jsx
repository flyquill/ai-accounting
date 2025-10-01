// src/components/Sidebar.js

import React, { useState, useEffect } from "react"; // <-- Import useEffect
import '../css/Sidebar.css'
// v-- Import NavLink and useLocation
import { NavLink, Navigate, useLocation } from "react-router-dom"; 
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';

export default function Sidebar() {
    // State for the main mobile sidebar
    const [open, setOpen] = useState(false);
    
    // State for the "Transactions" dropdown
    const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);

    const { isSignedIn } = useUser();
    const location = useLocation(); // <-- Get the current location object

    // This effect ensures the dropdown is open if the current path is a transaction link
    useEffect(() => {
        // List of all paths that fall under the "Transactions" dropdown
        const transactionPaths = ['/sale-invoice', '/purchase-invoice']; 
        
        // If the current browser path is in our list, open the dropdown
        if (transactionPaths.includes(location.pathname)) {
            setIsTransactionsOpen(true);
        }
    }, [location.pathname]); // <-- Re-run this effect whenever the path changes

    if (!isSignedIn) {
        return <Navigate to="/login" replace />;
    }

    const toggleTransactionsDropdown = (e) => {
        e.preventDefault();
        setIsTransactionsOpen(!isTransactionsOpen);
    };

    return (
        <>
            {/* ... (Mobile Top Bar code remains the same) ... */}
            <div className="d-lg-none d-flex bg-transparent align-items-center p-2 border-bottom bg-white shadow-sm" id="sideBar">
                <button className="btn btn-primary" onClick={() => setOpen(true)}>
                    <i className="bi bi-list"></i>
                </button>
            </div>

            <div className={`custom-sidebar ${open ? "open" : ""}`}>
                {/* ... (Sidebar Header code remains the same) ... */}
                <div className="sidebar-header d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h5 className="m-0 fw-bold text-primary">Menu</h5>
                    <SignedIn><UserButton /></SignedIn>
                    <button className="btn-close d-lg-none" onClick={() => setOpen(false)}></button>
                </div>

                <SignedIn>
                    <ul className="list-unstyled p-3">
                        {/* --- USE NavLink INSTEAD OF Link --- */}
                        <li>
                            {/* NavLink will automatically get an 'active' class when the path matches */}
                            <NavLink to="/dashboard" className="sidebar-link">
                                <i className="bi bi-speedometer2 me-2"></i> Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/chat" className="sidebar-link">
                                <i className="bi bi-chat-dots me-2"></i> Assistant
                            </NavLink>
                        </li>                        
                        <li>
                            <NavLink to="/accounts" className="sidebar-link">
                                <i className="bi bi-wallet2 me-2"></i> Accounts
                            </NavLink>
                        </li>

                        {/* --- TRANSACTIONS DROPDOWN --- */}
                        <li className="sidebar-item">
                            <a 
                                href="#" 
                                className="sidebar-link d-flex justify-content-between align-items-center" 
                                onClick={toggleTransactionsDropdown}
                            >
                                <span><i className="bi bi-receipt me-2"></i> Transactions</span>
                                <i className={`bi bi-chevron-down transition-transform ${isTransactionsOpen ? 'rotate-180' : ''}`}></i>
                            </a>
                            
                            <div className={`collapse ${isTransactionsOpen ? 'show' : ''}`}>
                                <ul className="list-unstyled ps-4">
                                    <li>
                                        {/* Use NavLink here as well for the sub-link */}
                                        <NavLink to="/purchase-invoice" className="sidebar-link sub-link">
                                            <i className="bi bi-journal-text me-2"></i> Purchase Invoice
                                        </NavLink>
                                    </li>                                    
                                    <li>
                                        {/* Use NavLink here as well for the sub-link */}
                                        <NavLink to="/sale-invoice" className="sidebar-link sub-link">
                                            <i className="bi bi-journal-text me-2"></i> Sale Invoice
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li>
                            <NavLink to="/businesses" className="sidebar-link">
                                <i className="bi bi-building me-2"></i> Businesses
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/settings" className="sidebar-link">
                                <i className="bi bi-gear me-2"></i> Settings
                            </NavLink>
                        </li>
                    </ul>
                </SignedIn>
                
                {/* ... (SignedOut and Overlay code remains the same) ... */}
                <SignedOut>
                    <div className="container my-2">Please sign in to view all the pages</div>
                </SignedOut>
            </div>

            {open && <div className="custom-overlay d-lg-none" onClick={() => setOpen(false)} />}
        </>
    );
}