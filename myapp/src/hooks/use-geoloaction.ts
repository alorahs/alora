import { useEffect, useState } from "react";
import type { Coordinates } from "../interfaces/geoloaction";

interface GeolocationState {
  Coordinates: Coordinates | null;
  error: string | null;
  isLoading: boolean;
}
export const useGeolocation = () => {
  const [locationData, setLocationData] = useState<GeolocationState>({
    Coordinates: null,
    error: null,
    isLoading: true,
  });
  const getLocation = () => {
    setLocationData((prev) => ({ ...prev, isLoading: true, error: null }));
    if (!navigator.geolocation) {
      setLocationData({
        Coordinates: null,
        error: "Geolocation is not supported",
        isLoading: false,
      });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationData({
          Coordinates: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          error: null,
          isLoading: false,
        });
      },(error) =>{
        let errorMessage: string;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location services";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request time out";
            break;
          default:
            errorMessage = "An unknown error occurred";
            
        }
        setLocationData({
          Coordinates: null,
          error: errorMessage,
          isLoading: false,
        });
      },{
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };
  useEffect(() => {
    getLocation();
  }, []);
  return {
    ...locationData,
    getLocation,
  };
};