import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

// Patch to prevent crashes when clearing lines
if (
  L?.Routing?.Control &&
  typeof L.Routing.Control.prototype._clearLines === "function"
) {
  const originalClearLines = L.Routing.Control.prototype._clearLines;

  L.Routing.Control.prototype._clearLines = function () {
    if (this._lines) {
      this._lines.forEach((line) => {
        if (line && line._map) {
          try {
            line.removeFrom(line._map);
          } catch (e) {
            console.warn("Error safely removing line:", e);
          }
        }
      });
    }

    try {
      originalClearLines.call(this);
    } catch (e) {
      console.warn("Error in _clearLines override:", e);
    }
  };
}

function RoutingControl({ userPosition, destination }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    // Defensive check
    if (
      !map ||
      !userPosition ||
      !destination ||
      !userPosition.lat ||
      !userPosition.lng ||
      !destination.lat ||
      !destination.lng
    ) {
      console.log("Waiting for valid waypoints:", userPosition, destination);
      return;
    }

    const from = L.latLng(userPosition.lat, userPosition.lng);
    const to = L.latLng(destination.lat, destination.lng);

    // Delay route rendering slightly to ensure map is fully mounted
    const timeout = setTimeout(() => {
      if (routingControlRef.current) {
        try {
          map.removeControl(routingControlRef.current);
        } catch (e) {
          console.warn("Failed to remove previous routing control:", e);
        }
        routingControlRef.current = null;
      }

      const control = L.Routing.control({
        waypoints: [from, to],
        routeWhileDragging: false,
        show: false,
        createMarker: () => null,
        router: new L.Routing.osrmv1({
          serviceUrl: "https://router.project-osrm.org/route/v1",
        }),
      }).addTo(map);

      routingControlRef.current = control;
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (routingControlRef.current) {
        try {
          map.removeControl(routingControlRef.current);
        } catch (e) {
          console.warn("Error during routing cleanup:", e);
        }
        routingControlRef.current = null;
      }
    };
  }, [map, userPosition, destination]);

  return null;
}

export default RoutingControl;