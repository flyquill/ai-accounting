import React, { useState, useEffect } from "react";
import { useUser } from '@clerk/clerk-react'
import Cookies from "js-cookie";

export default function BusinessesPage({ backendServer }) {

  const { isSignedIn, user } = useUser();

  const userId = isSignedIn ? user.id : null;

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinesses();
  }, [loading]);


  const [formData, setFormData] = useState({
    name: "",
    address: "",
  });

  const fetchBusinesses = async () => {

    const res = await fetch(`${backendServer}/businesses/get.php?user_id=${userId}`);

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Server error: ${res.status} ${txt}`);
    }

    const data = await res.json();
    setBusinesses(data);
    setLoading(false);
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Please fill in required fields");
      return;
    }

    
    const newBusiness = {
      id: businesses.length + 1,
      ...formData,
    };
    setBusinesses([...businesses, newBusiness]);
    setFormData({ name: "", type: "", description: "" });
    
  };

  const changeBusiness = (id, name) => {
    Cookies.set("business_id", id);
    Cookies.set("user_id", userId);
    alert(`Business changed to ${name}`)
  }

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
                <h5 className="card-title" role="button" onClick={() => {changeBusiness(biz.id, biz.name)}}>{biz.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{biz.address}</h6>
                <p className="card-text">
                  {biz.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>
        ))}
        {loading ? <p className="text-center">Loading...</p> :
        businesses.length === 0 && (
          <p className="text-muted text-center">No businesses added yet.</p>
        )}
      </div>
    </div>
  );
}
