import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MapView from "./pages/MapView";
import AdminDashboard from "./pages/AdminDashboard";
import AddPlace from "./pages/AddPlace";
import UnAuthorized from "./pages/UnAuthorized";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute role="user">
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/mapview"
          element={
            <PrivateRoute role={["user", "admin"]}>
              <MapView />
            </PrivateRoute>
          }
        />
        <Route
          path="/addplace"
          element={
            <PrivateRoute role={["user", "admin"]}>
              <AddPlace />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/unauthorized" element={<UnAuthorized />} />
        <Route path="*" element={<UnAuthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
