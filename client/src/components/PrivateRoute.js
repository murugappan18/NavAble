import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" />;

  try {
    const userRole = JSON.parse(atob(token.split(".")[1])).role;

    // Convert role prop to array for flexibility
    const allowedRoles = Array.isArray(role) ? role : [role];

    if (role && !allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" />;
    }

    return children;
  } catch (err) {
    return <Navigate to="/" />;
  }
};

export default PrivateRoute;