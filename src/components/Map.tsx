import { LatLngExpression } from "leaflet";
import React from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

interface MapProps {
  lat: number;
  lng: number;
}

const Map: React.FC<MapProps> = ({ lat, lng }) => {
  const position: LatLngExpression = [lat, lng];

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.0.1/dist/leaflet.css"
      />
      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom={false}
        style={{ height: "50vh" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
      </MapContainer>
    </div>
  );
};

export default Map;
