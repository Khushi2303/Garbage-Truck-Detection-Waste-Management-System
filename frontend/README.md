# Garbage-Truck-Detection-Waste-Management-System


## 🛠 Project Overview
The **Garbage Truck Tracking System** is a web-based application that allows users to track garbage trucks in real-time. The system includes:
- Live location tracking of garbage trucks 🚛
- Display of predefined truck routes 🛣️
- User location detection 📍
- Automatic zoom to truck position 🔍
- Route alignment with roads using **OSRM Routing API** 🛤️

## 🏗 Tech Stack
- **Frontend**: React, Leaflet, TypeScript
- **Backend**: Node.js, Express
- **Database**: MongoDB (for storing truck data)
- **APIs**:
  - OpenStreetMap (TileLayer & Geolocation)
  - OSRM (Open Source Routing Machine for road-snapped routes)

## 🚀 Features
- **Real-time Truck Location**: Displays the current position of a truck.
- **Live Route Tracking**: The predefined route of the truck is drawn as a **red polyline**, properly snapped to roads.
- **User Location Marker**: Displays the user's location on the map.
- **Auto-Zoom on Truck Movement**: Automatically follows the truck when it moves.
- **Background Data Refresh**: Fetches truck updates every 5 seconds.

## 📦 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/garbage-truck-tracking.git
cd garbage-truck-tracking
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Start the Backend (Node.js Server)
```bash
cd backend
npm install
npm start
```

### 4️⃣ Start the Frontend (React App)
```bash
cd frontend
npm install
npm run dev
```

## 🌍 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/trucks/:id` | Fetch truck details (location, route, driver info) |
| `GET` | `/api/trucks` | Fetch all trucks |
| `POST` | `/api/trucks/update` | Update truck location |

## 📌 How It Works
1. The system fetches real-time truck data from the backend.
2. The truck’s live location is displayed with a **truck marker**.
3. The route is snapped to roads using the **OSRM Routing API**.
4. Users can see both their location and the truck’s location.
5. The app refreshes every 5 seconds for live updates.

## 📷 Screenshots
<img width="1678" alt="Screenshot 2025-03-18 at 11 16 10 PM" src="https://github.com/user-attachments/assets/799d05b5-f03e-4db9-b590-121f71c9d9d1" />
<img width="512" alt="Screenshot 2025-03-18 at 11 15 24 PM" src="https://github.com/user-attachments/assets/91e2ee24-ccd7-4ad6-8cdf-62065cb32d41" />
<img width="530" alt="Screenshot 2025-03-18 at 11 15 48 PM" src="https://github.com/user-attachments/assets/6630adf3-3f0b-49d6-993f-7d1581daa7d5" />
<img width="1222" alt="Screenshot 2025-03-18 at 11 14 55 PM" src="https://github.com/user-attachments/assets/ad180723-b4c8-4f3d-92c0-7987297dfa38" />


## 🤝 Contributions
Feel free to contribute by opening issues and submitting pull requests! 🚀

## 📝 License
This project is licensed under the MIT License.

---
💡 **Developed by [Tejaswa Jhode and Khushi Shikarwar])**

