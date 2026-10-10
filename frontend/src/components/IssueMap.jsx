import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

const issueIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

// Demo coordinates for common Hyderabad areas
const areaCoordinates = {
  Kukatpally: [17.4849, 78.4138],
  Madhapur: [17.4483, 78.3915],
  Gachibowli: [17.4401, 78.3489],
  "Banjara Hills": [17.4156, 78.4347],
  Secunderabad: [17.4399, 78.4983]
};

function IssueMap({ issues }) {
  const defaultCenter = [17.4483, 78.3915];

  return (
    <div className="map-container">
      <MapContainer
        center={defaultCenter}
        zoom={11}
        style={{ height: "450px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {issues.map((issue) => {
          const coordinates =
            areaCoordinates[issue.area];

          if (!coordinates) {
            return null;
          }

          return (
            <Marker
              key={issue.id}
              position={coordinates}
              icon={issueIcon}
            >
              <Popup>
                <strong>{issue.category}</strong>

                <br />

                {issue.description}

                <br />

                <strong>Area:</strong>{" "}
                {issue.area}

                <br />

                <strong>Priority:</strong>{" "}
                {issue.priorityLevel}

                <br />

                <strong>Status:</strong>{" "}
                {issue.status}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default IssueMap;