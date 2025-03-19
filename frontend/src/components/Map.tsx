import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Define truck interface
interface Truck {
  _id: string;
  driverName: string;
  licensePlate: string;
  currentLocation: { lat: number; lng: number };
  route: { lat: number; lng: number }[];
  lastUpdated: string;
}

// Custom truck icon
const truckIcon = new L.Icon({
  iconUrl: 'https://i.pinimg.com/736x/d1/5e/d8/d15ed837841bd5b6a8e6a8dc6fb3d1f9.jpg', 
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

// Component to handle auto-zooming
function AutoZoom({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 16); // Smooth zoom to truck location
  }, [position, map]);
  return null;
}

export default function TruckTrackingMap() {
  const [truck, setTruck] = useState<Truck | null>(null);
  const [snappedRoute, setSnappedRoute] = useState<[number, number][]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Fetch truck data and snapped route
  useEffect(() => {
    const fetchTruckData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/trucks/67d945da46a692813b5afbcc');
        const data = await response.json();
        setTruck(data);

        if (data.route.length > 1) {
          const coordinates = data.route.map(p => `${p.lng},${p.lat}`).join(';');
          const routeResponse = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordinates}?geometries=geojson`);
          const routeData = await routeResponse.json();
          
          if (routeData.routes && routeData.routes.length > 0) {
            setSnappedRoute(routeData.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]));
          }
        }
      } catch (error) {
        console.error('Error fetching truck data:', error);
      }
    };

    fetchTruckData();
    const interval = setInterval(fetchTruckData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting user location:", error);
        },
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
    }
  }, []);

  return (
    <div className="w-full h-[500px] rounded-lg shadow-lg relative">
      <MapContainer center={truck?.currentLocation || [26.2183, 78.1828]} zoom={14} className="w-full h-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Auto-Zoom to Truck Location */}
        {truck && <AutoZoom position={[truck.currentLocation.lat, truck.currentLocation.lng]} />}

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <h3 className="font-bold">Your Location</h3>
              <p className="text-sm">Lat: {userLocation[0]}</p>
              <p className="text-sm">Lng: {userLocation[1]}</p>
            </Popup>
          </Marker>
        )}

        {/* Truck Location & Route */}
        {truck && (
          <>
            {/* Truck Marker */}
            <Marker position={[truck.currentLocation.lat, truck.currentLocation.lng]} icon={truckIcon}>
              <Popup>
                <h3 className="font-bold">{truck.driverName}</h3>
                <p className="text-sm">License: {truck.licensePlate}</p>
                <p className="text-sm">Current Location: {truck.currentLocation.lat}, {truck.currentLocation.lng}</p>
                <p className="text-xs text-gray-500">Last Updated: {new Date(truck.lastUpdated).toLocaleString()}</p>
              </Popup>
            </Marker>

            {/* Draw Road-Snapped Route (Red) */}
            {snappedRoute.length > 0 && (
              <Polyline
                positions={snappedRoute}
                color="red"
                weight={5}
              />
            )}
          </>
        )}
      </MapContainer>
    </div>
  );
}