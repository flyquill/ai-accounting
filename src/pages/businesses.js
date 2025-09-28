import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import MySql from "../components/MySql";

export default function BusinessesPage({ n8nServer }) {

  const userId = Cookies.get("user_id");

  const [businesses, setBusinesses] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
  });

  useEffect(() => {

    let query = `SELECT * FROM businesses WHERE user_id = ${userId}`;
    let data = MySql(n8nServer, query);
    setBusinesses([data]);
    console.log(businesses);

  }, []); // Optional: dependency array

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Please fill in required fields");
      return;
    }

    let query = `INSERT INTO businesses (name, address, user_id) VALUES ('${formData.name}', '${formData.address}', ${userId})`;

    const res = await fetch(
      `${n8nServer}ae1d4436-f226-414f-b0b6-48ad23c7f04c`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query }),
      }
    );

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Server error: ${res.status} ${txt}`);
    }

    const data = await res.json();
    const success = data[0].success ?? false;

    if (success) {
      const newBusiness = {
        id: businesses.length + 1,
        ...formData,
      };
      setBusinesses([...businesses, newBusiness]);
      setFormData({ name: "", type: "", description: "" });
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">My Businesses</h2>

      {/* Add Business Form */}
      <div className="card shadow-lg p-4 mb-5">
        <h4 className="mb-3">Add New Business</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Business Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter business name"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Business Address</label>
            <input
              className="form-control"
              name="address"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter the business address."
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Add Business
          </button>
        </form>
      </div>

      {/* Businesses List */}
      <h4 className="mb-3">My Businesses</h4>
      <div className="row">
        {businesses.map((biz) => (
          <div className="col-md-4 mb-4" key={biz.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{biz.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{biz.type}</h6>
                <p className="card-text">
                  {biz.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>
        ))}
        {businesses.length === 0 && (
          <p className="text-muted text-center">No businesses added yet.</p>
        )}
      </div>
    </div>
  );
}
