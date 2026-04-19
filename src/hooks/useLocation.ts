import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export type LocationState =
  | { status: 'loading' }
  | { status: 'denied' }
  | { status: 'ready'; latitude: number; longitude: number };

export function useLocation(): LocationState {
  const [state, setState] = useState<LocationState>({ status: 'loading' });

  useEffect(() => {
    let sub: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setState({ status: 'denied' });
        return;
      }

      sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 60000, distanceInterval: 10 },
        ({ coords }) => {
          setState({ status: 'ready', latitude: coords.latitude, longitude: coords.longitude });
        }
      );
    })();

    return () => { sub?.remove(); };
  }, []);

  return state;
}
