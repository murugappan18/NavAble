import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userRole = JSON.parse(atob(token.split(".")[1])).role;
      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/register`,
        form
      );
      alert(res.data.message);
      navigate("/");
    } catch (err) {
      alert(err.response.data.message || "Error occurred");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
        <p>
          Already have an account? <a href="/">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Register;