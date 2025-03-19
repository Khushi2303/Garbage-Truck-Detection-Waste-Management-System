import { useState } from 'react';
import { useTrucks } from '../context/TruckContext';
import Map from './Map';
import { MapPin, AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard({ userType }: { userType: 'garbage_man' | 'normal_user' }) {
  const { trucks, loading, error, getNearestTruck, retryConnection, connectionStatus } = useTrucks();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        getNearestTruck(latitude, longitude);
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          <p className="mt-4 text-gray-600">Loading trucks...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-800">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-8 rounded-lg shadow-lg text-center"
        >
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-4">{error}</h2>
          <button
            onClick={retryConnection}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Connection
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {userType === 'garbage_man' ? 'Garbage Truck Dashboard' : 'Truck Tracker'}
            </h1>
            <div className="flex items-center space-x-2">
              <AnimatePresence mode="wait">
                {connectionStatus === 'connected' ? (
                  <motion.div
                    key="connected"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center text-green-600"
                  >
                    <Wifi className="h-5 w-5 mr-1" />
                    <span className="text-sm">Connected</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="disconnected"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center text-red-600"
                  >
                    <WifiOff className="h-5 w-5 mr-1" />
                    <span className="text-sm">Disconnected</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="mb-6 flex justify-between items-center">
            <div>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-medium text-gray-900"
              >
                Active Trucks: {trucks.length}
              </motion.h2>
              {userType === 'normal_user' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGetLocation}
                  className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Find Nearest Truck
                </motion.button>
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="h-[600px]"
          >
            <Map
              trucks={trucks}
              center={userLocation || undefined}
            />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}