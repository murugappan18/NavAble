import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/admindashboard.css";

function AdminDashboard() {
  const [pendingPlaces, setPendingPlaces] = useState([]);
  const [rejectedPlaces, setRejectedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const [pendingRes, rejectedRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BASE_URL}/places/pending`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_BASE_URL}/places/rejected`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setPendingPlaces(pendingRes.data);
        setRejectedPlaces(rejectedRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const approvePlace = (id) => {
    axios
      .put(
        `${process.env.REACT_APP_BASE_URL}/places/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setPendingPlaces((prev) => prev.filter((place) => place._id !== id));
      })
      .catch((error) => console.error(error));
  };

  const rejectPlace = (id) => {
    axios
      .put(
        `${process.env.REACT_APP_BASE_URL}/places/${id}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setPendingPlaces((prev) => prev.filter((place) => place._id !== id));
      })
      .catch((error) => console.error(error));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="admin-dashboard-container">
      <nav className="dashboard-navbar">
        <div className="logo">Admin Dashboard</div>
        <div className="nav-center">
          <button className="nav-button" onClick={() => navigate("/addplace")}>
            Add Place
          </button>
          <button className="nav-button" onClick={() => navigate("/mapview")}>
            Map View
          </button>
        </div>
        <div className="nav-right">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div className="dashboard-content">
        <div className="admin-table-wrapper">
          <h2>Pending Places</h2>
          {loading ? (
            <p>Loading...</p>
          ) : pendingPlaces.length === 0 ? (
            <p className="no-pending-message">
              Pending places are not available.
            </p>
          ) : (
            <table className="pending-places-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Facilities</th>
                  <th>Proof</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingPlaces.map((place) => (
                  <tr key={place._id}>
                    <td>{place.name}</td>
                    <td>{place.facilities.join(", ")}</td>
                    <td>
                      {place.photos.map((img, ind) => {
                        const url = `${process.env.REACT_APP_IMAGE_URL}${img}`;
                        return (
                          <a
                            key={ind}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "inline-block",
                              marginRight: "10px",
                            }}
                          >
                            <img
                              src={url}
                              alt={`Proof ${ind + 1}`}
                              style={{
                                width: "50px",
                                height: "25px",
                                borderRadius: "4px",
                              }}
                            />
                          </a>
                        );
                      })}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <button
                          className="approve-button"
                          onClick={() => approvePlace(place._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-button"
                          onClick={() => rejectPlace(place._id)}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <h2 style={{ marginTop: "40px" }}>Rejected Places</h2>
          {loading ? (
            <p>Loading...</p>
          ) : rejectedPlaces.length === 0 ? (
            <p className="no-pending-message">No rejected places available.</p>
          ) : (
            <table className="pending-places-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Facilities</th>
                  <th>Proof</th>
                </tr>
              </thead>
              <tbody>
                {rejectedPlaces.map((place) => (
                  <tr key={place._id}>
                    <td>{place.name}</td>
                    <td>{place.facilities.join(", ")}</td>
                    <td>
                      {place.photos.map((img, ind) => {
                        const url = `${process.env.REACT_APP_IMAGE_URL}${img}`;
                        return (
                          <a
                            key={ind}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "inline-block",
                              marginRight: "10px",
                            }}
                          >
                            <img
                              src={url}
                              alt={`Proof ${ind + 1}`}
                              style={{
                                width: "50px",
                                height: "25px",
                                borderRadius: "4px",
                              }}
                            />
                          </a>
                        );
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;