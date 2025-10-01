// src/App.jsx

import { useState, useMemo } from 'react';

// Some initial data to start with
const initialAccounts = [
  { id: 1, name: 'Main Checking', type: 'Checking', balance: 1543.22 },
  { id: 2, name: 'Vacation Savings', type: 'Savings', balance: 8510.50 },
  { id: 3, name: 'Emergency Fund', type: 'Savings', balance: 20000.00 },
  { id: 4, name: 'Primary Credit Card', type: 'Credit', balance: -789.45 },
];

function Accounts() {
  // === STATE MANAGEMENT ===
  // State for the list of all accounts
  const [accounts, setAccounts] = useState(initialAccounts);

  // State for the form inputs
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('Checking');
  const [balance, setBalance] = useState('');

  // State for the search/filter term
  const [searchTerm, setSearchTerm] = useState('');

  // === HANDLERS ===
  /**
   * Handles the form submission to add a new account.
   */
  const handleAddAccount = (e) => {
    e.preventDefault(); // Prevent page reload

    // Basic validation
    if (!accountName || !balance) {
      alert('Please fill in both account name and balance.');
      return;
    }

    const newAccount = {
      id: Date.now(), // Simple unique ID
      name: accountName,
      type: accountType,
      balance: parseFloat(balance), // Convert string input to a number
    };

    // Add the new account to the existing list
    setAccounts([...accounts, newAccount]);

    // Clear the form fields
    setAccountName('');
    setAccountType('Checking');
    setBalance('');
  };

  /**
   * Handles deleting an account by its ID.
   */
  const handleDeleteAccount = (idToDelete) => {
    // Filter out the account with the matching ID
    const updatedAccounts = accounts.filter(account => account.id !== idToDelete);
    setAccounts(updatedAccounts);
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
    return accounts.filter(account =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [accounts, searchTerm]);

  /**
   * Calculates the total balance of the *filtered* accounts.
   */
  const totalBalance = useMemo(() => {
    return filteredAccounts.reduce((total, account) => total + account.balance, 0);
  }, [filteredAccounts]);

  /**
   * Formats a number into a currency string (e.g., $1,234.56).
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
                <label htmlFor="accountName" className="form-label">Account Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="accountName"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g., Vacation Savings"
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="accountType" className="form-label">Account Type</label>
                <select
                  className="form-select"
                  id="accountType"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                >
                  <option>Checking</option>
                  <option>Savings</option>
                  <option>Credit</option>
                  <option>Investment</option>
                </select>
              </div>
              <div className="col-md-2">
                <label htmlFor="balance" className="form-label">Balance</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  id="balance"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
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
                  <th scope="col">Type</th>
                  <th scope="col" className="text-end">Balance</th>
                  <th scope="col" className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.length > 0 ? (
                  filteredAccounts.map(account => (
                    <tr key={account.id}>
                      <td>{account.name}</td>
                      <td>
                        <span className={`badge bg-${account.type === 'Credit' ? 'warning' : 'info'}`}>
                          {account.type}
                        </span>
                      </td>
                      <td className={`text-end ${account.balance < 0 ? 'text-danger' : ''}`}>
                        {formatCurrency(account.balance)}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteAccount(account.id)}
                          title="Delete Account"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">No accounts found.</td>
                  </tr>
                )}
              </tbody>
              {/* Table Footer with Summary */}
              <tfoot>
                <tr className="table-light fw-bold">
                  <td colSpan="2">Total Balance</td>
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

export default Accounts