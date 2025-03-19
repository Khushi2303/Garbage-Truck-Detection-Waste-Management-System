import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, MapPin, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">WasteTrack</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Smart Waste Management</span>
              <span className="block text-blue-600">Real-Time Tracking</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Track garbage trucks in real-time, find the nearest collection point, and help keep our city clean.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <Link
                to="/register"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="flex justify-center">
                  <MapPin className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900">Real-Time Tracking</h3>
                <p className="mt-2 text-gray-500">
                  Track garbage trucks in real-time and find the nearest one to your location.
                </p>
              </div>
              <div className="text-center">
                <div className="flex justify-center">
                  <Truck className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900">Route Optimization</h3>
                <p className="mt-2 text-gray-500">
                  Efficient route planning for garbage collection to serve you better.
                </p>
              </div>
              <div className="text-center">
                <div className="flex justify-center">
                  <Users className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900">Community Engagement</h3>
                <p className="mt-2 text-gray-500">
                  Join our community effort to keep the city clean and sustainable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            © 2025 WasteTrack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}