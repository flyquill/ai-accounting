import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import Cookies from "js-cookie";
import LoadingSpinner from "../components/LoadingSpinner";

export default function BusinessesPage({ backendServer }) {
  const { isLoaded, user } = useUser();

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBusinessLoading, setNewBusinessLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    fetchBusinesses();
  }, [isLoaded, loading]);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
  });

  const fetchBusinesses = async () => {
    const res = await fetch(
      `${backendServer}/businesses/get/${user.id}`
    );

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Server error: ${res.status} ${txt}`);
    }

    const data = await res.json();
    setBusinesses(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Please fill in required fields");
      return;
    }

    setNewBusinessLoading(true);

    const res = await fetch(`${backendServer}/businesses/new/${user.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        address: formData.address
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Server error: ${res.status} ${txt}`);
    }

    const data = await res.json();

    if (data.success) {
      fetchBusinesses();
      setFormData({ name: "", address: "" });
    }

    setNewBusinessLoading(false);
  };

  const changeBusiness = (id, name) => {
    Cookies.set("business_id", id);
    Cookies.set("business_name", name);
    fetchBusinesses();
    alert(`Business "${name}" has been activated!`);
  };

  const deleteBusiness = async (id, name) => {
    const res = await fetch(
      `${backendServer}/businesses/delete/${user.id}/business/${id}`, 
      { method: 'DELETE' }
    );

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Server error: ${res.status} ${txt}`);
    }

    const data = await res.json();

    if (data.success) {
      fetchBusinesses();
      alert(`Business "${name}" has been deleted!`);
    } else {
      alert(`Error while deleting business "${name}"`);
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
          <button
            type="submit"
            className={`btn btn-${
              newBusinessLoading ? "secondary disabled" : "primary"
            } w-100`}
          >
            {newBusinessLoading ? "Adding the business..." : "Add Business"}
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
                <h6 className="card-subtitle mb-2 text-muted">{biz.address}</h6>
                <p className="card-text">
                  {biz.description || "No description provided."}
                </p>
                {biz.id != Cookies.get("business_id") ? (
                  <>
                    <button
                      className="btn btn-danger mx-2"
                      onClick={() => {
                        deleteBusiness(biz.id, biz.name);
                      }}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-success mx-2"
                      onClick={() => {
                        changeBusiness(biz.id, biz.name);
                      }}
                    >
                      Activate
                    </button>
                  </>
                ) : (
                  <button className="btn btn-primary disabled">
                    Activated
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading ? (
          <LoadingSpinner
            type="clip"
            size={35}
            color="#007bff"
            message="Loading businesses..."
          />
        ) : (
          businesses.length === 0 && (
            <p className="text-muted text-center">No businesses added yet.</p>
          )
        )}
      </div>
    </div>
  );
}
