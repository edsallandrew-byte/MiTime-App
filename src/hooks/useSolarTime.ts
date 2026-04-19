import { useState, useEffect } from 'react';
import { getMiTime, formatMiTime } from '../utils/solarTime';

export function useSolarTime(longitude: number | null) {
  const [miTime, setMiTime] = useState<string>('--:--:-- --');

  useEffect(() => {
    if (longitude === null) return;

    const tick = () => setMiTime(formatMiTime(getMiTime(longitude)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [longitude]);

  return miTime;
}
