import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet-routing-machine";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/addplace.css";

const userMarkerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -30],
});

const placeMarkerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
});

// Component to handle and mark user's geolocation
function LocationMarker({ userPosition, setUserPosition }) {
  const map = useMap();

  useEffect(() => {
    if (!userPosition) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        const latlng = { lat: latitude, lng: longitude };
        setUserPosition(latlng);
        map.setView([latlng.lat, latlng.lng], 15);
      });
    }
  }, [userPosition, map]);

  return userPosition ? (
    <Marker
      position={[userPosition.lat, userPosition.lng]}
      icon={userMarkerIcon}
    >
      <Popup className="custom-popup">Your Location</Popup>
    </Marker>
  ) : null;
}

function AddPlaceMarker({ onMapDoubleClick }) {
  useMapEvents({
    dblclick(e) {
      onMapDoubleClick(e.latlng);
    },
  });
  return null;
}

function AddPlace() {
  const [userPosition, setUserPosition] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [newPlace, setNewPlace] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    facilities: [],
  });
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/places/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setMarkers(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleMapClick = (latlng) => {
    setNewPlace(latlng);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to add a place.");
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("type", formData.type);
    payload.append("description", formData.description || "");
    payload.append("position", JSON.stringify(newPlace)); // ✅ fixed
    payload.append("facilities", JSON.stringify(formData.facilities)); // ✅ fixed
    photos.forEach((file) => payload.append("photos", file));

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/places`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Place submitted for approval.");
        setMarkers((prev) => [
          ...prev,
          {
            _id: `temp-${Date.now()}`,
            name: formData.name,
            facilities: formData.facilities,
            position: newPlace,
            status: "Pending",
          },
        ]);
        setNewPlace(null);
        setFormData({ name: "", type: "", description: "", facilities: [] });
        setPhotos([]);
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to submit. Please check your login session.");
      });
  };

  return (
    <div className="fullscreen-map">
      <MapContainer
        center={[13.0358, 80.2459]}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker
          userPosition={userPosition}
          setUserPosition={setUserPosition}
        />

        {markers.map((marker) => (
          <Marker
            key={marker._id}
            position={[marker.position.lat, marker.position.lng]}
            icon={placeMarkerIcon}
          >
            <Popup className="custom-popup">
              <strong>Place Name: </strong>{marker.name}
              <br />
              <strong>Facilities: </strong>{marker.facilities.join(", ")}
              <br />
              <strong>Status: </strong>{marker.status || "Approved"}
              {marker.photos && marker.photos.length > 0 && (
                <div className="popup-images">
                  {marker.photos.map((url, idx) => {
                    const link = `${process.env.REACT_APP_IMAGE_URL}${url}`;
                    return (
                      <a
                        key={idx}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={link}
                          alt={`Proof ${idx + 1}`}
                          style={{
                            width: "75px",
                            height: "50px",
                            border: "1px solid #000",
                            borderRadius: "4px",
                            marginTop: "5px",
                            marginRight: "5px",
                          }}
                        />
                      </a>
                    );
                  })}
                </div>
              )}
            </Popup>
          </Marker>
        ))}

        <AddPlaceMarker onMapDoubleClick={handleMapClick} />

        {newPlace && (
          <Marker
            position={[newPlace.lat, newPlace.lng]}
            icon={placeMarkerIcon}
          >
            <Popup
              className="custom-popup-form"
              autoClose={false}
              closeOnClick={false}
              closeButton={false}
              keepInView={true}
              eventHandlers={{
                remove: () => setNewPlace(null),
              }}
            >
              <form onSubmit={handleFormSubmit} encType="multipart/form-data">
                <label>
                  Place Name:
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </label>
                <br />
                <label>
                  Type of Place/Feature:
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    required
                  >
                    <option value="">--Select--</option>
                    <option value="Accessible Toilet">Accessible Toilet</option>
                    <option value="Elevator">Elevator</option>
                    <option value="Lift">Lift</option>
                    <option value="Ramp">Ramp</option>
                    <option value="Accessible Restaurant">
                      Accessible Restaurant
                    </option>
                    <option value="Parking">Parking</option>
                    <option value="Entrance">Entrance</option>
                  </select>
                </label>
                <br />
                <label>
                  Latitude:
                  <input type="text" value={newPlace.lat} readOnly />
                </label>
                <br />
                <label>
                  Longitude:
                  <input type="text" value={newPlace.lng} readOnly />
                </label>
                <br />
                <label>
                  Description:
                  <textarea
                    value={formData.description}
                    placeholder="Optional"
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </label>
                <br />
                <label>Facilities:</label>
                <div className="facilities-grid">
                  {[
                    "Step-free access",
                    "Wheelchair accessible restroom",
                    "Braille signage",
                    "Wide doorway",
                    "Automatic door",
                    "Hearing loop",
                    "Low counter",
                    "Accessible parking spot",
                    "Ramp available",
                    "Elevator access",
                  ].map((facility) => (
                    <label key={facility}>
                      <input
                        type="checkbox"
                        value={facility}
                        checked={formData.facilities.includes(facility)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setFormData((prev) => ({
                            ...prev,
                            facilities: isChecked
                              ? [...prev.facilities, facility]
                              : prev.facilities.filter((f) => f !== facility),
                          }));
                        }}
                      />
                      {facility}
                    </label>
                  ))}
                </div>
                <br />
                <label>
                  Upload Photos (optional):
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setPhotos(Array.from(e.target.files))}
                  />
                </label>
                <br />
                <button type="submit">Submit</button>
                <button
                  type="button"
                  onClick={() => {
                    setNewPlace(null);
                    setFormData({
                      name: "",
                      type: "",
                      description: "",
                      facilities: [],
                    });
                    setPhotos([]);
                  }}
                >
                  Cancel
                </button>
              </form>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default AddPlace;