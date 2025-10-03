// src/App.jsx

import { useState, useMemo, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import Cookies from "js-cookie";
import LoadingSpinner from "../components/LoadingSpinner";

function Accounts({ backendServer }) {
  const { isLoaded, user } = useUser();

  // === STATE MANAGEMENT ===
  // State for the list of all accounts
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for the form inputs
  const [accountName, setAccountName] = useState("");
  const [accountAddress, setAccountAddress] = useState("");
  const [accountPhone, setAccountPhone] = useState("");
  const [accountType, setAccountType] = useState("Checking");
  const [openingBalance, setOpeningBalance] = useState(0);

  // State for the search/filter term
  const [searchTerm, setSearchTerm] = useState("");

  const businessId = Cookies.get("business_id");

  useEffect(() => {
    if (!isLoaded) return;
    fetchAccounts();
  }, [isLoaded, loading]);

  // === HANDLERS ===
  /**
   * Handles the form submission to add a new account.
   */
  const handleAddAccount = async (e) => {

    
    e.preventDefault(); // Prevent page reload
    
    // Basic validation
    if (!accountName) {
      alert("Please fill in account name.");
      return;
    }
    
    setLoading(true);

    const res = await fetch(`${backendServer}/accounts/new/${user.id}/business/${businessId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: accountName,
        address: accountAddress,
        phone: accountPhone,
        type: accountType,
        openingBalance: parseFloat(openingBalance)
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Server error: ${res.status} ${txt}`);
    }

    const data = await res.json();

    if (data.success) {
      fetchBusinesses();
    }

    fetchAccounts();

    // Clear the form fields
    setAccountName("");
    setAccountAddress("");
    setAccountPhone("");
    setAccountType("CUSTOMER");
    setOpeningBalance(0);

    setLoading(false);
  };

  /**
   * Handles deleting an account by its ID.
   */
  const handleDeleteAccount = (idToDelete) => {
    // Filter out the account with the matching ID
    const updatedAccounts = accounts.filter(
      (account) => account.id !== idToDelete
    );
    setAccounts(updatedAccounts);
  };

  const fetchAccounts = async () => {

    const res = await fetch(
      `${backendServer}/accounts/get/${user.id}/business/${businessId}`
    );

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Server error: ${res.status} ${txt}`);
    }

    const data = await res.json();
    setAccounts(data);
    setLoading(false);
  };

  // === DERIVED STATE & MEMOIZATION ===
  /**
   * Filters the accounts based on the searchTerm.
   * `useMemo` ensures this calculation only re-runs when accounts or searchTerm change.
   */
  const filteredAccounts = useMemo(() => {
    if (!searchTerm) {
      return accounts; // If no search term, return all accounts
    }
    return accounts.filter(
      (account) =>
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [accounts, searchTerm]);

  /**
   * Calculates the total balance of the *filtered* accounts.
   */
  const totalBalance = useMemo(() => {
    return filteredAccounts.reduce(
      (total, account) => total + account.openingBalance,
      0
    );
  }, [filteredAccounts]);

  /**
   * Formats a number into a currency string (e.g., $1,234.56).
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PKR",
    }).format(amount);
  };

  return (
    <div className="container mt-5">
      <header className="mb-4">
        <h1 className="display-5">Accounts Dashboard</h1>
        <p className="lead">Manage your personal and business accounts.</p>
      </header>

      {/* Section 1: Add New Account Form */}
      <div className="card shadow-sm mb-5">
        <div className="card-body">
          <h2 className="card-title h4 mb-3">Add New Account</h2>
          <form onSubmit={handleAddAccount}>
            <div className="row g-3">
              <div className="col-md-5">
                <label htmlFor="accountName" className="form-label">
                  Account Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="accountName"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g., MUHAMMAD USMAN"
                  required
                />
              </div>
              <div className="col-md-5">
                <label htmlFor="accountName" className="form-label">
                  Account Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="accountName"
                  value={accountAddress}
                  onChange={(e) => setAccountAddress(e.target.value)}
                  placeholder="e.g., MULTAN, PAKISTAN"
                  required
                />
              </div>
              <div className="col-md-5">
                <label htmlFor="accountName" className="form-label">
                  Account Phone
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="accountName"
                  value={accountPhone}
                  onChange={(e) => setAccountPhone(e.target.value)}
                  placeholder="e.g., 0300-0000000"
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="accountType" className="form-label">
                  Account Type
                </label>
                <select
                  className="form-select"
                  id="accountType"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                >
                  <option>CUSTOMER</option>
                  <option>SUPPLIER</option>
                  <option>EXPENSE</option>
                  <option>ASSET</option>
                </select>
              </div>
              <div className="col-md-2">
                <label htmlFor="openingBalance" className="form-label">
                  Opening Balance
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  id="openingBalance"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button type="submit" className="btn btn-primary w-100">
                  <i className="bi bi-plus-circle-fill me-2"></i>Add
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Section 2: Interactive Accounts Report */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title h4 mb-3">Accounts Report</h2>

          {/* Filter Input */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Accounts Table */}
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">Account Name</th>
                  <th scope="col">Account Address</th>
                  <th scope="col">Account Phone</th>
                  <th scope="col">Type</th>
                  <th scope="col" className="text-end">
                    Balance
                  </th>
                  <th scope="col" className="text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.length > 0 ? (
                  filteredAccounts.map((account) => (
                    <tr key={account.id}>
                      <td>{account.name}</td>
                      <td>{account.address}</td>
                      <td>{account.phone}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            account.type === "Credit" ? "warning" : "info"
                          }`}
                        >
                          {account.type}
                        </span>
                      </td>
                      <td
                        className={`text-end ${
                          account.openingBalance < 0 ? "text-danger" : ""
                        }`}
                      >
                        {formatCurrency(account.openingBalance)}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteAccount(account.id)}
                          title="Delete Account"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : loading ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      <LoadingSpinner
                        type="clip"
                        size={35}
                        color="#007bff"
                        message="Loading accounts..."
                      />
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
              {/* Table Footer with Summary */}
              <tfoot>
                <tr className="table-light fw-bold">
                  <td colSpan="4">Total Balance</td>
                  <td className="text-end">{formatCurrency(totalBalance)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accounts;
