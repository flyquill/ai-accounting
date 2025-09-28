import React, { useState } from "react";
import '../css/Sidebar.css'
import { Link } from "react-router-dom";

export default function Sidebar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="d-lg-none d-flex bg-transparent align-items-center p-2 border-bottom bg-white shadow-sm" id="sideBar">
                <button className="btn btn-primary" onClick={() => setOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                    </svg>
                </button>
            </div>

            {/* Sidebar */}
            <div className={`custom-sidebar ${open ? "open" : ""}`}>
                {/* Sidebar Header */}
                <div className="sidebar-header d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h5 className="m-0 fw-bold text-primary">Menu</h5>
                    <button
                        className="btn-close d-lg-none"
                        onClick={() => setOpen(false)}
                    ></button>
                </div>

                {/* Sidebar Links */}
                <ul className="list-unstyled p-3">
                    <li>
                        <Link to="/" className="sidebar-link">
                            <i className="bi bi-speedometer2 me-2"></i> Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/chat" className="sidebar-link">
                            <i className="bi bi-people me-2"></i> Assistant
                        </Link>
                    </li>
                    <li>
                        <a href="#ledger" className="sidebar-link">
                            <i className="bi bi-journal-text me-2"></i> Ledger
                        </a>
                    </li>
                    <li>
                        <Link to="/businesses" className="sidebar-link">
                            <i className="bi bi-gear me-2"></i> Businesses
                        </Link>
                    </li>
                    <li>
                        <a href="#settings" className="sidebar-link">
                            <i className="bi bi-gear me-2"></i> Settings
                        </a>
                    </li>
                </ul>
            </div>

            {/* Overlay for Mobile */}
            {open && <div className="custom-overlay d-lg-none" onClick={() => setOpen(false)} />}
        </>
    );
}
