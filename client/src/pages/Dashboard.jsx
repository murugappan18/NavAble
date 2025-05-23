import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        alert("Unauthorized");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-navbar">
        <div className="nav-left">
          <h2 className="logo">NavAble</h2>
        </div>
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
        {user ? <h1>Welcome, {user.username}</h1> : <p>Loading...</p>}
      </div>
    </div>
  );
};

export default Dashboard;