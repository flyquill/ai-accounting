// src/SaleInvoiceForm.jsx

import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

function SaleInvoiceForm() {
  // --- STATE MANAGEMENT ---

  const [master, setMaster] = useState({
    invoiceNumber: `INV-${Date.now()}`,
    invoiceDate: new Date().toISOString().slice(0, 10),
    customerName: '',
    customerAddress: '',
  });

  // **CHANGE 1: Added `discount: 0` to the default detail state**
  const [details, setDetails] = useState([
    { id: 1, productName: '', quantity: 1, price: 0, discount: 0 },
  ]);

  const [nextId, setNextId] = useState(2);
  const [grandTotal, setGrandTotal] = useState(0);

  // --- HANDLER FUNCTIONS ---

  const handleMasterChange = (e) => {
    const { name, value } = e.target;
    setMaster(prevMaster => ({
      ...prevMaster,
      [name]: value,
    }));
  };

  const handleDetailChange = (id, e) => {
    const { name, value } = e.target;
    setDetails(prevDetails =>
      prevDetails.map(item =>
        item.id === id ? { ...item, [name]: value } : item
      )
    );
  };

  // **CHANGE 2: Added `discount: 0` to new rows**
  const addRow = () => {
    setDetails([
      ...details,
      { id: nextId, productName: '', quantity: 1, price: 0, discount: 0 },
    ]);
    setNextId(nextId + 1);
  };

  const removeRow = (id) => {
    if (details.length <= 1) {
      alert("You cannot delete the last row.");
      return;
    }
    setDetails(details.filter(item => item.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const invoiceData = {
      master,
      // **CHANGE 3: Improved final data object to include calculated values**
      details: details.map(d => {
        const subtotal = d.quantity * d.price;
        const discountAmount = subtotal * (d.discount / 100);
        const total = subtotal - discountAmount;
        return { ...d, subtotal, discountAmount, total };
      }),
      grandTotal,
    };
    console.log('--- INVOICE DATA ---');
    console.log(JSON.stringify(invoiceData, null, 2));
    alert('Invoice data has been logged to the console!');
  };

  // --- CALCULATIONS using useEffect ---
  // **CHANGE 4: Updated total calculation to include discount**
  useEffect(() => {
    const total = details.reduce((sum, item) => {
      const subtotal = Number(item.quantity) * Number(item.price);
      const discountAmount = subtotal * (Number(item.discount) / 100);
      const itemTotal = subtotal - discountAmount;
      return sum + itemTotal;
    }, 0);
    setGrandTotal(total);
  }, [details]);


  // --- JSX RENDER ---

  return (
    <div className="container mt-4 mb-5">
      <h1 className="mb-4 text-center">Sale Invoice</h1>
      <form onSubmit={handleSubmit}>

        {/* --- MASTER BLOCK --- */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Master Information</h4>
          </div>
          <div className="card-body">
            <div className="row">
              {/* ... (Master block JSX is unchanged) ... */}
              <div className="col-md-6 mb-3">
                <label htmlFor="invoiceNumber" className="form-label">Invoice #</label>
                <input
                  type="text"
                  className="form-control"
                  id="invoiceNumber"
                  name="invoiceNumber"
                  value={master.invoiceNumber}
                  onChange={handleMasterChange}
                  readOnly
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="invoiceDate" className="form-label">Invoice Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="invoiceDate"
                  name="invoiceDate"
                  value={master.invoiceDate}
                  onChange={handleMasterChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="customerName" className="form-label">Customer Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="customerName"
                  name="customerName"
                  value={master.customerName}
                  onChange={handleMasterChange}
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="customerAddress" className="form-label">Customer Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="customerAddress"
                  name="customerAddress"
                  value={master.customerAddress}
                  onChange={handleMasterChange}
                  placeholder="Enter customer address"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- DETAILS BLOCK --- */}
        <div className="card shadow-sm">
          <div className="card-header bg-secondary text-white">
            <h4 className="mb-0">Invoice Details</h4>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    {/* **CHANGE 5: Added Discount column header and adjusted widths** */}
                    <th scope="col" style={{ width: '35%' }}>Product Name</th>
                    <th scope="col" style={{ width: '10%' }}>Quantity</th>
                    <th scope="col" style={{ width: '15%' }}>Price</th>
                    <th scope="col" style={{ width: '10%' }}>Discount (%)</th>
                    <th scope="col" style={{ width: '20%' }}>Total</th>
                    <th scope="col" style={{ width: '10%' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((item) => {
                    // **CHANGE 6: Updated line total calculation**
                    const subtotal = item.quantity * item.price;
                    const discountAmount = subtotal * (item.discount / 100);
                    const lineTotal = subtotal - discountAmount;
                    
                    return (
                      <tr key={item.id}>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name="productName"
                            value={item.productName}
                            onChange={(e) => handleDetailChange(item.id, e)}
                            placeholder="Product description"
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            name="quantity"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleDetailChange(item.id, e)}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            name="price"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => handleDetailChange(item.id, e)}
                            required
                          />
                        </td>
                        {/* **CHANGE 7: Added discount input field** */}
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            name="discount"
                            min="0"
                            max="100"
                            step="1"
                            value={item.discount}
                            onChange={(e) => handleDetailChange(item.id, e)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={`$${lineTotal.toFixed(2)}`}
                            readOnly
                          />
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => removeRow(item.id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={addRow}
            >
              <FaPlus /> Add Row
            </button>
          </div>
          <div className="card-footer">
            <div className="d-flex justify-content-end">
              <h4 className="me-3">Grand Total:</h4>
              <h4 className="fw-bold">${grandTotal.toFixed(2)}</h4>
            </div>
          </div>
        </div>

        {/* --- FORM ACTIONS --- */}
        <div className="mt-4 text-center">
          <button type="submit" className="btn btn-success btn-lg px-5">
            Save Invoice
          </button>
        </div>
      </form>
    </div>
  );
}

export default SaleInvoiceForm;