import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import type { Truck } from '../types';
import { useAuth } from './AuthContext';

interface TruckContextType {
  trucks: Truck[];
  loading: boolean;
  error: string | null;
  getNearestTruck: (lat: number, lng: number) => Promise<Truck | null>;
  sendAlert: (truckId: string, message: string) => Promise<void>;
  retryConnection: () => Promise<void>;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  updateLocation: (lat: number, lng: number) => void;
}

const TruckContext = createContext<TruckContextType | null>(null);

const BACKEND_URL = 'http://localhost:5001';
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

export function TruckProvider({ children }: { children: React.ReactNode }) {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const { user } = useAuth();

  const connectSocket = () => {
    setConnectionStatus('connecting');
    const newSocket = io(BACKEND_URL, {
      reconnection: true,
      reconnectionAttempts: MAX_RETRIES,
      reconnectionDelay: RETRY_DELAY,
      timeout: 10000,
      auth: {
        userId: user?.id,
        userType: user?.type
      }
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setError(null);
      setConnectionStatus('connected');
    });

    newSocket.on('connect_error', () => {
      setConnectionStatus('disconnected');
      setError('Unable to establish real-time connection. Updates may be delayed.');
    });

    newSocket.on('disconnect', () => {
      setConnectionStatus('disconnected');
      setError('Connection lost. Attempting to reconnect...');
    });

    newSocket.on('locationUpdate', (updatedTruck: Truck) => {
      setTrucks(prevTrucks => 
        prevTrucks.map(truck => 
          truck.id === updatedTruck.id ? updatedTruck : truck
        )
      );
    });

    setSocket(newSocket);
    return newSocket;
  };

  const updateLocation = (lat: number, lng: number) => {
    if (socket && user?.type === 'garbage_man') {
      socket.emit('updateLocation', { lat, lng, userId: user.id });
    }
  };

  useEffect(() => {
    if (user?.type === 'garbage_man') {
      let locationInterval: NodeJS.Timeout;

      const trackLocation = () => {
        if ('geolocation' in navigator) {
          locationInterval = setInterval(() => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                updateLocation(latitude, longitude);
              },
              (error) => {
                console.error('Error getting location:', error);
              }
            );
          }, 1000);
        }
      };

      trackLocation();

      return () => {
        if (locationInterval) {
          clearInterval(locationInterval);
        }
      };
    }
  }, [user]);

  const fetchTrucks = async (retryAttempt = 0): Promise<void> => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/trucks/67d945da46a692813b5afbcc`);
      setTrucks(response.data);
      setError(null);
      setRetryCount(0);
    } catch (err) {
      if (retryAttempt < MAX_RETRIES) {
        setTimeout(() => {
          setRetryCount(retryAttempt + 1);
          fetchTrucks(retryAttempt + 1);
        }, RETRY_DELAY);
        setError(`Connection attempt ${retryAttempt + 1}/${MAX_RETRIES}. Retrying...`);
      } else {
        setError('Unable to connect to the tracking server. Please check your connection and try again.');
      }
    } finally {
      if (retryAttempt === 0) {
        setLoading(false);
      }
    }
  };

  const retryConnection = async () => {
    setLoading(true);
    setError(null);
    setRetryCount(0);
    await fetchTrucks();
    if (socket) {
      socket.disconnect();
    }
    connectSocket();
  };

  useEffect(() => {
    const currentSocket = connectSocket();
    fetchTrucks();

    return () => {
      currentSocket.disconnect();
    };
  }, []);

  const getNearestTruck = async (lat: number, lng: number) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/users/nearest-truck?lat=${lat}&lng=${lng}`
      );
      return response.data;
    } catch (err) {
      setError('Failed to find nearest truck. Please try again.');
      return null;
    }
  };

  const sendAlert = async (truckId: string, message: string) => {
    try {
      await axios.post(`${BACKEND_URL}/api/trucks/alert`, {
        truckId,
        message
      });
    } catch (err) {
      setError('Failed to send alert. Please try again.');
    }
  };

  return (
    <TruckContext.Provider value={{
      trucks,
      loading,
      error,
      getNearestTruck,
      sendAlert,
      retryConnection,
      connectionStatus,
      updateLocation
    }}>
      {children}
    </TruckContext.Provider>
  );
}

export function useTrucks() {
  const context = useContext(TruckContext);
  if (!context) {
    throw new Error('useTrucks must be used within a TruckProvider');
  }
  return context;
}