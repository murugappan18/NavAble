import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import L from "leaflet";
import RoutingControl from "../components/RoutingControl";
import axios from "axios";
import "../styles/mapview.css"; // ← Import your popup style here

const API_BASE = process.env.REACT_APP_BASE_URL;

// User location icon (blue)
const userIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -30],
});

// Approved marker icon (green)
const placeIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
});

// Component to mark user's geolocation
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
    <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon}>
      <Popup><strong>Your Location</strong></Popup>
    </Marker>
  ) : null;
}

function MapView() {
  const [userPosition, setUserPosition] = useState(null);
  const [destination, setDestination] = useState(null);
  const [approvedMarkers, setApprovedMarkers] = useState([]);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const res = await axios.get(`${API_BASE}/places/approved`);
        setApprovedMarkers(res.data);
      } catch (error) {
        console.error("Failed to fetch markers:", error);
      }
    };
    fetchMarkers();
  }, []);

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

        {approvedMarkers.map((marker) => (
          <Marker
            key={marker._id}
            position={[marker.position.lat, marker.position.lng]}
            icon={placeIcon}
          >
            <Popup>
              <strong>Place Name: </strong>{marker.name}
              <br />
              <strong>Facilities: </strong>{marker.facilities?.join(", ") || "None"}
              <br />
              {marker.photos?.length > 0 && (
                <div style={{ marginTop: "5px" }}>
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
              <br />
              <button
                onClick={() =>
                  setDestination({
                    lat: marker.position.lat,
                    lng: marker.position.lng,
                  })
                }
              >
                Go
              </button>
            </Popup>
          </Marker>
        ))}

        {userPosition?.lat && destination?.lat && (
          <RoutingControl
            userPosition={userPosition}
            destination={destination}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default MapView;